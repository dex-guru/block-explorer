import dynamic from 'next/dynamic'

import JazzIcon from './JazzIcon'
import { AvatarProps, AvatarType } from './types'

export type { AvatarProps, AvatarType }

const Avatar = dynamic(() => import('./Avatar'), { ssr: false })

export { JazzIcon }
export * from './utils'
export default Avatar
