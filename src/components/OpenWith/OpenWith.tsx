import { FC } from 'react'

import clsx from 'clsx'

import Heading from '@/components/Heading'
import { explorers } from '@/constants/explorers'

import OpenWithItem from './OpenWithItem'
import { OpenWithProps } from './types'

import styles from './OpenWith.module.scss'

const OpenWith: FC<OpenWithProps> = ({ address, type, className, chainConfig, tokenSlug }) => {
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
      <div className={styles.body}>
        {explorersData.map((explorer) => (
          <OpenWithItem
            key={explorer.id}
            chainConfig={chainConfig}
            type={type}
            explorer={explorer}
            address={address}
            tokenSlug={tokenSlug}
          />
        ))}
      </div>
    </div>
  )
}

export default OpenWith
