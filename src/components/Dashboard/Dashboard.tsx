import { FC, useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Card, Message } from '..'
import DashboardWidget from './DashboardWidget'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { TRedashDashboard, TRedashQueryResponse } from '@/lib/redash/types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<
  TRedashDashboard & {
    queriesResponse: Record<number, TRedashQueryResponse>
    chainConfig: ChainConfigModel
  }
> = ({ chainConfig, slug, widgets, queriesResponse }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const getData = async () => {
      try {
        const response = await fetch(`/api/dashboard-analyzer/${slug}`)

        if (response.ok) {
          const data = await response.json()

          setAiResponse(data?.output)
        }
      } catch (e) {
        console.error(e)
      }

      setIsLoading(false)
    }

    getData()
  }, [slug, isMounted])

  return (
    <div className={styles.container}>
      {isLoading && (
        <Message
          text="🤔 DexGuruGPT takes ~30 sec to analyze this dashboard data"
          type="prompt"
        />
      )}

      {!isLoading && !aiResponse && (
        <Message text="😢 DexGuruGPT left this chat" type="danger" />
      )}

      {!!aiResponse && (
        <Card title="🤖 DexGuruGPT says: " className={styles.analyzer}>
          <div className={styles.output}>
            <div
              className={styles.outputPlaceholder}
              dangerouslySetInnerHTML={{
                __html: aiResponse,
              }}
            />
            <TypeAnimation
              sequence={aiResponse.split('\n')}
              className={styles.outputTyping}
              speed={75}
            />
          </div>
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
              queryResponse={queriesResponse[widget?.visualization?.query?.id]}
              key={widget.id}
              chainConfig={chainConfig}
            />
          ))}
      </div>
    </div>
  )
}

export default Dashboard
