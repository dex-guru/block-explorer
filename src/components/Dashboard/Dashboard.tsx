import { FC, useEffect, useState } from 'react'
import { Card, Message } from '..'
import DashboardWidget from './DashboardWidget'
import { TRedashDashboard, TRedashQueryResponse } from '@/lib/redash/types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<
  TRedashDashboard & {
    queries: Record<number, TRedashQueryResponse>
  }
> = ({ slug, widgets, queries }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [aiData, setAiData] = useState<{ output: string } | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const getData = async () => {
      try {
        const response = await fetch(`/api/dashboard-analyzer/${slug}`, {
          method: 'POST',
        })

        if (response.ok) {
          const data = await response.json()
          setAiData(data?.output)
        }
      } catch (e) {
        console.error(e)
      }
      setAiData({
        output:
          '\n\nThe visual <b>ERC20 Daily Token Transfer Chart by Token</b> shows the number of ERC20 token transfers on a daily basis over the specified time period of June 1 to June 30, 2023. The data indicates that the number of ERC20 token transfers varied over the course of the month, with the highest number of transfers occurring on June 10th (11245) and the lowest number occurring on June 29th (4295). <i>The overall trend appears to be one of increasing activity as the month progresses, with the highest numbers of transfers occurring towards the end of the month.</i> Additionally, there appears to be some volatility in the data, with some days having significantly higher or lower numbers of transfers than other days.',
      })

      setIsLoading(false)
    }

    getData()
  }, [slug, isMounted])

  return (
    <div className={styles.container}>
      {isLoading && (
        <Message text="🤔 AI analyzing dashboard data" type="prompt" />
      )}

      {!isLoading && !aiData?.output && (
        <Message text="😢 AI left this chat" type="danger" />
      )}

      {!!aiData?.output && (
        <Card title="🤖 DexGuruGPT says: " className={styles.analyzer}>
          <div
            className={styles.output}
            dangerouslySetInnerHTML={{
              __html: aiData.output,
            }}
          />
        </Card>
      )}

      <div className={styles.dashboard}>
        {widgets
          ?.filter((widget) => !widget.options.isHidden)
          .sort((a, b) => {
            const aPos = a.options.position.row * 100 + a.options.position.col
            const bPos = b.options.position.row * 100 + b.options.position.col

            return aPos - bPos
          })
          .map((widget) => (
            <DashboardWidget
              {...widget}
              query={queries[widget?.visualization?.query?.id]}
              key={widget.id}
            />
          ))}
      </div>
    </div>
  )
}

export default Dashboard
