import { FC, MouseEventHandler, useEffect, useState } from 'react'
import clsx from 'clsx'
import { DashboardAnalyzerHistory } from './DashboardAnalyzer'
import { useDashboardPrompts } from './hooks'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import styles from './DashboardAnalyzerVariants.module.scss'

const DashboardAnalyzerVariants: FC<{
  slug: string
  params?: Record<string, unknown>
  onSubmit: (value: string) => void
  history?: DashboardAnalyzerHistory[]
  className?: string
}> = ({ slug, params, onSubmit, history, className }) => {
  const [previousData, setPreviousData] = useState<string[] | null>(null)
  const { data, isLoading } = useDashboardPrompts(slug, params, history)

  useEffect(() => {
    if (!data || data === previousData) {
      return
    }

    setPreviousData(data.prompts)
  }, [data, previousData])

  return (
    <div className={clsx(styles.container, className)}>
      {!!previousData?.length && (
        <div className={styles.prompts}>
          {previousData?.map((prompt: string, idx: number) => {
            const handleClick: MouseEventHandler = (e) => {
              onSubmit(prompt)
              const target = e.target as HTMLElement
              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  inline: 'nearest',
                  block: 'nearest',
                })
              }
            }

            return (
              <Button key={idx} caption={prompt} className={styles.prompt} onClick={handleClick} />
            )
          })}
        </div>
      )}

      {!previousData && isLoading && <Loading className={styles.loader} />}
    </div>
  )
}

export default DashboardAnalyzerVariants
