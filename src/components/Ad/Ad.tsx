import { FC } from 'react'

import { SliseAd } from '@slise/embed-react'
import { useDimensionsRef } from 'rooks'

import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { checkChainFeature } from '@/lib/utils'

import styles from './Ad.module.scss'

const Ad: FC<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
  const [ref, dimensions] = useDimensionsRef({ updateOnScroll: false })

  if (checkChainFeature(chainConfig, 'no_ads')) {
    return null
  }

  const isMobile = (dimensions?.width || 0) < 728

  const content = !!dimensions ? (
    <>
      {!isMobile && (
        <SliseAd
          slotId="leaderboard"
          pub="pub-23"
          format="728x90"
          style={{ width: '728px', height: '90px' }}
        />
      )}
      {isMobile && (
        <SliseAd
          slotId="mobile"
          pub="pub-23"
          format="270x90"
          style={{ width: '270px', height: '90px' }}
        />
      )}
    </>
  ) : null

  return (
    <div className={styles.container} ref={ref}>
      {content}
    </div>
  )
}

export default Ad
