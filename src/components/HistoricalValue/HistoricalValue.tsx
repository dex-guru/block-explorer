import { FC, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Loading from '../Loading'
import { HistoricalValueProps } from './types'
import { HistoricalPriceModel } from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import { IconAgo } from '@/components/Icons'
import Value from '@/components/Value'
import { GET_HISTORICAL_TOKEN_PRICE } from '@/lib/apollo/queries'
import { getNormalizedValue } from '@/lib/utils'
import styles from './HistoricalValue.module.scss'

const HistoricalValue: FC<HistoricalValueProps> = ({
  value,
  timestamp,
  title,
  chainConfig,
  chainStats,
  className,
}) => {
  const [isShowHistorical, setIsShowHistorical] = useState(false)
  const [historicalPrice, setHistoricalPrice] = useState<number | null>(null)
  const [getHistoricalPrice, { loading }] = useLazyQuery<{
    historicalPrice: HistoricalPriceModel
  }>(GET_HISTORICAL_TOKEN_PRICE)

  const handleClick = () => {
    setIsShowHistorical(!isShowHistorical)

    if (historicalPrice !== null) {
      return
    }

    getHistoricalPrice({
      variables: {
        address: chainConfig.nativeCurrency.wrappedAddress,
        chainId: 1,
        fromTs: timestamp - 5 * 60,
        toTs: timestamp,
        currencyCode: 'usd',
        resolution: '5',
      },
    }).then((result) => {
      setHistoricalPrice(result.data?.historicalPrice?.c[0] || 0)
    })
  }

  const priceValue = new BigNumber(value)

  const priceRate = isShowHistorical ? historicalPrice || 0 : chainStats.nativeTokenPriceUsd

  return (
    <Button
      className={clsx(styles.container, className)}
      data-tooltip-id="app-tooltip"
      data-tooltip-content={
        isShowHistorical ? `Estimated ${title} on the day of TXn` : `Current ${title} price`
      }
      onClick={handleClick}
      icon={isShowHistorical && !loading ? <IconAgo className={styles.icon} /> : undefined}>
      {isShowHistorical && loading && <Loading className={styles.loader} />}
      {!loading && (
        <Value
          value={getNormalizedValue(
            priceValue.multipliedBy(priceRate),
            chainConfig.nativeCurrency.decimals
          )}
          prefix="$"
        />
      )}
    </Button>
  )
}

export default HistoricalValue
