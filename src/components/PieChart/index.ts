import dynamic from 'next/dynamic'

export * from './types'

const PieChart = dynamic(() => import('./PieChart'), {
  ssr: false,
})

export default PieChart
