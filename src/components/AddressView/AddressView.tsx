import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from 'viem'
import styles from '../../pages/Pages.module.scss'
import AddressWallet from '../AddressWallet'
import { LoadingCard } from '../Loading'
import { IAddressViewProps } from './types'
import {
  Avatar,
  DetailsView,
  Page,
  Properties,
  TabPanel,
  Card,
  Value,
  Empty,
  Error,
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
  const pageTitle = addressInfo?.address
    ? `Address ${checkSumAddress} on ${chain.config.name}`
    : isAddress(address)
    ? `No address ${address}`
    : 'Not an address'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={chain.config.icon} />
        <link rel="canonical" href={pathname} />
        <meta
          name="description"
          content={`Explore ${checkSumAddress} to track recent transactions, explore token balances held by this wallet, and view account activity in real time.`}
        />
      </Head>
      <Page chainConfig={chain.config}>
        {!addressInfo?.address && isAddress(address) && (
          <Empty
            icon={<IconSearch />}
            title={<>Address {checkSumAddress} not&nbsp;found</>}
          />
        )}

        {!isAddress(address) && <Error title="No correct address provided" />}

        {!!addressInfo?.address && (
          <DetailsView
            icon={<Avatar address={address} />}
            title="Address"
            address={address}
            tag="EOA"
            tagTooltip="Externally Owned Account – anyone with private keys controls this account. It can be thought of as a wallet address."
            type="address"
            chainConfig={chain.config}
          >
            <Properties
              data={[
                {
                  title: `${chain?.config?.nativeCurrency.symbol} Balance:`,
                  value: (
                    <Value
                      value={financialFormat(addressInfo?.nativeBalance)}
                      suffix={<>&nbsp;{chain?.config?.nativeCurrency.symbol}</>}
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
                {
                  title: 'Tokens:',
                  value: (
                    <AddressWallet
                      className={styles.addressWallet}
                      address={checkSumAddress}
                      tokenHoldingsStats={tokenHoldingsStats}
                    />
                  ),
                },
              ]}
            />

            <TabPanel
              tabs={[
                {
                  title: 'Transactions',
                  tooltip: `The tab shows a list of incoming and outgoing ${chain.config.nativeCurrency.symbol} transactions associated with the address, organized in chronological order.`,
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
                  tooltip: 'Transactions with ERC-20 tokens.',
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
                      <Card>Comments feature is coming soon</Card>
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
