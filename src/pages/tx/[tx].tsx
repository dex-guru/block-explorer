import { Suspense, useMemo } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isHexString } from '@ethersproject/bytes'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { publicProvider } from '@wagmi/core/providers/public'
import { get } from 'lodash'
import * as viemChains from 'viem/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import {
  ChainConfigModel,
  ChainStatsModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import DetailsView from '@/components/DetailsView/DetailsView'
import { IconEmpty } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import OpenWith from '@/components/OpenWith'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import TabPanel from '@/components/TabPanel'
import { WALLET_CONNECT_PROJECT_ID } from '@/constants'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_TRANSACTIONS_BY_HASH } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

const TxOverview = dynamic(() => import('@/components/TabContent/TxOverview'))
const TxLogs = dynamic(() => import('@/components/TabContent/TxLogs'))
const TxTrace = dynamic(() => import('@/components/TabContent/TxTrace'))
const TxInternalTxs = dynamic(
  () => import('@/components/TabContent/TxInternalTxs')
)

export const MAX_EVENTS_PER_PAGE = 10

interface ITxProps {
  data: TransactionModel
  logs: LogModel[]
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const TxPage: NextPage<ITxProps> = (props) => {
  const router = useRouter()
  const { tab } = router.query
  const pathname = router.asPath.split('?')[0]

  const currentTab = Array.isArray(tab) ? tab[0] : tab || ''

  const pageTitle = `${props.chainConfig.name} Transaction ${
    props.data?.hash || 'not found'
  }`

  const { chains, publicClient } = useMemo(() => {
    const viemChainName = Object.keys(viemChains).find(
      (chainName) => get(viemChains, chainName).id === props.chainConfig.chainId
    )
    const viemChain = viemChainName ? get(viemChains, viemChainName) : undefined
    const currentChain = {
      ...viemChain,
      id: props.chainConfig.chainId,
      name: props.chainConfig.name,
      network: props.chainConfig.shortName,
      nativeCurrency: props.chainConfig.nativeCurrency,
      rpcUrls: {
        default: {
          http: props.chainConfig.rpc,
        },
        public: {
          http: props.chainConfig.rpc,
        },
      },
      blockExplorers: {
        default: {
          name: props.chainConfig.explorers[0].name,
          url: props.chainConfig.explorers[0].url,
        },
      },
    }
    return configureChains([currentChain], [publicProvider()])
  }, [
    props.chainConfig.chainId,
    props.chainConfig.explorers,
    props.chainConfig.name,
    props.chainConfig.nativeCurrency,
    props.chainConfig.rpc,
    props.chainConfig.shortName,
  ])

  const { connectors } = useMemo(
    () =>
      getDefaultWallets({
        appName: 'Block Explorer',
        chains,
        projectId: WALLET_CONNECT_PROJECT_ID,
      }),
    [chains]
  )

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
      }),
    [connectors, publicClient]
  )

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pathname} />
        <meta
          name="description"
          content={`Explore transaction ${
            props.data?.hash || ''
          } to see what happened with token balances and smart contracts in this TX.`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        {!props.data?.hash && (
          <StateView icon={<IconEmpty />} title="No TX was found" />
        )}

        {!!props.data?.hash && (
          <DetailsView
            title="Transaction"
            address={props.data?.hash || undefined}
            type="tx"
            chainConfig={props.chainConfig}
            header={
              <OpenWith
                type={'tx'}
                chainConfig={props.chainConfig}
                address={props.data?.hash}
              />
            }
          >
            <TabPanel
              tabs={[
                {
                  title: 'Overview',
                  value: '',
                  to: pathname,
                  content: (
                    <WagmiConfig config={wagmiConfig}>
                      <Suspense fallback={<LoadingCard />}>
                        <TxOverview {...props} />
                      </Suspense>
                    </WagmiConfig>
                  ),
                },
                {
                  title: 'Internal TXns',
                  value: 'internal',
                  to: `${pathname}?tab=internal`,
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <TxInternalTxs hash={props.data.hash} {...props} />
                    </Suspense>
                  ),
                },
                {
                  title: `Logs (${props.data.receiptLogsCount || 0})`,
                  value: 'logs',
                  to: `${pathname}?tab=logs`,
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <TxLogs {...props} />
                    </Suspense>
                  ),
                },
                {
                  title: 'Trace',
                  value: 'trace',
                  to: `${pathname}?tab=trace`,
                  content: (
                    <Suspense fallback={<LoadingCard />}>
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
    </>
  )
}

export default TxPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('tx')
  try {
    const { tx } = ctx.query

    const apolloClient = initializeApollo({ ctx })

    if (!isHexString(tx)) {
      ctx.res.statusCode = 404

      const { data } = await apolloClient.query<{
        chainStats: ChainStatsModel
        chainConfig: ChainConfigModel
      }>({
        query: CHAIN_STATS,
      })

      return { props: data }
    }

    const { data, error: errorData } = await apolloClient.query<{
      transactions: TransactionModel[]
      logs: LogModel[]
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
    }>({
      query: GET_TRANSACTIONS_BY_HASH,
      variables: { hash: tx },
    })

    errorData
      ? logger.error(errorData, 'Error getting GET_TRANSACTIONS_BY_HASH info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_BY_HASH info', data })

    const { transactions, logs, chainConfig, chainStats } = data

    if (!transactions?.length) {
      ctx.res.statusCode = 404
    }

    return addApolloState(apolloClient, {
      props: {
        data: transactions[0] || null,
        logs: logs || [],
        chainConfig: chainConfig,
        chainStats: chainStats,
      },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
