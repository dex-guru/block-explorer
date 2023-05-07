import { FC, Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from '@ethersproject/address'
import AddressWallet from '../AddressWallet'
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
  Value,
} from '@/components'
import { financialFormat } from '@/lib/utils'

const TxsDataTable = lazy(() => import('../Tables/TxsDataTable/'))
const Erc20DataTable = lazy(() => import('../Tables/Erc20DataTable'))
const NftDataTable = lazy(() => import('../Tables/NftDataTable'))

const AddressView: FC<IAddressViewProps> = ({
  address,
  tab,
  addressInfo,
  chain,
  tokenHoldingsStats,
}) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]

  const checkSumAddress = isAddress(address) ? getAddress(address) : address
  const pageTitle = `Address ${checkSumAddress}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
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
                  title: `${chain.config.nativeCurrency.symbol} Value:`,
                  value: (
                    <Value
                      value={financialFormat(addressInfo.nativeBalance)}
                      suffix={<>&nbsp;{chain.config.nativeCurrency.symbol}</>}
                    />
                  ),
                },
                {
                  title: `${chain.config.nativeCurrency.symbol} Value:`,
                  value: (
                    <Value
                      value={financialFormat(addressInfo.nativeBalanceUSD)}
                      prefix="$"
                    />
                  ),
                },
                {
                  title: 'Tokens:',
                  value: (
                    <AddressWallet
                      address={address}
                      tokenHoldingsStats={tokenHoldingsStats}
                    />
                  ),
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
                    <TxsDataTable address={address} />
                  </Suspense>
                ),
              },

              {
                title: 'ERC-20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Erc20DataTable address={address} isWalletAddress />
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
