import { FC, useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { sanitize } from 'isomorphic-dompurify'
import Card from '@/components/Card'
import Message from '@/components/Message'
import { TRedashDashboard } from '@/lib/redash/types'
import styles from './Dashboard.module.scss'

const DashboardAnalyzer: FC<{
  dashboard: TRedashDashboard
  params?: Record<string, unknown>
}> = ({ dashboard, params }) => {
  const { slug } = dashboard

  const [isLoading, setIsLoading] = useState(true)
  const [aiPrompts, setAiPrompts] = useState<string[] | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      return
    }

    const getData = async () => {
      const queryParams = {
        dashboard_slug: slug,
        parameters: params,
      }

      try {
        const response = await fetch(`/api/dashboard/prompts`, {
          method: 'POST',
          body: JSON.stringify(queryParams),
        })

        if (response.ok) {
          const data = await response.json()

          setAiPrompts(data?.prompts)
        }
      } catch (e) {
        console.error(e)
      }
    }

    getData()
  }, [dashboard, slug, params])

  useEffect(() => {
    if (!slug || !aiPrompts?.length || currentPrompt) {
      return
    }

    setCurrentPrompt(aiPrompts[0] || '')
  }, [slug, aiPrompts, currentPrompt])

  useEffect(() => {
    if (!slug) {
      return
    }

    const getData = async () => {
      const queryParams = {
        dashboard_slug: slug,
        parameters: params,
        selected_prompt: currentPrompt,
      }

      try {
        const response = await fetch(`/api/dashboard/analyzer`, {
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
  }, [dashboard, slug, currentPrompt, params])

  if (!aiResponse && isLoading) {
    return (
      <Message
        text="🤔 DexGuruGPT takes ~30 sec to analyze this dashboard data"
        type="prompt"
      />
    )
  }

  if (!aiResponse && !isLoading) {
    return <Message text="😢 DexGuruGPT left this chat" type="danger" />
  }

  if (!aiResponse) {
    return null
  }

  return (
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
  )
}

export default DashboardAnalyzer
