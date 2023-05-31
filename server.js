/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const { gzip } = require('node-gzip')
const { createClient } = require('redis')
const next = require('next')

const client = createClient()

client.on('error', (err) => console.log('Redis Client Error', err))

const app = next({ dev: false })
const handle = app.getRequestHandler()

const getJsonKey = (req) =>
  req.path
    .match(/\/([^\/]+)+/g)
    .slice(3)
    .join('')

const getSsrKey = (req) => {
  return req.url
}

async function jsonCache(req, res, time = 60 * 60 * 1000) {
  const key = getJsonKey(req)
  const cache = await client.get(key)

  console.log('jsonCache', req.url, key)

  if (cache) {
    const headersToWrite = {
      'content-type': 'application/json',
      'content-encoding': 'gzip',
    }
    const buffer = JSON.parse(cache, (k, v) => {
      if (
        v !== null &&
        typeof v === 'object' &&
        'type' in v &&
        v.type === 'Buffer' &&
        'data' in v &&
        Array.isArray(v.data)
      ) {
        return Buffer.from(v.data)
      }
      return v
    })

    Object.entries(headersToWrite).forEach(([key, value]) =>
      res.setHeader(key, value)
    )
    return res.send(buffer)
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
  const response = isChunked ? Buffer.concat(data) : Buffer.from(data)
  const serializedResponse = isChunked
    ? JSON.stringify(response)
    : JSON.stringify(await gzip(response))

  if (res.statusCode === 200 && data) {
    client.set(key, serializedResponse, { EX: time })
  }

  return res.end(response)
}

async function ssrCache(req, res, time = 60 * 60 * 1000) {
  console.log('ssrCache', req.url)

  const key = getSsrKey(req)

  const cache = await client.get(key)

  if (cache) {
    return res.send(
      cache + `<!-- cache out @ ${new Date().toLocaleString()} -->`
    )
  }

  const data =
    (await app.renderToHTML(req, res, req.path, {
      ...req.query,
      ...req.params,
    })) + `<!-- cache in  @ ${new Date().toLocaleString()} -->`

  if (res.statusCode === 200 && data) {
    client.set(key, data, { EX: time })
  }

  return res.send(data)
}

app.prepare().then(async () => {
  const server = express()
  await client.connect()

  server.get('/', (req, res) => ssrCache(req, res))
  server.get('/address/*', (req, res) => ssrCache(req, res, 5 * 60 * 1000))
  server.get('/holdings/*', (req, res) => ssrCache(req, res, 5 * 60 * 1000))
  server.get('/blocks/*', (req, res) => ssrCache(req, res, 10 * 60 * 1000))
  server.get('/block/*', (req, res) => ssrCache(req, res, 24 * 60 * 60 * 1000))
  server.get('/txs/*', (req, res) => ssrCache(req, res, 10 * 60 * 1000))
  server.get('/tx/*', (req, res) => ssrCache(req, res, 24 * 60 * 60 * 1000))

  server.get('/_next/data/*', (req, res) => {
    return jsonCache(req, res)
  })

  server.get('*', (req, res) => handle(req, res))

  server.listen(3000, (err) => {
    if (err) {
      throw err
    }
    console.log(`> Ready!`)
  })
})
