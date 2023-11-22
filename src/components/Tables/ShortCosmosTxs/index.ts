import dynamic from 'next/dynamic'

export * from './ShortCosmosTxs'

const ShortCosmosTxs = dynamic(() => import('./ShortCosmosTxs'), { ssr: false })

export default ShortCosmosTxs
