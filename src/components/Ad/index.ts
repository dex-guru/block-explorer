import dynamic from 'next/dynamic'

const Ad = dynamic(() => import('./Ad'), { ssr: false })

export default Ad
