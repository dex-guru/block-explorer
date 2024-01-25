import Image from 'next/image'
import Link from 'next/link'

import { FC, ReactNode, useCallback } from 'react'

import clsx from 'clsx'

import Heading from '@/components/Heading'
import { IconQuestion } from '@/components/Icons'
import { ExplorerData, explorers } from '@/constants/explorers'
import IconDexGuru from '@/images/explorers/dexguru.svg'
import IconEigenPhi from '@/images/explorers/eigenphi.svg'
import IconTenderly from '@/images/explorers/tenderly.svg'

import { OpenWithProps } from './types'

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

const OpenWith: FC<OpenWithProps> = ({ address, type, className, chainConfig }) => {
  const renderElement = useCallback(
    (el: ExplorerData, idx: number) => {
      const chainName = chainConfig.name.toLowerCase().replace('ethereum', 'eth')

      const url = `${el.url}${el[`${type}_path`]}`
        .replace(':address', address)
        .replace(':chain', el.id === 'tenderly' && chainName === 'eth' ? 'mainnet' : chainName)
        .replace(':tx', address)

      return (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          key={idx}
          className={styles.link}
          data-tooltip-content={el.display_name}
          data-tooltip-id="app-tooltip">
          {getLogo(el)}
        </Link>
      )
    },
    [type, address, chainConfig]
  )

  if (!explorers[chainConfig?.chainId]) {
    return null
  }

  const explorersData = explorers[chainConfig?.chainId].filter((el) => {
    return !!el[`${type}_path`]
  })

  if (!explorersData.length) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      <Heading size="xs" className={styles.title}>
        Open with
      </Heading>
      <div className={styles.body}>{explorersData.map(renderElement)}</div>
    </div>
  )
}

export default OpenWith
