if (
  process.env.NEXT_PUBLIC_APM_SERVER_URL !== undefined &&
  process.env.NEXT_PUBLIC_CHAIN_ID !== undefined
) {
  module.exports = {
    serverUrl: process.env.NEXT_PUBLIC_APM_SERVER_URL,
    serviceName: `FE-node-block-explorer_${process.env.NEXT_PUBLIC_CHAIN_ID}`,
    secretToken: 'some_secret_token',
  }
} else {
  console.error(
    'NEXT_PUBLIC_APM_SERVER_URL or NEXT_PUBLIC_CHAIN_ID not defined'
  )
}
