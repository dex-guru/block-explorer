import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { AddressValues } from './helpers'
import { AddressProps } from './types'
import Copy from '@/components/Copy'
import styles from './Address.module.scss'

const Address: FC<AddressProps> = ({
  address,
  type = 'common',
  className,
  isShorten = true,
  isCopy,
  isLink = true,
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

  const linkUrl = !!isLink ? values.url(address) : null
  const addressDisplay = values.format(address, isShorten)

  return (
    <span className={clsx(styles.container, className)}>
      {!!linkUrl && (
        <Link href={linkUrl} className={styles.link} {...tooltipData}>
          {addressDisplay}
        </Link>
      )}

      {!linkUrl && (
        <span className={styles.link} {...tooltipData}>
          {addressDisplay}
        </span>
      )}

      {isCopy && (
        <>
          {' '}
          <Copy text={address} className={styles.copy} />
        </>
      )}
    </span>
  )
}

export default Address
