import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { ChainConfigModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Button from '@/components/Button'
import DetailsView from '@/components/DetailsView'
import { IconCross, IconSuccess } from '@/components/Icons'
import Page from '@/components/Page'
import Properties, { Property } from '@/components/Properties'
import Separated from '@/components/Separated'
import Summary from '@/components/Summary'
import Value from '@/components/Value'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS_FULL } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { financialFormat, financialFormatLowValueHighPrecision } from '@/lib/utils'

import styles from './Pages.module.scss'

interface ChainPageProps {
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
}

const ChainPage: NextPage<ChainPageProps> = ({ chainConfig, chainStats: stats }) => {
  const pageTitle = `${chainConfig.name}${
    chainConfig.chain ? ` ${chainConfig.chain}` : ''
  } Blockchain Info`

  const addNetwork = () => {
    window?.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainConfig.chainId.toString(16)}`,
          chainName: `${chainConfig.name}${chainConfig.chain ? ` ${chainConfig.chain}` : ''}`,
          rpcUrls: chainConfig.rpc,
          blockExplorerUrls: [...chainConfig.explorers.map((item) => item.url)],
          nativeCurrency: {
            name: chainConfig.nativeCurrency.name,
            symbol: chainConfig.nativeCurrency.symbol,
            decimals: chainConfig.nativeCurrency.decimals,
          },
        },
      ],
    })
  }

  const statsDisplay = [
    {
      title: 'Transactions',
      value: <Value value={financialFormatLowValueHighPrecision(stats.transactionsCount)} />,
    },
    {
      title: 'TPS',
      tooltip:
        'Transactions Per Second (TPS) refers to the number of transactions a blockchain can handle in one second. Calculated as: Amount of TXs / Average Block Time.',
      value: (
        <Separated>
          <Value
            tooltip="TPS of the last indexed block"
            value={financialFormat(stats.transactionsPerSecond, {
              decimals: 2,
            })}
          />
          <Value
            tooltip="TPS over the last 5 minutes"
            value={financialFormat(stats.transactionsPerSecondFiveMinutesAVG, {
              decimals: 2,
            })}
          />
          <Value
            tooltip="TPS over the last 24 hours"
            value={financialFormat(stats.transactionsPerSecondDailyAVG, {
              decimals: 2,
            })}
          />
        </Separated>
      ),
    },
    {
      title: 'Average Block Time, 24h',
      value: <Value value={financialFormatLowValueHighPrecision(stats.averageBlockTime)} />,
    },
    {
      title: 'Total Addresses',
      tooltip: 'Total of distinct address numbers who send at least one transaction on-chain.',
      value: <Value value={financialFormatLowValueHighPrecision(stats.activeAddressesCount)} />,
    },
    {
      title: 'Active Addresses, 24h',
      value: <Value value={financialFormatLowValueHighPrecision(stats.activeAddressesCount24h)} />,
    },
    {
      title: 'Smart Contracts',
      tooltip: 'Total number of smart contracts created on-chain.',
      value: <Value value={financialFormatLowValueHighPrecision(stats.smartContractsCount)} />,
    },
  ]

  const propertiesTech: Property[] = [
    {
      title: 'Chain ID',
      value: (
        <Value
          value={chainConfig.chainId}
          suffix={<>&nbsp;0x{chainConfig.chainId.toString(16)}</>}
        />
      ),
    },
    {
      title: 'Info',
      value: <Link href={chainConfig.infoURL}>{chainConfig.infoURL}</Link>,
    },
    ...(chainConfig.description ? [{ title: 'Description', value: chainConfig.description }] : []),
    {
      title: 'Currency',
      value: chainConfig.nativeCurrency.symbol,
    },
    {
      title: `${chainConfig.nativeCurrency.symbol} Price`,
      value: (
        <Value
          value={financialFormat(stats.nativeTokenPriceUsd)}
          prefix="$"
          delta={stats.nativeTokenPriceUsd24hDelta * 100}
        />
      ),
    },
    {
      title: 'Gas Unit',
      value: chainConfig.gasUnit,
    },
    {
      title: 'EIP1559',
      value: chainConfig.features.find((item) => item.name === 'EIP1559') ? (
        <IconSuccess style={{ width: 20 }} />
      ) : (
        <IconCross style={{ width: 20 }} />
      ),
    },
    {
      title: 'RPC',
      value: (
        <div className="text">
          <ul>
            {chainConfig.rpc.map((rpc, idx) => (
              <li key={idx}>
                <Address address={rpc} title={rpc} isCopy />
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ]
  const propertiesNative: Property[] = [
    { title: 'Name', value: chainConfig.nativeCurrency.name },
    { title: 'Symbol', value: chainConfig.nativeCurrency.symbol },
    { title: 'Decimals', value: chainConfig.nativeCurrency.decimals },
    {
      title: 'Wrapped Address',
      value: (
        <>
          <Address
            type="token"
            title={chainConfig.nativeCurrency.wrappedAddress || ''}
            address={chainConfig.nativeCurrency.wrappedAddress || ''}
            isCopy
            isShorten={false}
          />
        </>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Discover the power of ${chainConfig.name} blockchain with our reliable block explorer. Track transactions, explore blocks, and view network statistics in real time. Perfect for beginners and experts alike.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView
          icon={<Image width={32} height={32} src={chainConfig.icon} alt={chainConfig.shortName} />}
          header={
            <Button caption="Add to wallet" className={styles.addToWallet} onClick={addNetwork} />
          }
          title={chainConfig.name}>
          <Summary title="Chain stats" stats={statsDisplay} />
          <Properties data={propertiesTech} />
          <Properties title="Native Currency" data={propertiesNative} />
        </DetailsView>
      </Page>
    </>
  )
}

export default ChainPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('chainpage')

  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: CHAIN_STATS_FULL,
  })

  error
    ? logger.error(error, 'Error getting CHAIN_STATS_FULL info')
    : logger.info({ msg: 'Got CHAIN_STATS_FULL info', data })

  return addApolloState(apolloClient, {
    props: {
      ...data,
    },
  })
}
