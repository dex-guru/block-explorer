import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { AddressValues } from './helpers'
import { AddressProps } from './types'
import './Address.module.scss'

const Address: FC<AddressProps> = ({ address, type, className }) => {
  const values = AddressValues[type]
  if (!address || !values) {
    return null
  }

  const addressData = {
    url: values.url(address),
    caption: values.format(address),
  }

  return (
    <Link href={addressData.url} className={clsx('address', className)}>
      <span className="caption">{addressData.caption}</span>
    </Link>
  )
}

export default Address
