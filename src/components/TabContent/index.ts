import dynamic from 'next/dynamic'

const TxOverview = dynamic(() => import('./TxOverview'))
const TxLogs = dynamic(() => import('./TxLogs'))
const TxTrace = dynamic(() => import('./TxTrace'))

export { TxOverview, TxLogs, TxTrace }
