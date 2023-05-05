export type CodeFormat = 'dec' | 'hex' | 'custom'

export type CodeProps = {
  children?: string
  className?: string
  isCopy?: boolean
  defaultFormat?: CodeFormat
  format?: {
    dec?: boolean
    hex?: boolean
    ascii?: boolean
    decode?: (value: string) => string
  }
}
