import dynamic from 'next/dynamic'
import BlockOverview from './BlockOverview'

const TxOverview = dynamic(() => import('./TxOverview'))
const TxLogs = dynamic(() => import('./TxLogs'))
const TxTrace = dynamic(() => import('./TxTrace'))

export { BlockOverview, TxOverview, TxLogs, TxTrace }
