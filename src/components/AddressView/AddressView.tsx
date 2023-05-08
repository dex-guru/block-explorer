import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from '@ethersproject/address'
import styles from '../../pages/Pages.module.scss'
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
  Empty,
  IconSearch,
} from '@/components'
import { financialFormat } from '@/lib/utils'

const TxsDataTable = dynamic(() => import('../Tables/TxsDataTable/'), {
  ssr: false,
})
const Erc20DataTable = dynamic(() => import('../Tables/Erc20DataTable'), {
  ssr: false,
})
const NftDataTable = dynamic(() => import('../Tables/NftDataTable'), {
  ssr: false,
})

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
        {!addressInfo && (
          <Empty
            icon={<IconSearch />}
            title={
              address ? (
                <>Address {checkSumAddress}not&nbsp;found</>
              ) : (
                'No address provided'
              )
            }
          />
        )}

        {!!addressInfo && (
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
                    title: `${chain?.config?.nativeCurrency.symbol} Amount:`,
                    value: (
                      <Value
                        value={financialFormat(addressInfo?.nativeBalance)}
                        suffix={
                          <>&nbsp;{chain?.config?.nativeCurrency.symbol}</>
                        }
                      />
                    ),
                  },
                  {
                    title: `${chain?.config?.nativeCurrency.symbol} Value:`,
                    value: (
                      <Value
                        value={financialFormat(addressInfo?.nativeBalanceUSD)}
                        prefix="$"
                      />
                    ),
                  },
                ]}
              />

              <Properties
                data={[
                  {
                    title: 'Tokens:',
                    value: (
                      <AddressWallet
                        className={styles.addressWallet}
                        address={address}
                        tokenHoldingsStats={tokenHoldingsStats}
                      />
                    ),
                  },
                ]}
              />
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
        )}
      </Page>
    </>
  )
}

export default AddressView
