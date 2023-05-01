export type AddressType = 'account' | 'tx' | 'block'

export type AddressProps = {
  address?: string
  type: AddressType
  className?: string
  isShorten?: boolean
  isCopy?: boolean
}
