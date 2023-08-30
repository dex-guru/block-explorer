import { FC } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from 'viem'
import { useEnsName } from 'wagmi'
import ChainSelect from '../ChainSelect/ChainSelect'
import { IAddressViewProps } from './types'
import AddressWallet from '@/components/AddressWallet'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import DetailsView from '@/components/DetailsView'
import { IconNoData, IconSearch } from '@/components/Icons'
import OpenWith from '@/components/OpenWith'
import Page from '@/components/Page'
import Properties from '@/components/Properties'
import StateView from '@/components/StateView'
import TabPanel from '@/components/TabPanel'
import Value from '@/components/Value'
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
    ? `${chain.config.name} Address ${checkSumAddress}`
    : isAddress(address)
    ? `No address ${address} on ${chain.config.name}`
    : `Not a ${chain.config.name} address`

  const { data: ensName } = useEnsName({
    chainId: chain.config.chainId,
    address: checkSumAddress as `0x${string}`,
  })

  const tags = [
    <span
      key="type"
      data-tooltip-content="Externally Owned Account – anyone with private keys controls this account. It can be thought of as a wallet address."
      data-tooltip-id="app-tooltip"
    >
      EOA
    </span>,
    ensName,
  ]

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
            tags={tags}
            type="address"
            chainConfig={chain.config}
            header={
              <OpenWith
                type={'address'}
                chainConfig={chain.config}
                address={address}
              />
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
                  title: 'ERC-20 Tokens:',
                  value: (
                    <AddressWallet
                      className={styles.addressWallet}
                      address={checkSumAddress}
                      tokenHoldingsStats={tokenHoldingsStats}
                    />
                  ),
                },
                {
                  title: 'Multichain Addresses:',
                  value: (
                    <ChainSelect
                      chainConfig={chain.config}
                      className={styles.multichain}
                      urlGenerator={(chain) =>
                        `${chain.guruBlockExplorer?.url}${chain.guruBlockExplorer?.addressPath}/${address}`
                      }
                    />
                  ),
                },
              ]}
            />

            <TabPanel
              tabs={[
                {
                  title: 'Transactions',
                  tooltip: 'Transactions where the address is a sending party.',
                  value: '',
                  to: pathname,
                  content: <TxsDataTable address={address} />,
                },

                {
                  title: 'Token TXs (ERC-20)',
                  tooltip:
                    'On-chain events where the address either received or sent ERC-20 tokens.',
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
                            tag="EOA"
                            params={{
                              network: chain.config.shortName,
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
