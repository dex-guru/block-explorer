import { AddressType } from './types'
import { getShortAddress } from '@/lib/utils'

type AddressValueProps = {
  format: (address: string) => string
  url: (address: string) => string
  canBeShort?: boolean
}

export const AddressValues: Record<AddressType, AddressValueProps> = {
  account: {
    format: (address: string) => {
      return getShortAddress(address)
    },
    url: (address: string) => {
      return `/address/${address}`
    },
    canBeShort: true,
  },
  tx: {
    format: (address: string) => {
      return getShortAddress(address)
    },
    url: (address: string) => {
      return `/tx/${address}`
    },
    canBeShort: true,
  },
  block: {
    format: (address: string) => {
      return address
    },
    url: (address: string) => {
      return `/block/${address}`
    },
    canBeShort: false,
  },
}
