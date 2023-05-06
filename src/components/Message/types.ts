import { ReactNode } from 'react'
import { ButtonProps } from '../Button'

export type MessageType = 'info' | 'danger' | 'warn' | 'success' | 'prompt'

export type MessageProps = {
  text?: ReactNode
  type?: 'info' | 'danger' | 'warn' | 'success' | 'prompt'
  className?: string
  actions?: ButtonProps[]
  children?: ReactNode
}
