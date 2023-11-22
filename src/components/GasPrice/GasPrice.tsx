import { FC, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntervalWhen } from 'rooks'
import Loading from '../Loading'
import GasPriceEntry from './GasPriceEntry'
import { GasPriceProps, GasPriceValue } from './types'
import Card from '@/components/Card'
import { avg, checkChainFeature, formatFeeHistory } from '@/lib/utils'
import styles from './GasPrice.module.scss'
import { usePublicClient } from 'wagmi'

const DateTime = dynamic(() => import('@/components/DateTime'), { ssr: false })

const Countdown: FC<{ value: number }> = ({ value }) => {
  const [secsLeft, setSecsLeft] = useState<number>(0)

  useEffect(() => {
    setSecsLeft(Math.ceil(Math.max(value, 1)))
  }, [value])

  useIntervalWhen(
    () => {
      setSecsLeft(secsLeft - 1)
    },
    1000,
    secsLeft > 0
  )

  return <>{secsLeft}</>
}

const GasPrice: FC<GasPriceProps> = ({
  chainConfig,
  chainStats,
  className,
  onChange,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [gasData, setGasData] = useState<GasPriceValue | null>(null)

  const pollInterval = Math.max(chainConfig.blockTime || 0, 15000)
  const isEip1559 = checkChainFeature(chainConfig, 'EIP1559')
  const publicClient = usePublicClient()
  const getData = useCallback(() => {
    setIsLoading(true)
    if (!publicClient) {
      return
    }

    const client = publicClient

    try {
      if (isEip1559) {
        client
          .getFeeHistory({
            blockCount: 10,
            blockTag: 'latest',
            rewardPercentiles: [20, 50, 90],
          })
          .then((feeHistory) => {
            const blocks = formatFeeHistory(feeHistory, false)

            const slow = avg(blocks.map((b) => b.priorityFeePerGas?.[0] || 0))
            const average = avg(
              blocks.map((b) => b.priorityFeePerGas?.[1] || 0)
            )
            const fast = avg(blocks.map((b) => b.priorityFeePerGas?.[2] || 0))

            client.getBlock({ blockTag: 'pending' }).then((block) => {
              const result = {
                base: Number(block.baseFeePerGas),
                low: slow,
                avg: average,
                high: fast,
              }
              setGasData(result)
              setIsLoading(false)
              onChange?.(result)
            })
          })
      } else {
        client.getGasPrice().then((res) => {
          const value = Number(res)
          const result = {
            base: value,
          }
          setGasData(result)
          setIsLoading(false)
          onChange?.(result)
        })
      }
    } catch {
      //
    }
  }, [publicClient, onChange, isEip1559])

  useEffect(getData, [getData])
  useIntervalWhen(getData, pollInterval, !isLoading, false)

  return (
    <Card
      title={<DateTime showTime />}
      className={className}
      header={
        !isLoading ? (
          <span className={styles.countdown}>
            Update in <Countdown value={pollInterval / 1000} />s
          </span>
        ) : (
          <Loading className={styles.loader} />
        )
      }
    >
      <div className={styles.container}>
        <GasPriceEntry
          chainConfig={chainConfig}
          chainStats={chainStats}
          type="low"
          value={isEip1559 ? gasData?.low : undefined}
          base={gasData?.base}
        />
        <GasPriceEntry
          chainConfig={chainConfig}
          chainStats={chainStats}
          type="avg"
          value={isEip1559 ? gasData?.avg : undefined}
          base={(gasData?.base || 0) * (isEip1559 ? 1 : 1.1)}
        />
        <GasPriceEntry
          chainConfig={chainConfig}
          chainStats={chainStats}
          type="high"
          value={isEip1559 ? gasData?.high : undefined}
          base={(gasData?.base || 0) * (isEip1559 ? 1 : 1.3)}
        />
      </div>
    </Card>
  )
}

export default GasPrice
