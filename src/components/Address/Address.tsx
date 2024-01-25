import Image from 'next/image'
import Link from 'next/link'

import { FC } from 'react'

import clsx from 'clsx'

import Copy from '@/components/Copy'

import Avatar from '../Avatar'
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
  showIcon = false,
  logo,
  title,
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
  const addressDisplay = (
    <>
      {showIcon &&
        (logo ? (
          <Image src={logo} alt={address} className={styles.icon} width={24} height={24} />
        ) : (
          <Avatar address={address} className={styles.icon} />
        ))}

      {title || values.format(address, isShorten)}
    </>
  )

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
