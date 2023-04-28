import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { AddressValues } from './helpers'
import { AddressProps } from './types'
import styles from './Address.module.scss'

const Address: FC<AddressProps> = ({
  address,
  type,
  className,
  isShorten = true,
}) => {
  const values = AddressValues[type]

  if (!address || !values) {
    return null
  }

  const tooltipData =
    values.canBeShort && isShorten
      ? {
          'data-tooltip-id': 'app-tooltip',
          'data-tooltip-content': address,
        }
      : {}

  return (
    <Link
      href={values.url(address)}
      className={clsx(styles.container, className)}
      {...tooltipData}
    >
      {isShorten ? values.format(address) : address}
    </Link>
  )
}

export default Address
