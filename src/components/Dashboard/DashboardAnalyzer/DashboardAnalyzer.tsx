import { FC, useCallback, useEffect, useState } from 'react'
import DashboardAnalyzerChat from './DashboardAnalyzerChat'
import DashboardAnalyzerOverview from './DashboardAnalyzerOverview'
import TabPanel from '@/components/TabPanel'

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
            <DashboardAnalyzerOverview
              slug={slug}
              params={params}
              onSelect={handleHistoryChange}
            />
          ),
        },
        {
          title: 'Guru AI',
          value: 'ai',
          content: (
            <DashboardAnalyzerChat
              slug={slug}
              params={params}
              history={history || []}
              onSelect={handleHistoryChange}
            />
          ),
        },
      ]}
    />
  )
}

export default DashboardAnalyzer
