import { useQuery } from '@apollo/client'
import Value from '../Value'
import { CHAIN_STATS } from '@/lib/apollo/queries'
import { financialFormat } from '@/lib/utils'
import styles from './InfoBlock.module.scss'

const InfoBlock = () => {
  const { data } = useQuery(CHAIN_STATS)

  return (
    <div className={styles.infoBlock}>
      {data && (
        <>
          <label>
            Canto price{' '}
            <Value
              value={financialFormat(data.chainStats.nativeTokenPriceUsd)}
              prefix="$"
              delta={data.chainStats.nativeTokenPriceUsd24hDelta * 100}
            />
          </label>
          <label>{data.chainConfig.message}</label>
        </>
      )}
    </div>
  )
}

export default InfoBlock
