import dynamic from 'next/dynamic'
import { AvatarProps, AvatarType } from './types'

export type { AvatarProps, AvatarType }

const Avatar = dynamic(() => import('./Avatar'), { ssr: false })

export default Avatar
