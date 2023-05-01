import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import clsx from 'clsx'
import {
  ChainConfigModel,
  CsrStatsModel,
  TimeSeriesChartModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, LineChart, Page, Value } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CSR_STATS } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from './Pages.module.scss'

interface CSRStatsProps {
  chainConfig: ChainConfigModel
  csrStats: CsrStatsModel
}

type TimestampObject = {
  timestamp: number
}

const getChartData = (data: TimeSeriesChartModel[]) => {
  return data.map(({ timestamp, value }) => {
    const date = new Date(timestamp * 1000)
    return {
      timestamp,
      value,
      x: date.toLocaleDateString('en-GB', {
        timeZone: 'UTC',
        month: 'short',
        day: '2-digit',
      }),
      y: value,
    }
  })
}

const CSRStats: NextPage<CSRStatsProps> = ({ csrStats, chainConfig }) => {
  const csrStatsData = [
    {
      id: 'netEmission',
      color: 'green',
      data: getChartData(csrStats.netEmissions),
    },
    { id: 'burned', color: 'red', data: getChartData(csrStats.burned) },
  ]

  const objData: Record<number, unknown> = {}

  csrStatsData.forEach((dataset) => {
    dataset.data.forEach((el) => {
      const date = new Date(el.timestamp * 1000)
      const dateDisplay = date.toLocaleDateString('en-GB', {
        timeZone: 'UTC',
        month: 'short',
        day: '2-digit',
      })

      objData[el.timestamp] = {
        ...(objData[el.timestamp] || {}),
        [dataset.id]: el.value,
        timestamp: el.timestamp,
        label: dateDisplay,
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
          <LineChart data={chartData} />
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
