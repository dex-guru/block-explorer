import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  ChainConfigModel,
  CsrStatsModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, LineChart, Page, Value } from '@/components'
import { LineChartDataset } from '@/components/LineChart'
import { CHAIN_ID, CHAIN_IDS } from '@/constants'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CSR_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getShortDate,
} from '@/lib/utils'
import styles from './Pages.module.scss'

interface CSRStatsProps {
  chainConfig: ChainConfigModel
  csrStats: CsrStatsModel
}

const CSRStats: NextPage<CSRStatsProps> = ({ csrStats, chainConfig }) => {
  if (!csrStats || !chainConfig) {
    return null
  }

  const csrStatsSeries: LineChartDataset[] = [
    {
      id: 'burned',
      name: 'Burned',
      color: '#ff646d',
      data: csrStats.burned,
      yAxis: 'left',
      className: styles.chartNegative,
    },
    {
      id: 'netEmissions',
      name: 'Net Emissions',
      color: '#12b886',
      data: csrStats.netEmissions,
      yAxis: 'right',
      className: styles.chartPositive,
    },
  ]

  return (
    <>
      <Head>
        <title>CSR Dashboard</title>
        <meta name="description" content="CSR Dashboard" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <Grid className={styles.grid4}>
          <Card title="Total Revenue">
            <Value
              value={financialFormatLowValueHighPrecision(csrStats.sumRevenue, {
                decimals: 2,
              })}
              suffix={<>&nbsp;{chainConfig.nativeCurrency.symbol}</>}
              className={styles.valueBig}
            />
          </Card>
          <Card title="Registered Contracts">
            <Value
              value={financialFormatLowValueHighPrecision(
                csrStats.sumContracts,
                {
                  decimals: 2,
                }
              )}
              className={styles.valueBig}
            />
          </Card>
          <Card title="Total CSR Transactions">
            <Value
              value={financialFormatLowValueHighPrecision(csrStats.sumTx)}
              className={styles.valueBig}
            />
          </Card>
        </Grid>
        <Card title={`${chainConfig.name} Emissions`}>
          <LineChart
            data={csrStatsSeries}
            options={{
              axis: {
                x: {
                  type: 'number',
                  dataKey: 'timestamp',
                  tickFormatter: (value: number) => getShortDate(value),
                  axisLine: false,
                  tickLine: false,
                },
                y: {
                  tickFormatter: (value: number) =>
                    financialFormat(value, { roundBigNumbersFrom: 'K' }),
                  axisLine: false,
                  tickLine: false,
                },
              },
              zoom: true,
            }}
          />
        </Card>
      </Page>
    </>
  )
}

export default CSRStats

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('csr')

  if (CHAIN_ID !== CHAIN_IDS.CANTO) {
    ctx.res.statusCode = 404
    return { props: {} }
  }
  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: GET_CSR_STATS,
  })
  error
    ? logger.error(error, 'Error getting csr info')
    : logger.info({ msg: 'Got csr info', data })

  return addApolloState(apolloClient, {
    props: {
      csrStats: data.csrStats || null,
      chainConfig: data.chainConfig,
    },
  })
}
