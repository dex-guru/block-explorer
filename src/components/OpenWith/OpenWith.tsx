import { FC, ReactNode, Suspense, lazy } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import Heading from '../Heading'
import { OpenWithProps, OpenWithType } from './types'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { IconQuestion } from '@/components'
import { ExplorerData, explorers } from '@/constants/explorers'
import styles from './OpenWith.module.scss'

const getLogo = (el: ExplorerData): ReactNode => {
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

  const Icon = lazy(() =>
    import(`@/images/explorers/${el.id}.svg`).catch(() => ({
      default: () => <IconQuestion className={styles.icon} />,
    }))
  )

  return (
    <Suspense fallback={<span className={styles.icon} />}>
      <Icon className={styles.icon} />
    </Suspense>
  )
}

const renderElements = (
  explorersData: ExplorerData[],
  type: OpenWithType,
  address: string,
  chainConfig: ChainConfigModel
): ReactNode => {
  return explorersData.map((el, idx) => {
    const chainName = chainConfig.name.toLowerCase().replace('ethereum', 'eth')

    const url = `${el.url}${el[`${type}_path`]}`
      .replace(':address', address)
      .replace(
        ':chain',
        el.id === 'tenderly' && chainName === 'eth' ? 'mainnet' : chainName
      )
      .replace(':tx', address)

    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        key={idx}
        className={styles.link}
      >
        {getLogo(el)}
      </Link>
    )
  })
}

const OpenWith: FC<OpenWithProps> = ({
  address,
  type,
  className,
  chainConfig,
}) => {
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
      <div className={styles.body}>
        {renderElements(explorersData, type, address, chainConfig)}
      </div>
    </div>
  )
}

export default OpenWith
