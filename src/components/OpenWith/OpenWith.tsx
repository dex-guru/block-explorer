import { FC, Suspense, lazy } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import Heading from '../Heading'
import { OpenWithProps } from './types'
import { IconQuestion } from '@/components'
import { explorers } from '@/constants/explorers'
import styles from './OpenWith.module.scss'

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
        {explorersData.map((el, idx) => {
          const chainName = chainConfig.name
            .toLowerCase()
            .replace('ethereum', 'eth')

          const url = `${el.url}${el[`${type}_path`]}`
            .replace(':address', address)
            .replace(
              ':chain',
              el.id === 'tenderly' && chainName === 'eth'
                ? 'mainnet'
                : chainName
            )
            .replace(':tx', address)

          let logo

          if (el.logo_uri) {
            logo = (
              <Image
                src={el.logo_uri || ''}
                alt={el.display_name}
                width={24}
                height={24}
                className={styles.icon}
              />
            )
          } else {
            const Icon = lazy(() =>
              import(`@/images/explorers/${el.id}.svg`).catch(() => ({
                default: () => <IconQuestion className={styles.icon} />,
              }))
            )

            logo = (
              <Suspense fallback={<span className={styles.icon} />}>
                <Icon className={styles.icon} />
              </Suspense>
            )
          }

          return (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className={styles.link}
            >
              {logo}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default OpenWith
