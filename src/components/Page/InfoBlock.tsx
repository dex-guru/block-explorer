import { FC } from 'react'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import { InfoBlockProps } from './types'
import { Tile, Value } from '@/components'
import { CHAIN_STATS } from '@/lib/apollo/queries'
import { financialFormat } from '@/lib/utils'
import styles from './InfoBlock.module.scss'

const INFOBLOCK_POLL_INTERVAL = 5 * 60 * 1000

const InfoBlock: FC<InfoBlockProps> = ({ chainConfig }) => {
  const { data, previousData } = useQuery(CHAIN_STATS, {
    pollInterval: INFOBLOCK_POLL_INTERVAL,
  })

  const dataDisplay = data || previousData

  return (
    <Tile
      className={clsx(styles.container, { [styles.loading]: !dataDisplay })}
      prefix={`${chainConfig.nativeCurrency.symbol} price`}
      title={
        <Value
          value={financialFormat(dataDisplay?.chainStats?.nativeTokenPriceUsd)}
          prefix="$"
          delta={data?.chainStats?.nativeTokenPriceUsd24hDelta * 100}
        />
      }
    />
  )
}

export default InfoBlock
