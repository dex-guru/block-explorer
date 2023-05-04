import { FC, Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LoadingCard } from '../Loading'
import { IAddressViewProps } from './types'
import {
  Avatar,
  DetailsView,
  Grid,
  Page,
  Properties,
  TabPanel,
  Card,
} from '@/components'

const TxsDataTable = lazy(() => import('../Tables/TxsDataTable/'))
const Erc20DataTable = lazy(() => import('../Tables/Erc20DataTable'))
const NftDataTable = lazy(() => import('../Tables/NftDataTable'))

const AddressView: FC<IAddressViewProps> = ({
  address,
  tab,
  addressInfo,
  chain,
}) => {
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
                  value: addressInfo.nativeBalance,
                },
                {
                  title: `${chain.config.nativeCurrency.symbol} Value`,
                  value: addressInfo.nativeBalanceUSD,
                },
                {
                  title: 'Token:',
                  value: addressInfo.assetsValueUSD,
                },
              ]}
            />

            <Properties data={[]} />
          </Grid>

          <TabPanel
            tabs={[
              {
                title: 'Transactions',
                value: '',
                to: pathname,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <TxsDataTable address={address} />,
                  </Suspense>
                ),
              },

              {
                title: 'ERC-20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Erc20DataTable address={address} />
                  </Suspense>
                ),
              },
              {
                title: 'NFT Token TXns',
                value: 'nfttxns',
                to: `${pathname}?tab=nfttxns`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <NftDataTable address={address} />
                  </Suspense>
                ),
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Card>Some analytics here soon</Card>
                  </Suspense>
                ),
              },
              {
                title: 'Comments',
                value: 'comments',
                to: `${pathname}?tab=comments`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Card>Some comments here soon</Card>
                  </Suspense>
                ),
              },
            ]}
            value={tab || ''}
          />
        </DetailsView>
      </Page>
    </>
  )
}

export default AddressView
