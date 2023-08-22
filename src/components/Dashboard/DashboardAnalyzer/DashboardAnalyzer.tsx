import { FC, Suspense, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { LoadingCard } from '@/components/Loading'
import TabPanel from '@/components/TabPanel'

const DashboardAnalyzerOverview = dynamic(
  () => import('./DashboardAnalyzerOverview'),
  { ssr: false }
)
const DashboardAnalyzerChat = dynamic(() => import('./DashboardAnalyzerChat'), {
  ssr: false,
})

export type DashboardAnalyzerHistory = {
  prompt_submitted: string
  summary: string
}

const DashboardAnalyzer: FC<{
  slug: string
  params?: Record<string, unknown>
  setChatOpen?: (value: boolean) => void
}> = ({ slug, params, setChatOpen }) => {
  const [currentTab, setCurrentTab] = useState<string>('')
  const [history, setHistory] = useState<DashboardAnalyzerHistory[]>([])
  const [historyEntry, setHistoryEntry] =
    useState<DashboardAnalyzerHistory | null>(null)

  const handleChangeTab = (value: string) => {
    setCurrentTab(value)
    if (setChatOpen) {
      setChatOpen(value === 'ai')
    }
  }

  const handleHistoryChange = useCallback(
    (prompt_submitted: string, summary: string) => {
      setHistoryEntry({ prompt_submitted, summary })
    },
    []
  )

  useEffect(() => {
    if (!historyEntry) {
      return
    }

    setHistory([...history, historyEntry])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyEntry])

  return (
    <TabPanel
      onChange={handleChangeTab}
      value={currentTab}
      tabs={[
        {
          title: 'Dashboard',
          value: '',
          content: (
            <Suspense fallback={<LoadingCard />}>
              <DashboardAnalyzerOverview
                slug={slug}
                params={params}
                onSelect={handleHistoryChange}
              />
            </Suspense>
          ),
        },
        {
          title: 'Guru AI',
          value: 'ai',
          content: (
            <Suspense fallback={<LoadingCard />}>
              <DashboardAnalyzerChat
                slug={slug}
                params={params}
                history={history || []}
                onSelect={handleHistoryChange}
              />
            </Suspense>
          ),
        },
      ]}
    />
  )
}

export default DashboardAnalyzer
