'use client'

import { FC } from 'react'
import {
  ChainConfigModel,
  CsrStatsModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, LineChart, Page, Value } from '@/components'
import { LineChartDataset } from '@/components/LineChart'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getShortDate,
} from '@/lib/utils'
import styles from './../Pages.module.scss'

export interface ICSRStatsProps {
  chainConfig: ChainConfigModel
  csrStats: CsrStatsModel
}

const CSRStats: FC<ICSRStatsProps> = ({ csrStats, chainConfig }) => {
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
            value={financialFormatLowValueHighPrecision(csrStats.sumContracts, {
              decimals: 2,
            })}
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
                tickFormatter: getShortDate,
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
  )
}

export default CSRStats
