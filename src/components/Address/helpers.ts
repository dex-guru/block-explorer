import { getAddress } from '@ethersproject/address'
import { isAddress } from '@ethersproject/address'
import { AddressType } from './types'
import { getShortAddress } from '@/lib/utils'

type AddressValueProps = {
  format?: (address: string, shorten?: boolean) => string
  url?: (address: string, text?: string) => string
  canBeShort?: boolean
}

export const AddressValues: Record<AddressType, AddressValueProps> = {
  common: {},

  account: {
    format: (address: string, shorten = true) => {
      const checkSumAddress = isAddress(address) ? getAddress(address) : address

      if (shorten) {
        return getShortAddress(checkSumAddress)
      }

      return checkSumAddress
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

  token: {
    format: (address: string) => {
      return getShortAddress(address)
    },
    url: (address: string) => {
      return `/address/${address}`
    },
    canBeShort: false,
  },

  cosmos: {
    format: (address: string) => {
      return address.slice(0, 20)
    },
    canBeShort: true,
  },
}
