import { FC } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from 'viem'
import AddressOnChainSelect from '../AddressOnChainSelect'
import OpenWith from '../OpenWith'
import { IAddressViewProps } from './types'
import AddressWallet from '@/components/AddressWallet'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import DetailsView from '@/components/DetailsView'
import { IconNoData, IconSearch } from '@/components/Icons'
import Page from '@/components/Page'
import Properties from '@/components/Properties'
import StateView from '@/components/StateView'
import TabPanel from '@/components/TabPanel'
import Value from '@/components/Value'
import { chains } from '@/constants/chains'
import { checkChainFeature, financialFormat } from '@/lib/utils'
import styles from '@/pages/Pages.module.scss'

const TxsDataTable = dynamic(() => import('@/components/Tables/TxsDataTable/'))
const Erc20DataTable = dynamic(
  () => import('@/components/Tables/Erc20DataTable')
)
const NftDataTable = dynamic(() => import('@/components/Tables/NftDataTable'))
const Analytics = dynamic(() => import('@/components/Analytics'))

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

  const chainsArr = chains.filter(
    (chainData) => chainData.id !== chain.config.chainId
  )

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
          <StateView
            icon={<IconSearch />}
            title={<>Address {checkSumAddress} not&nbsp;found</>}
          />
        )}

        {!isAddress(address) && (
          <StateView
            icon={<IconNoData className={styles.icon} />}
            title="No correct address provided"
          />
        )}

        {!!addressInfo?.address && (
          <DetailsView
            icon={<Avatar address={address} />}
            title="Address"
            address={address}
            tag="EOA"
            tagTooltip="Externally Owned Account – anyone with private keys controls this account. It can be thought of as a wallet address."
            type="address"
            chainConfig={chain.config}
            header={
              <>
                <AddressOnChainSelect
                  address={address}
                  current={chain.config.name}
                  variants={chainsArr}
                />
                <OpenWith
                  type={'address'}
                  chainConfig={chain.config}
                  address={address}
                />
              </>
            }
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
                  tooltip: `Transactions where an EOA (Externally Owned Address aka a wallet address) sends ${chain.config.nativeCurrency.symbol} directly to another EOA.`,
                  value: '',
                  to: pathname,
                  content: <TxsDataTable address={address} />,
                },

                {
                  title: 'Token TXs (ERC-20)',
                  tooltip: 'Transactions with ERC-20 tokens.',
                  value: 'tokentxns',
                  to: `${pathname}?tab=tokentxns`,
                  content: <Erc20DataTable address={address} isWalletAddress />,
                },
                {
                  title: 'NFT Token TXs',
                  value: 'nfttxns',
                  to: `${pathname}?tab=nfttxns`,
                  content: <NftDataTable address={address} />,
                },
                ...(checkChainFeature(chain.config, 'charts')
                  ? [
                      {
                        title: 'Analytics',
                        value: 'analytics',
                        to: `${pathname}?tab=analytics`,
                        content: (
                          <Analytics
                            chainConfig={chain.config}
                            tag="EOA"
                            params={{
                              chain_id: chain.config.chainId,
                              address: address.toLowerCase(),
                            }}
                          />
                        ),
                      },
                    ]
                  : []),
                {
                  title: 'Comments',
                  value: 'comments',
                  to: `${pathname}?tab=comments`,
                  content: <Card>Comments feature is coming soon</Card>,
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
