/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const express = require('express')
const zlib = require('node:zlib')
const { createClient } = require('redis')
const next = require('next')

const redisURL = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
    }
  : undefined

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || ''

console.log('[ Redis Client] Using Redis URL:', redisURL)

const redis = createClient(redisURL)
let isRedisConnected = false

redis.on('error', (err) => {
  if (isRedisConnected) {
    console.log('[ Redis Client Error ]', err)
  }

  if (err?.code === 'ECONNREFUSED') {
    isRedisConnected = false
  }
})

redis.on('connect', () => {
  console.log('[ Redis Client ] Connected')
  isRedisConnected = true
})

redis.on('disconnect', () => {
  console.log('[ Redis Client ] Disconnected')
  isRedisConnected = false
})

const app = next({ dev: false })
const handle = app.getRequestHandler()

const getJsonKey = (req) =>
  `props:${req.url.split('/').slice(4).join('/')}:${chainId}`
const getSsrKey = (req) => `page:${req.url}:${chainId}`

const getRedisReady = () => isRedisConnected && redis.isReady

async function jsonCache(req, res, time = 15 * 60 * 1000) {
  const isRedisReady = getRedisReady()

  const key = getJsonKey(req)
  const cache = isRedisReady ? await redis.get(key) : null

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Encoding', isRedisReady ? 'br' : 'gzip')
  res.setHeader('X-Content-Source', cache ? 'cache' : 'direct')
  res.setHeader('X-Content-Redis', isRedisReady ? 'alive' : 'gone')

  if (cache) {
    res.setHeader('X-Cache-Key', key)
    const buff = Buffer.from(cache, 'base64')

    return res.send(buff)
  } else {
    if (isRedisReady) {
      redis.del(key)
    }
  }

  const rawResEnd = res.end
  const rawResWrite = res.write

  const data = await new Promise(async (resolve) => {
    const chunks = []

    res.write = new Proxy(res.write, {
      apply(target, thisArg, args) {
        const chunk = Buffer.from(args[0])
        chunks.push(chunk)
      },
    })
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

  const compressedData = isRedisReady
    ? zlib.brotliCompressSync(response)
    : zlib.gzipSync(response)
  const buff = Buffer.from(compressedData).toString('base64')

  if (isRedisReady && res.statusCode === 200 && data && buff) {
    redis.set(key, buff, { EX: time })
  }

  return res.end(compressedData)
}

async function ssrCache(req, res, time = 15 * 60 * 1000) {
  const isRedisReady = getRedisReady()

  const key = getSsrKey(req)
  const cache = isRedisReady ? await redis.get(key) : null

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Encoding', isRedisReady ? 'br' : 'gzip')
  res.setHeader('X-Content-Source', cache ? 'cache' : 'direct')
  res.setHeader('X-Content-Redis', isRedisReady ? 'alive' : 'gone')

  if (cache) {
    res.setHeader('X-Cache-Key', key)
    let buff = Buffer.from(cache, 'base64')

    return res.send(buff)
  } else {
    if (isRedisReady) {
      redis.del(key)
    }
  }

  const data =
    (await app.renderToHTML(req, res, req.path, {
      ...req.query,
      ...req.params,
    })) + `<!-- cache @ ${new Date().toLocaleString()} -->`

  const compressedData = isRedisReady
    ? zlib.brotliCompressSync(data)
    : zlib.gzipSync(data)
  let buff = Buffer.from(compressedData).toString('base64')

  if (isRedisReady && res.statusCode === 200 && data && buff) {
    redis.set(key, buff, { EX: time })
  }

  return res.send(compressedData)
}

app.prepare().then(async () => {
  const server = express()
  console.log('[ Redis Client ] Connecting...')
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

  if (process.env.JSON_URLS_CACHE_TIME) {
    const json = JSON.parse(process.env.JSON_URLS_CACHE_TIME)
    Object.entries(json).forEach(([url, time]) => {
      console.log(
        `[ Block Explorer Server ] > Props request "${url}" cache for ${time}ms`
      )
      server.get(`/_next/data/:hash${url}`, (req, res) =>
        jsonCache(req, res, time)
      )
    })
  }

  server.get('*', (req, res) => handle(req, res))

  server.listen(3000, (err) => {
    if (err) {
      throw err
    }
    console.log(`[ Block Explorer Server ] > Ready!`)
  })
})
