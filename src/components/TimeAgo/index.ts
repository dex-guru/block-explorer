import dynamic from 'next/dynamic'

const TimeAgo = dynamic(() => import('./TimeAgo'), { ssr: false })

export default TimeAgo
