// import { init as initApm } from '@elastic/apm-rum'
// import { CHAIN_ID } from '@/constants'

// const apm = initApm({
//   // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
//   serviceName: `block-explorer_${CHAIN_ID}`,
//   serverUrl: apmServerUrl,
//   serviceVersion: process.env.GIT_COMMIT,
//   pageLoadTransactionName: '/',
//   active: true,
//   logLevel: 'warn',
//   transactionSampleRate: Number.parseFloat(
//     process.env.REACT_APP_RUM_TRANSACTION_SAMPLING_RATE || '1'
//   ),
//   centralConfig: true,
//   distributedTracingOrigins: environment.getAllApiOrigins(),
//   environment: process.env.REACT_APP_ENVIRONMENT,
// })
