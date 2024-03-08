import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

import { getAddress, isAddress } from 'viem'

import { ChainConfigModel, TokenHoldingsStatsModel } from '@/__generated__/resolvers-types'
import Ad from '@/components/Ad'
import DetailsView from '@/components/DetailsView'
import { IconNoData, IconSearch } from '@/components/Icons'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import Summary from '@/components/Summary'
import { SummaryStat } from '@/components/Summary/types'
import TokensDataTable from '@/components/Tables/TokensDataTable'
import Value from '@/components/Value'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_ADDRESS_TOKENS_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { financialFormat } from '@/lib/utils'

interface HoldingsPageServerProps {
  address: string
  tokenHoldingsStats?: TokenHoldingsStatsModel
  chainConfig: ChainConfigModel
}

const HoldingsPage: NextPage<HoldingsPageServerProps> = ({
  address,
  tokenHoldingsStats,
  chainConfig,
}) => {
  const checkSumAddress = isAddress(address) ? getAddress(address) : address

  const renderStats = (): SummaryStat[] => [
    {
      title: 'Assets in Wallet',
      value: financialFormat(tokenHoldingsStats?.tokenCount || 0),
    },
    {
      title: 'Assets Value',
      value: <Value value={financialFormat(tokenHoldingsStats?.totalStable || 0)} prefix="$" />,
    },
  ]

  const pageTitle = isAddress(address)
    ? `${chainConfig.name} Token Holdings for ${checkSumAddress}`
    : `No correct ${chainConfig.name} address provided`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${checkSumAddress} tokens portfolio on ${chainConfig.name} ${chainConfig.chain}, explore token balances held by this wallet, and view account activity in real-time.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={chainConfig}>
        {isAddress(address) && !tokenHoldingsStats && (
          <StateView
            icon={<IconSearch />}
            title="No holdings"
            subtitle={address ? `for address ${checkSumAddress}` : undefined}
          />
        )}

        {!isAddress(address) && (
          <StateView icon={<IconNoData />} title="No correct address provided" />
        )}

        {!!tokenHoldingsStats && (
          <DetailsView
            title="Token Holdings"
            address={checkSumAddress || undefined}
            type="address"
            chainConfig={chainConfig}>
            <Summary stats={renderStats()} />

            <Ad />

            <TokensDataTable address={address} />
          </DetailsView>
        )}
      </Page>
    </>
  )
}

export default HoldingsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('holding address')
  try {
    const { address } = ctx.query as { address: string; tab: string }

    const apolloClient = initializeApollo({ ctx })

    if (address && !isAddress(address)) {
      ctx.res.statusCode = 404

      const { data } = await apolloClient.query<{
        chainConfig: ChainConfigModel
      }>({
        query: CHAIN_STATS,
      })

      return { props: { ...data, address: address } }
    }

    const { data, error } = await apolloClient.query<{
      tokenHoldingsStats: TokenHoldingsStatsModel
    }>({
      query: GET_ADDRESS_TOKENS_STATS,
      variables: { address: address.toLowerCase() },
    })

    error
      ? logger.error(error, 'Error getting GET_ADDRESS_TOKENS_STATS info')
      : logger.info({ msg: 'Got GET_ADDRESS_TOKENS_STATS info', data })

    return addApolloState(apolloClient, {
      props: { address: address, ...data },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
