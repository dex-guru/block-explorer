import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { AddressValues } from './helpers'
import { AddressProps, AddressType } from './types'
import './Address.module.scss'

const Address: FC<AddressProps> = ({ address, type, className }) => {
  const addressData = {
    url: AddressValues[type].url(address),
    caption: AddressValues[type].format(address),
  }

  return (
    <Link href={addressData.url} className={clsx('address', className)}>
      <span className="caption">{addressData.caption}</span>
    </Link>
  )
}

export default Address
