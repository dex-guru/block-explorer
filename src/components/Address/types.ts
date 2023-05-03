export type AddressType = 'account' | 'tx' | 'block' | 'common'

export type AddressProps = {
  address?: string
  type?: AddressType
  className?: string
  isShorten?: boolean
  isCopy?: boolean
  isLink?: boolean
}
