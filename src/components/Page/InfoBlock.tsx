import { useQuery } from '@apollo/client'
import Value from '../Value'
import { CHAIN_ID } from '@/constants'
import { CHAIN_STATS } from '@/lib/apollo/queries'
import { financialFormat } from '@/lib/utils'
import styles from './InfoBlock.module.scss'

const InfoBlock = () => {
  const { data } = useQuery(CHAIN_STATS, { variables: { chainId: CHAIN_ID } })

  return (
    <div className={styles.container}>
      {data && (
        <>
          <div className={styles.price}>
            Canto price{' '}
            <Value
              value={financialFormat(data.chainStats.nativeTokenPriceUsd)}
              prefix="$"
              delta={data.chainStats.nativeTokenPriceUsd24hDelta * 100}
            />
          </div>

          <div className={styles.message}>{data.chainConfig.message}</div>
        </>
      )}
    </div>
  )
}

export default InfoBlock
