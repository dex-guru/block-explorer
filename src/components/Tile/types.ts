import { ReactNode } from 'react'
import { AvatarType } from '../Avatar'

export type TileProps = {
  title: ReactNode
  prefix?: ReactNode
  postfix?: ReactNode
  letters?: string
  className?: string
  avatarType?: AvatarType
}
