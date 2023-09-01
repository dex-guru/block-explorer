import { useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useIntervalWhen } from 'rooks'
import { WagmiConfig } from 'wagmi'
import { FetchFeeDataResult, fetchFeeData } from 'wagmi/actions'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Dashboard from '@/components/Dashboard'
import DetailsView from '@/components/DetailsView'
import Grid from '@/components/Grid'
import Page from '@/components/Page'
import Summary from '@/components/Summary'
import Value from '@/components/Value'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboard } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import { checkChainFeature, financialFormat } from '@/lib/utils'

interface GasTrackerPageProps {
  chainConfig: ChainConfigModel
  dashboard: TRedashDashboard
}

const GasTrackerPage: NextPage<GasTrackerPageProps> = ({
  dashboard,
  chainConfig,
}) => {
  const { wagmiConfig } = useWagmiConfig(chainConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [gasData, setGasData] = useState<FetchFeeDataResult | null>(null)

  const getData = () => {
    setIsLoading(true)
    fetchFeeData().then((res) => {
      setIsLoading(false)
      setGasData(res || null)
    })
  }

  useEffect(getData, [])

  useIntervalWhen(
    getData,
    Math.max(Number(chainConfig.blockTime || process.env.pollInterval), 20000),
    !isLoading
  )

  const pageTitle = `${chainConfig.name} Gas Tracker${
    gasData
      ? `: ${financialFormat(gasData.formatted.gasPrice || 0)} ${
          chainConfig.gasUnit
        }`
      : ''
  }`

  return (
    <WagmiConfig config={wagmiConfig}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="CSR Dashboard" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView title={`${chainConfig.name} Gas Tracker`}>
          <Grid>
            <Summary
              stats={[
                {
                  title: 'Gas Price',
                  value: (
                    <Value
                      value={
                        gasData
                          ? financialFormat(gasData.formatted.gasPrice || 0)
                          : '–'
                      }
                      suffix={<>&nbsp;{chainConfig.gasUnit}</>}
                    />
                  ),
                },
                {
                  title: 'Max Fee Per Gas',
                  value: gasData
                    ? financialFormat(gasData?.formatted.maxFeePerGas || 0)
                    : '–',
                },
                {
                  title: 'Max Priority Fee Per Gas',
                  value: gasData
                    ? financialFormat(
                        gasData?.formatted.maxPriorityFeePerGas || 0
                      )
                    : '–',
                },
              ]}
            />
          </Grid>
        </DetailsView>
        {!!dashboard && checkChainFeature(chainConfig, 'charts') && (
          <Dashboard
            data={dashboard}
            params={{
              network: chainConfig.shortName,
            }}
          />
        )}
      </Page>
    </WagmiConfig>
  )
}

export default GasTrackerPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('csr')
  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  error
    ? logger.error(error, 'Error getting chainConfig info')
    : logger.info({ msg: 'Got chainConfig info', data })

  return addApolloState(apolloClient, {
    props: {
      dashboard: await getRedashDashboard('gas_tracker'),
      chainConfig: data.chainConfig,
    },
  })
}
