import { FC } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { getShortAddress } from '@/lib/utils'

export type AddressType = 'account' | 'tx' | 'block'

const AddressValues: Record<
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
      return `/tx/${address}`
    },
  },
  block: {
    format: (address: string) => {
      return address
    },
    url: (address: string) => {
      return `/block/${address}`
    },
  },
}

const Address: FC<{
  address: string
  type: AddressType
  className?: string
}> = ({ address, type, className }) => {
  const addressData = {
    url: AddressValues[type].url(address),
    caption: AddressValues[type].format(address),
  }

  return (
    <Link href={addressData.url} className={classNames('address', className)}>
      <span className="caption">{addressData.caption}</span>
    </Link>
  )
}

export default Address
