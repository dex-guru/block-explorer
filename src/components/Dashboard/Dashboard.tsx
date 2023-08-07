import { FC, useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import Link from 'next/link'
import { sanitize } from 'isomorphic-dompurify'
import DetailsView from '../DetailsView'
import DashboardWidget from './DashboardWidget'
import Card from '@/components/Card'
import Message from '@/components/Message'
import IconRedash from '@/images/redash.svg'
import {
  DEFAULT_DATE_RANGE,
  DYNAMIC_DATE_PREFIX,
  getDynamicDateRangePeriod,
} from '@/lib/dates'
import { generateRedashDashboardParams } from '@/lib/redash/client'
import { TRedashDashboard, TRedashQueryResponse } from '@/lib/redash/types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<{
  data: TRedashDashboard
  queriesResponse: Record<number, TRedashQueryResponse>
  params?: Record<string, unknown>
}> = ({ data, queriesResponse, params }) => {
  const { id, name, slug, widgets } = data

  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !slug) {
      return
    }

    const getData = async () => {
      const parameters = generateRedashDashboardParams(data, {
        chain_id: process.env.NEXT_PUBLIC_CHAIN_ID || 7700,
        dates: getDynamicDateRangePeriod(
          `${DYNAMIC_DATE_PREFIX}${DEFAULT_DATE_RANGE}`
        ),
      })

      const queryParams = {
        dashboard_slug: slug,
        parameters,
      }

      try {
        const response = await fetch(`/api/dashboard-analyzer`, {
          method: 'POST',
          body: JSON.stringify(queryParams),
        })

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
  }, [data, slug, isMounted])

  const sortedWidgets =
    widgets
      ?.filter((widget) => !widget.options.isHidden)
      .sort((a, b) => {
        const aPos = a.options.position.row * 100 + a.options.position.col
        const bPos = b.options.position.row * 100 + b.options.position.col

        return aPos - bPos
      }) || []

  return (
    <DetailsView
      title={name}
      header={
        <Link
          className={styles.redash}
          data-tooltip-id="app-tooltip"
          data-tooltip-content={`Open ${name} in Warehouse`}
          target="_blank"
          rel="noreferrer noopener"
          href={`${process.env.NEXT_PUBLIC_REDASH_URL}/dashboards/${id}-${slug}`}
        >
          <IconRedash className={styles.redashIcon} />
        </Link>
      }
    >
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
                __html: sanitize(aiResponse),
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
        {sortedWidgets.map((widget) => (
          <DashboardWidget
            data={widget}
            params={params}
            queryResponse={queriesResponse[widget?.visualization?.query?.id]}
            key={widget.id}
          />
        ))}
      </div>
    </DetailsView>
  )
}

export default Dashboard
