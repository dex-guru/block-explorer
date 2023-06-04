module.exports = {
  serverUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://apm.dex.guru'
      : 'https://apm-stage-lax.dexguru.biz',
  serviceName: `FE-node-block-explorer_${process.env.NEXT_PUBLIC_CHAIN_ID}`,
  secretToken: 'some_secret_token',
}
