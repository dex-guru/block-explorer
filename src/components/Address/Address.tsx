import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Copy from '../Copy'
import { AddressValues } from './helpers'
import { AddressProps } from './types'
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

  const linkUrl = !!isLink && !!values.url ? values.url(address) : null
  const addressDisplay =
    isShorten && values.format ? values.format(address) : address

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
