import { FC, useEffect, useState } from 'react'
import DataTable from '@/components/DataTable'
import { DEFAULT_PER_PAGE } from '@/components/Pagination'
import { IColumn } from '@/components/Table'
import { TRedashQueryResultData } from '@/lib/redash/types'
import { formatAutoDetect } from '@/lib/utils'
import { PaginationVariables } from '@/types'

const DashboardWidgetTable: FC<{
  data?: TRedashQueryResultData
  className?: string
  isLoading?: boolean
}> = ({ data, className, isLoading }) => {
  const [currentSkip, setCurrentSkip] = useState(0)
  const [currentFirst, setCurrentFirst] = useState(DEFAULT_PER_PAGE)
  const [currentRows, setCurrentRows] = useState<
    Array<Record<string, number | string>>
  >([])

  const handlePageChange = (vars: PaginationVariables) => {
    setCurrentFirst(vars.first)
    setCurrentSkip(vars.skip)
  }

  useEffect(() => {
    const newRows =
      data?.rows.slice(currentSkip, currentSkip + currentFirst) || []
    setCurrentRows(newRows)
  }, [data, currentSkip, currentFirst])

  return (
    <DataTable
      className={className}
      onPageChange={handlePageChange}
      data={currentRows}
      total={data?.rows.length}
      isLoading={isLoading}
      empty={{
        title: 'No data',
      }}
      columns={
        data?.columns.map((col): IColumn<Record<string, string | number>> => {
          return {
            accessor: col.name,
            title: col.friendly_name,
            type: ['float', 'integer', 'number'].includes(col.type)
              ? 'number'
              : 'text',
            render: (row) => formatAutoDetect(row[col.name]),
          }
        }) || []
      }
    />
  )
}

export default DashboardWidgetTable
