import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { AddressValues } from '../Address/helpers'
import { TokenProps } from './types'
import { IconNoIcon } from '@/components'
import styles from './Token.module.scss'

const Token: FC<TokenProps> = ({ address, logo, name, symbol, className }) => {
  const logoImage = logo ? (
    <Image
      src={logo}
      width={24}
      height={24}
      alt={symbol}
      className={styles.icon}
    />
  ) : (
    <IconNoIcon className={styles.icon} />
  )

  const content = (
    <>
      {logoImage}

      <span className={styles.content}>
        <span className={styles.symbol}>
          <span className={styles.symbolCaption}>{symbol}</span>
        </span>

        {!!name && (
          <span
            className={styles.name}
            data-tooltip-content={name}
            data-tooltip-id="app-tooltip"
          >
            (<span className={styles.nameCaption}>{name}</span>)
          </span>
        )}
      </span>
    </>
  )

  if (address) {
    return (
      <Link
        href={AddressValues.token.url(address) || ''}
        className={clsx(styles.container, className)}
      >
        {content}
      </Link>
    )
  }

  return <div className={clsx(styles.container, className)}>{content}</div>
}

export default Token
