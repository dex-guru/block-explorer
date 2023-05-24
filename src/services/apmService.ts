import { init, ApmBase } from '@elastic/apm-rum'
import { CHAIN_ID } from '@/constants'

let apm: ApmBase | undefined

const apmServerUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://apm.dex.guru'
    : 'https://apm-stage-lax.dexguru.biz'

export const initApm = (): ApmBase | undefined => {
  apm = init({
    serviceName: `FE-block-explorer_${CHAIN_ID}`,
    serverUrl: apmServerUrl,
    serviceVersion: process.env.GIT_COMMIT,
    pageLoadTransactionName: '/',
    active: true,
    logLevel: 'warn',
    transactionSampleRate: Number.parseFloat(
      process.env.REACT_APP_RUM_TRANSACTION_SAMPLING_RATE || '1'
    ),
    centralConfig: true,
    environment: process.env.NODE_ENV,
  })
  return apm
}

export default apm
