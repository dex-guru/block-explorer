export type AddressType = 'account' | 'tx' | 'block' | 'token' | 'common' | 'cosmos'

export type AddressProps = {
  address?: string
  type?: AddressType
  className?: string
  isShorten?: boolean
  isCopy?: boolean
  isLink?: boolean
  showIcon?: boolean

  logo?: string | null
  title?: string
}
