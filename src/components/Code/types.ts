export type CodeFormat = 'dec' | 'hex' | 'ascii' | 'custom'

export type CodeProps = {
  children?: string
  className?: string
  isCopy?: boolean
  defaultFormat?: CodeFormat
  format?: {
    dec?: boolean
    hex?: boolean
    decode?: (value: string) => string
  }
}
