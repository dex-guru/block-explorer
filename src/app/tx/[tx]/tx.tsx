'use client'

import { Suspense, lazy, FC } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  ChainConfigModel,
  ChainStatsModel,
  Erc20EventModel,
  Erc721TransferModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Empty, Page, TabPanel } from '@/components'
import DetailsView from '@/components/DetailsView/DetailsView'
import IconEmpty from '@/images/icons/no-flash.svg'

const TxOverview = lazy(
  () => import('../../../components/TabContent/TxOverview')
)
const TxLogs = lazy(() => import('../../../components/TabContent/TxLogs'))
const TxTrace = lazy(() => import('../../../components/TabContent/TxTrace'))

export type TxEventsData<T> = { data: T[]; total: number }
export interface ITxProps {
  data: TransactionModel
  logs: LogModel[]
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  erc20Transfers: TxEventsData<Erc20EventModel>
  erc20Actions: TxEventsData<Erc20EventModel>
  nftEvents: TxEventsData<Erc721TransferModel>
}

const TxPage: FC<ITxProps> = (props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  if (!searchParams || !pathname) {
    return null
  }
  const tab = searchParams.get('tab')
  const currentTab = Array.isArray(tab) ? tab[0] : tab || ''

  return (
    <Page chainConfig={props.chainConfig}>
      {!props.data?.hash && (
        <Empty icon={<IconEmpty />} title="No TX was found" />
      )}

      {!!props.data?.hash && (
        <DetailsView
          title="Transaction"
          address={props.data?.hash || undefined}
          type="tx"
          chainConfig={props.chainConfig}
        >
          <TabPanel
            tabs={[
              {
                title: 'Overview',
                value: '',
                to: pathname,
                content: (
                  <Suspense>
                    <TxOverview {...props} />
                  </Suspense>
                ),
              },
              {
                title: `Logs (${props.data.receiptLogsCount || 0})`,
                value: 'logs',
                to: `${pathname}?tab=logs`,
                content: (
                  <Suspense>
                    <TxLogs {...props} />
                  </Suspense>
                ),
              },
              {
                title: 'Trace',
                value: 'trace',
                to: `${pathname}?tab=trace`,
                content: (
                  <Suspense>
                    <TxTrace {...props} />
                  </Suspense>
                ),
              },
            ]}
            value={currentTab}
          />
        </DetailsView>
      )}
    </Page>
  )
}

export default TxPage
