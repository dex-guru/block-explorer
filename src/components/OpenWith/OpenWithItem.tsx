import Image from 'next/image'
import Link from 'next/link'

import { FC, ReactNode, useCallback } from 'react'

import clsx from 'clsx'

import Heading from '@/components/Heading'
import { IconQuestion } from '@/components/Icons'
import { ExplorerData, explorers } from '@/constants/explorers'
import IconCoinMarketCap from '@/images/explorers/coinmarketcap.svg'
import IconDexGuru from '@/images/explorers/dexguru.svg'
import IconEigenPhi from '@/images/explorers/eigenphi.svg'
import IconTenderly from '@/images/explorers/tenderly.svg'

import { OpenWithItemProps } from './types'

import styles from './OpenWith.module.scss'

const getLogo = (el: ExplorerData): ReactNode => {
  if (el.id === 'dexguru') {
    return <IconDexGuru width={24} height={24} className={styles.icon} />
  }

  if (el.id === 'tenderly') {
    return <IconTenderly width={24} height={24} className={styles.icon} />
  }

  if (el.id === 'eigenphi') {
    return <IconEigenPhi width={24} height={24} className={styles.icon} />
  }

  if (el.id === 'coinMarketCap') {
    return <IconCoinMarketCap width={24} height={24} className={styles.icon} />
  }

  if (el.logo_uri) {
    return (
      <Image
        src={el.logo_uri || ''}
        alt={el.display_name}
        width={24}
        height={24}
        className={styles.icon}
      />
    )
  }

  return <IconQuestion width={24} height={24} className={styles.icon} />
}

const OpenWithItem: FC<OpenWithItemProps> = ({
  address,
  chainConfig,
  explorer,
  type,
  tokenSlug,
}) => {
  if (explorer.id === 'coinMarketCap' && !tokenSlug) {
    return null
  }

  const chainName = chainConfig.name.toLowerCase().replace('ethereum', 'eth')

  const url = `${explorer.url}${explorer[`${type}_path`]}`
    .replace(':address', address)
    .replace(':chain', explorer.id === 'tenderly' && chainName === 'eth' ? 'mainnet' : chainName)
    .replace(':tx', address)
    .replace(':slug', tokenSlug || '')

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
      data-tooltip-content={explorer.display_name}
      data-tooltip-id="app-tooltip">
      {getLogo(explorer)}
    </Link>
  )
}

export default OpenWithItem
