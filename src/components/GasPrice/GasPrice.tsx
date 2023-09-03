import { FC, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntervalWhen } from 'rooks'
import Loading from '../Loading'
import GasPriceEntry from './GasPriceEntry'
import { GasPriceProps } from './types'
import Card from '@/components/Card'
import { avg, formatFeeHistory } from '@/lib/utils'
import styles from './GasPrice.module.scss'

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
  publicClient,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [gasData, setGasData] = useState<{
    base: number
    low: number
    avg: number
    high: number
  } | null>(null)

  const pollInterval = Math.max(chainConfig.blockTime || 0, 15000)

  const getData = useCallback(() => {
    setIsLoading(true)
    if (!publicClient) {
      return
    }

    const client = publicClient({ chainId: chainConfig.chainId })

    client
      .getFeeHistory({
        blockCount: 10,
        blockTag: 'latest',
        rewardPercentiles: [20, 50, 90],
      })
      .then((feeHistory) => {
        const blocks = formatFeeHistory(feeHistory, false)

        const slow = avg(blocks.map((b) => b.priorityFeePerGas?.[0] || 0))
        const average = avg(blocks.map((b) => b.priorityFeePerGas?.[1] || 0))
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
  }, [publicClient, chainConfig.chainId, onChange])

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
          value={gasData?.low}
          base={gasData?.base}
        />
        <GasPriceEntry
          chainConfig={chainConfig}
          chainStats={chainStats}
          type="avg"
          value={gasData?.avg}
          base={gasData?.base}
        />
        <GasPriceEntry
          chainConfig={chainConfig}
          chainStats={chainStats}
          type="high"
          value={gasData?.high}
          base={gasData?.base}
        />
      </div>
    </Card>
  )
}

export default GasPrice
