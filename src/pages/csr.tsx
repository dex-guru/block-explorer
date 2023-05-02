import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import clsx from 'clsx'
import {
  ChainConfigModel,
  CsrStatsModel,
  TimeSeriesChartModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, LineChart, Page, Value } from '@/components'
import { LineChartSeries } from '@/components/LineChart'
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

const getChartData = (data: TimeSeriesChartModel[]) => {
  return data.map(({ timestamp, value }) => ({ timestamp, value }))
}

type ChartTuple = { timestamp: number; value: number }
type TimestampObject = { timestamp: number }

const CSRStats: NextPage<CSRStatsProps> = ({ csrStats, chainConfig }) => {
  const csrStatsSeries: (LineChartSeries & { data: ChartTuple[] })[] = [
    {
      id: 'burned',
      color: 'red',
      data: getChartData(csrStats.burned),
      yAxis: 'left',
      className: styles.chartNegative,
    },
    {
      id: 'netEmissions',
      color: 'green',
      data: getChartData(csrStats.netEmissions),
      yAxis: 'right',
      className: styles.chartPositive,
    },
  ]

  const objData: Record<number, unknown> = {}

  csrStatsSeries.forEach((dataset) => {
    dataset.data.forEach((el) => {
      objData[el.timestamp] = {
        ...(objData[el.timestamp] || {
          timestamp: el.timestamp,
          label: el.timestamp,
        }),
        [dataset.id]: el.value,
      }
    })
  })

  const chartData = Object.values(objData).sort(
    (a, b) =>
      (a as TimestampObject).timestamp - (b as TimestampObject).timestamp
  )

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
          <Card className={clsx(styles.span2rows, styles.span2cols)} />
          <Card title="Total Revenue">
            <Value
              value={financialFormatLowValueHighPrecision(csrStats.sumRevenue, {
                decimals: 2,
              })}
              suffix={` ${chainConfig.nativeCurrency.symbol}`}
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
            data={chartData}
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
                },
                y: {
                  tickFormatter: (value: number) =>
                    financialFormat(value, { roundBigNumbersFrom: 'K' }),
                },
              },
            }}
          />
        </Card>
      </Page>
    </>
  )
}

export default CSRStats

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const {
    data: { csrStats, chainConfig },
  } = await apolloClient.query({
    query: GET_CSR_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      csrStats,
      chainConfig,
    },
  })
}
