import { AddressType } from './types'
import { getShortAddress } from '@/lib/utils'

export const AddressValues: Record<
  AddressType,
  { format: (address: string) => string; url: (address: string) => string }
> = {
  account: {
    format: (address: string) => {
      return getShortAddress(address)
    },
    url: (address: string) => {
      return `/address/${address}`
    },
  },
  tx: {
    format: (address: string) => {
      return getShortAddress(address)
    },
    url: (address: string) => {
      return `/txs/${address}`
    },
  },
  block: {
    format: (address: string) => {
      return address
    },
    url: (address: string) => {
      return `/blocks/${address}`
    },
  },
}
