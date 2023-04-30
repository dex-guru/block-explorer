import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Copy from '../Copy'
import { AddressValues } from './helpers'
import { AddressProps } from './types'
import styles from './Address.module.scss'

const Address: FC<AddressProps> = ({
  address,
  type,
  className,
  isShorten = true,
  isCopy,
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
    <span className={clsx(styles.container, className)}>
      <Link href={values.url(address)} className={styles.link} {...tooltipData}>
        {isShorten ? values.format(address) : address}
      </Link>
      {isCopy && <Copy text={address} />}
    </span>
  )
}

export default Address
