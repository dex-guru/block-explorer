import { FC } from 'react'
import { useQuery } from '@apollo/client'
import Tile from '../Tile'
import Value from '../Value'
import { InfoBlockProps } from './types'
import { CHAIN_STATS } from '@/lib/apollo/queries'
import { financialFormat } from '@/lib/utils'
import styles from './InfoBlock.module.scss'

const InfoBlock: FC<InfoBlockProps> = ({ chainConfig }) => {
  const { data } = useQuery(CHAIN_STATS)

  return (
    <Tile
      className={styles.container}
      prefix={`${chainConfig.nativeCurrency.symbol} price`}
      title={
        <Value
          value={financialFormat(data.chainStats.nativeTokenPriceUsd)}
          prefix="$"
          delta={data.chainStats.nativeTokenPriceUsd24hDelta * 100}
        />
      }
    />
  )
}

export default InfoBlock
