import dynamic from 'next/dynamic'

const EnsName = dynamic(() => import('./EnsName'), { ssr: false })

export * from './types'

export default EnsName
