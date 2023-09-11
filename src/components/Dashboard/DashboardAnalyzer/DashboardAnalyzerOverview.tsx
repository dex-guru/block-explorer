import { FC, useEffect, useState } from 'react'
import { sanitize } from 'isomorphic-dompurify'
import DashboardAnalyzerVariants from './DashboardAnalyzerVariants'
import { useDashboardAnalyze } from './hooks'
import { IconOutput } from '@/components/Icons'
import { useTypewriter } from '@/hooks/useTypewriter'
import styles from './DashboardAnalyzerOverview.module.scss'

const DashboardAnalyzerOverview: FC<{
  slug: string
  params?: Record<string, unknown>
  onSelect?: (prompt_submitted: string, summary: string) => void
}> = ({ slug, params, onSelect }) => {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)

  const { data, error, isLoading } = useDashboardAnalyze({
    slug,
    params,
    prompt: currentPrompt,
  })

  useEffect(() => {
    if (onSelect && data?.output && currentPrompt) {
      onSelect(currentPrompt, data?.output)
    }
  }, [currentPrompt, data?.output, onSelect])

  const response = data?.output
    ? sanitize(data.output.trim())
    : isLoading
    ? 'Hmmm... Let me think...'
    : error
    ? 'Ooops! Sorry, I got my circuits shorted...'
    : 'What do you want to know today?'

  const [printed, notPrinted] = useTypewriter(
    response.replace(' - ', ' – ').replace(' "', ' “').replace('"', '”')
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.body}>
          <div className={styles.response}>
            {!!currentPrompt && (
              <div className={styles.responseHeader}>
                <IconOutput className={styles.responseIcon} />
                <div className={styles.responseTitle}>{currentPrompt}</div>
              </div>
            )}
            <div className={styles.responseOutput}>
              {!!printed && (
                <>
                  <span className={styles.printed}>{printed}</span>
                  <span className={styles.notPrinted}>{notPrinted}</span>
                </>
              )}
            </div>

            {isLoading && (
              <div className={styles.processing}>
                <span />
                <span />
              </div>
            )}
          </div>
          <DashboardAnalyzerVariants
            slug={slug}
            params={params}
            onSubmit={(value) => {
              setCurrentPrompt(value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalyzerOverview
