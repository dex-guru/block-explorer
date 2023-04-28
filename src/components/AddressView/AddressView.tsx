import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { txsColumns } from '../Table/columns'
import { IAddressViewProps } from './types'
import {
  Avatar,
  Card,
  DetailsView,
  Grid,
  Page,
  Properties,
  TabPanel,
  Table,
} from '@/components'

const AddressView: FC<IAddressViewProps> = ({ address, tab }) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]

  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <Page withSearch>
        <DetailsView
          icon={<Avatar address={address} />}
          title="Address"
          address={address}
          tag="Address"
        >
          <Grid>
            <Properties
              data={[
                {
                  title: 'Balance:',
                  value: '😕',
                },
                {
                  title: 'Ether Value:',
                  value: '😕',
                },
                {
                  title: 'Token:',
                  value: '😕',
                },
              ]}
            />

            <Properties
              data={[
                {
                  title: 'More Info:',
                  value: '😕',
                },
                {
                  title: 'My Name Tag:',
                  tooltip: '😕',
                  value: (
                    <>
                      Not Availiable <Link href="/">Login to update</Link>
                    </>
                  ),
                },
              ]}
            />
          </Grid>

          <TabPanel
            className="tab-panel"
            tabs={[
              {
                title: 'Transactions',
                value: '',
                to: pathname,
              },
              {
                title: 'Internal TXns',
                value: 'internaltx',
                to: `${pathname}?tab=internaltx`,
              },
              {
                title: 'Erc20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
              },
              {
                title: 'Comments',
                value: 'comments',
                to: `${pathname}?tab=comments`,
              },
            ]}
            value={tab}
          >
            {/* Card here should depend on Tab's query param value */}
            <Card>
              <Table columns={txsColumns} data={[]} />
            </Card>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default AddressView
