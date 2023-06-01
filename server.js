/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const zlib = require('node:zlib')
const { createClient } = require('redis')
const next = require('next')

const redisServer = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
    }
  : undefined

const redis = createClient(redisServer)
redis.on('error', (err) => console.log('[ Redis Client Error ]', err))

const app = next({ dev: false })
const handle = app.getRequestHandler()

const getJsonKey = (req) => 'props:' + req.url.split('/').slice(4).join('/')

const getSsrKey = (req) => 'page:' + req.url

async function jsonCache(req, res, time = 60 * 60 * 1000) {
  const key = getJsonKey(req)
  const cache = await redis.get(key)

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Encoding', 'br')
  res.setHeader('X-Content-Source', cache ? 'cache' : 'direct')

  if (cache) {
    let buff = Buffer.from(cache, 'base64')

    return res.send(buff)
  }

  const rawResEnd = res.end
  const rawResWrite = res.write
  const chunks = []

  const proxyWrite = new Proxy(res.write, {
    apply(target, thisArg, args) {
      const chunk = Buffer.from(args[0])
      chunks.push(chunk)
    },
  })

  res.write = proxyWrite

  const data = await new Promise(async (resolve) => {
    res.end = async (res) => {
      resolve(res || chunks)
    }
    await app.render(req, res, req.path, {
      ...req.query,
      ...req.params,
    })
  })

  res.write = rawResWrite
  res.end = rawResEnd

  const isChunked = Array.isArray(data)
  const response = isChunked
    ? zlib.gunzipSync(Buffer.concat(data))
    : Buffer.from(data)

  const compressedData = zlib.brotliCompressSync(response)
  let buff = Buffer.from(compressedData).toString('base64')

  if (res.statusCode === 200 && data) {
    redis.set(key, buff, { EX: time })
  }

  return res.end(compressedData)
}

async function ssrCache(req, res, time = 60 * 60 * 1000) {
  const key = getSsrKey(req)
  const cache = await redis.get(key)

  res.setHeader('Content-Encoding', 'br')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Content-Source', cache ? 'cache' : 'direct')

  if (cache) {
    res.setHeader('X-Content-Source', 'cache')
    let buff = Buffer.from(cache, 'base64')

    return res.send(buff)
  }

  const data =
    (await app.renderToHTML(req, res, req.path, {
      ...req.query,
      ...req.params,
    })) + `<!-- cache @ ${new Date().toLocaleString()} -->`

  const compressedData = zlib.brotliCompressSync(data)
  let buff = Buffer.from(compressedData).toString('base64')

  if (res.statusCode === 200 && data) {
    redis.set(key, buff, { EX: time })
  }

  return res.send(compressedData)
}

app.prepare().then(async () => {
  const server = express()
  await redis.connect()

  if (process.env.SSR_URLS_CACHE_TIME) {
    const json = JSON.parse(process.env.SSR_URLS_CACHE_TIME)
    Object.entries(json).forEach(([url, time]) => {
      console.log(
        `[ Block Explorer Server ] > Page request "${url}" cache for ${time}ms`
      )
      server.get(url, (req, res) => ssrCache(req, res, time))
    })
  }

  server.get('/_next/data/*', (req, res) => {
    return jsonCache(req, res)
  })

  server.get('*', (req, res) => handle(req, res))

  server.listen(3000, (err) => {
    if (err) {
      throw err
    }
    console.log(`[ Block Explorer Server ] > Ready!`)
  })
})
