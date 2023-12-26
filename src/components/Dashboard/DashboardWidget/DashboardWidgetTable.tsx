import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import DataTable from '@/components/DataTable'
import { DEFAULT_PER_PAGE } from '@/components/Pagination'
import { IColumn } from '@/components/Table'
import { TRedashQueryResultData, TRedashVisualizationOptions } from '@/lib/redash/types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'
import styles from './DashboardWidget.module.scss'

const DashboardWidgetTable: FC<{
  data?: TRedashQueryResultData
  className?: string
  isLoading?: boolean
  options?: TRedashVisualizationOptions
}> = ({ data, className, isLoading, options }) => {
  const [currentSkip, setCurrentSkip] = useState(0)
  const [currentFirst, setCurrentFirst] = useState(DEFAULT_PER_PAGE)
  const [currentRows, setCurrentRows] = useState<Array<Record<string, number | string>>>([])

  const handlePageChange = (vars: PaginationVariables) => {
    setCurrentFirst(vars.first)
    setCurrentSkip(vars.skip)
  }

  const columns = options?.columns
    ? options?.columns
        ?.filter((col) => col.visible)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((col): IColumn<Record<string, string | number>> => {
          const isNumber = ['float', 'integer', 'number'].includes(col.type)

          return {
            accessor: col.name,
            title: col.title,
            type: ['float', 'integer', 'number'].includes(col.type) ? 'number' : 'text',
            render: (row) => (
              <div className={styles.tcellData}>
                {isNumber &&
                  financialFormatLowValueHighPrecision(row[col.name], {
                    disableRounding: true,
                  })}
                {!isNumber && `${row[col.name]}`}
              </div>
            ),
          }
        })
    : data?.columns.map((col): IColumn<Record<string, string | number>> => {
        const isNumber = ['float', 'integer', 'number'].includes(col.type)
        return {
          accessor: col.name,
          title: col.friendly_name,
          type: ['float', 'integer', 'number'].includes(col.type) ? 'number' : 'text',
          render: (row) => (
            <div className={styles.tcellData}>
              {isNumber &&
                financialFormatLowValueHighPrecision(row[col.name], {
                  disableRounding: true,
                })}
              {!isNumber && `${row[col.name]}`}
            </div>
          ),
        }
      }) || []

  useEffect(() => {
    const newRows = data?.rows.slice(currentSkip, currentSkip + currentFirst) || []

    setCurrentRows(newRows)
  }, [data, currentSkip, currentFirst])

  return (
    <DataTable
      className={clsx(styles.widgetTable, className)}
      onPageChange={handlePageChange}
      data={currentRows}
      total={data?.rows.length}
      isLoading={isLoading}
      empty={{
        title: 'No data',
      }}
      columns={columns}
    />
  )
}

export default DashboardWidgetTable
