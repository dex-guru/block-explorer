import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  ChainConfigModel,
  CsrStatsModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, LineChart, Page, Value } from '@/components'
import { LineChartDataset } from '@/components/LineChart'
import { generateLineChartData } from '@/components/LineChart/utils'
import { CHAIN_ID, CHAIN_IDS } from '@/constants'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CSR_STATS } from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
} from '@/lib/utils'
import styles from './Pages.module.scss'

interface CSRStatsProps {
  chainConfig: ChainConfigModel
  csrStats: CsrStatsModel
}

const CSRStats: NextPage<CSRStatsProps> = ({ csrStats, chainConfig }) => {
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
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page withSearch>
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
            data={generateLineChartData(csrStatsSeries)}
            series={csrStatsSeries}
            options={{
              axis: {
                x: {
                  tickFormatter: (value: number) => {
                    const date = new Date(value * 1000)
                    return date.toLocaleDateString('en-GB', {
                      timeZone: 'UTC',
                      month: 'short',
                      year: '2-digit',
                      day: '2-digit',
                    })
                  },
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
  if (CHAIN_ID !== CHAIN_IDS.CANTO) {
    return
  }
  const apolloClient = initializeApollo({ ctx })

  const { data } = await apolloClient.query({
    query: GET_CSR_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      csrStats: data.csrStats || null,
      chainConfig: data.chainConfig,
    },
  })
}
