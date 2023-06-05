import { init, ApmBase } from '@elastic/apm-rum'
import { CHAIN_ID } from '@/constants'

let apm: ApmBase | undefined

export const initApm = (): ApmBase | undefined => {
  if (apm) {
    return apm
  }
  apm = init({
    serviceName: `FE-block-explorer_${CHAIN_ID}`,
    serverUrl: process.env.NEXT_PUBLIC_APM_SERVER_URL,
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

export const sendApmError = (errorMessage: string): void => {
  const apm = initApm()
  if (apm) {
    apm.captureError(errorMessage)
  }
}

export default apm
