import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { DataTableProps } from './types'
import { IconSearch } from '@/components/Icons'
import Loading from '@/components/Loading'
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
  const [currentPerPage, setCurrentPerPage] = useState(DEFAULT_PER_PAGE)
  const [isLoadingFullTotal, setIsLoadingFullTotal] = useState(false)

  const {
    className,
    total = props?.data?.length,
    fullTotal,
    getFullTotal,
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

  useEffect(() => {
    setCurrentPage(DEFAULT_FIRST_PAGE)
  }, [total])

  const renderPerPage = useCallback(() => {
    return (
      <PerPageSelector
        onChange={onChangePerPageHandler}
        defaultPerPage={currentPerPage}
      />
    )
  }, [currentPerPage, onChangePerPageHandler])

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        total={Math.min(total, 1000)}
        perPage={currentPerPage}
        onChange={onPageChange}
        className={styles.pagination}
        defaultCurrentPage={currentPage}
        setDefaultCurrentPage={setCurrentPage}
      />
    )
  }, [currentPage, currentPerPage, onPageChange, total])

  const renderTotal = useCallback(() => {
    if (!total) {
      return null
    }

    const currentTotal = fullTotal || total
    const hasFullTotal = getFullTotal && !fullTotal && total >= 1000

    const handleClick =
      getFullTotal && !fullTotal
        ? () => {
            if (!getFullTotal) {
              return
            }

            setIsLoadingFullTotal(true)
            getFullTotal()
          }
        : undefined

    if (!fullTotal && isLoadingFullTotal) {
      return <Loading className={styles.totalLoader} />
    }

    return (
      <span
        className={clsx(styles.totalRows, {
          [styles.totalRowsGet]: !fullTotal && getFullTotal,
        })}
        onClick={handleClick}
      >
        Total {financialFormat(currentTotal, { roundBigNumbersFrom: 'T' })}
        {hasFullTotal ? '+' : null} rows
        {currentTotal >= 1000 && (
          <>
            &nbsp;
            <TooltipAnchor
              tooltip={`Showing the last 1,000 records${
                !fullTotal && hasFullTotal
                  ? ', click to get full total count.'
                  : ''
              }`}
            />
          </>
        )}
      </span>
    )
  }, [total, fullTotal, isLoadingFullTotal, getFullTotal])

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
