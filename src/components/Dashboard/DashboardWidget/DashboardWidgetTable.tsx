import { FC, useEffect, useState } from 'react'
import DataTable from '@/components/DataTable'
import { DEFAULT_PER_PAGE } from '@/components/Pagination'
import { TRedashQueryResultData } from '@/lib/redash/types'
import { PaginationVariables } from '@/types'

const DashboardWidgetTable: FC<{
  data?: TRedashQueryResultData
  className?: string
}> = ({ data, className }) => {
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
      columns={
        data?.columns.map((col) => {
          return {
            accessor: col.name,
            title: col.friendly_name,
            type: ['integer', 'number'].includes(col.type) ? 'number' : 'text',
          }
        }) || []
      }
      showTools={false}
    />
  )
}

export default DashboardWidgetTable
