export type AddressType = 'account' | 'tx' | 'block' | 'token' | 'common'

export type AddressProps = {
  address?: string
  type?: AddressType
  className?: string
  isShorten?: boolean
  isCopy?: boolean
  isLink?: boolean
}
