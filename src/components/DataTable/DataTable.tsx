import { useCallback, useState } from 'react'
import clsx from 'clsx'
import { DataTableProps } from './types'
import { IconSearch } from '@/components/Icons'
import Pagination, {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PER_PAGE,
} from '@/components/Pagination'
import PerPageSelector from '@/components/PerPageSelector'
import StateView from '@/components/StateView'
import Table from '@/components/Table'
import TooltipAnchor from '@/components/TooltipAnchor'
import IconEmpty from '@/images/icons/no-flash.svg'
import { financialFormat } from '@/lib/utils'
import styles from './DataTable.module.scss'

export function DataTable<T>(props: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(DEFAULT_FIRST_PAGE)
  const [currentPerPagePage, setCurrentPerPage] = useState(DEFAULT_PER_PAGE)

  const {
    className,
    total = 0,
    onPageChange,
    header,
    ...tablePropsRest
  } = props

  const onChangePerPageHandler = useCallback(
    (value: number) => {
      onPageChange && onPageChange({ first: value, skip: 0 })
      setCurrentPerPage(value)
      setCurrentPage(DEFAULT_FIRST_PAGE)
    },
    [onPageChange]
  )

  const renderPerPage = useCallback(() => {
    return (
      <PerPageSelector
        onChange={onChangePerPageHandler}
        defaultPerPage={currentPerPagePage}
      />
    )
  }, [currentPerPagePage, onChangePerPageHandler])

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        total={Math.min(total, 1000)}
        perPage={currentPerPagePage}
        onChange={onPageChange}
        className={styles.pagination}
        defaultCurrentPage={currentPage}
        setDefaultCurrentPage={setCurrentPage}
      />
    )
  }, [currentPage, currentPerPagePage, onPageChange, total])

  const renderTotal = useCallback(() => {
    return (
      <span className={styles.totalRows}>
        Total {financialFormat(total, { roundBigNumbersFrom: 'T' })} rows
        {total > 1000 && (
          <>
            &nbsp;
            <TooltipAnchor tooltip="Showing the last 1,000 records" />
          </>
        )}
      </span>
    )
  }, [total])

  const navigation = (
    <div className={styles.navigation}>
      <div className={styles.total}>
        {renderPerPage()}
        {renderTotal()}
      </div>
      <div className={styles.pager}>{renderPagination()}</div>
      <div className={styles.tools}>
        {!!header && <div className={styles.tools}>{header}</div>}
      </div>
    </div>
  )

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>{navigation}</div>
      <div className={styles.body}>
        {!tablePropsRest.isLoading && !total && props.empty && (
          <StateView icon={<IconEmpty />} {...props.empty} />
        )}

        {!total && tablePropsRest.isLoading && (
          <StateView icon={<IconSearch />} title="Querying for data..." />
        )}

        {!!total && <Table {...tablePropsRest} className={styles.table} />}
      </div>
      <div className={styles.footer}>{navigation}</div>
    </div>
  )
}

export default DataTable
