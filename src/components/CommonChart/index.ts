import dynamic from 'next/dynamic'

export * from './types'

const CommonChart = dynamic(() => import('./CommonChart'), {
  ssr: false,
})

export default CommonChart
