import Image from 'next/image'
import Link from 'next/link'

import { FC } from 'react'

import clsx from 'clsx'

import { AddressValues } from '@/components/Address/helpers'
import { IconNoIcon } from '@/components/Icons'

import Avatar from '../Avatar/Avatar'
import { TokenProps } from './types'

import styles from './Token.module.scss'

const Token: FC<TokenProps> = ({ address, logo, name, symbol, className }) => {
  const logoImage = logo ? (
    <Image src={logo} width={24} height={24} alt={symbol} className={styles.icon} />
  ) : address ? (
    <Avatar address={address} className={styles.icon} />
  ) : (
    <IconNoIcon className={styles.icon} />
  )

  const content = (
    <>
      {logoImage}

      <span className={styles.content}>
        <span className={styles.symbol}>{symbol}</span>

        {!!name && (
          <span className={styles.name} data-tooltip-content={name} data-tooltip-id="app-tooltip">
            {name}
          </span>
        )}
      </span>
    </>
  )

  if (address) {
    return (
      <Link
        href={AddressValues.token.url(address) || ''}
        className={clsx(styles.container, className)}>
        {content}
      </Link>
    )
  }

  return <div className={clsx(styles.container, className)}>{content}</div>
}

export default Token
