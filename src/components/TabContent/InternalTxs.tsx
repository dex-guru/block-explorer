import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ChainConfigModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import DataTable from '@/components/DataTable'
import { IconNoData } from '@/components/Icons'
import StateView from '@/components/StateView'
import { internalTxsColumns } from '@/components/Table/columns/internalTxsColumns'
import { useIsMount } from '@/hooks'
import { GET_INTERNAL_TXS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './InternalTxs.module.scss'

const PER_PAGE = 10

interface IInternalTxsProps {
  hash?: string
  address?: string
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
}

export const InternalTxs: FC<IInternalTxsProps> = ({ hash, address, chainConfig, chainStats }) => {
  const [getInternalTxs, { data, loading, previousData }] = useLazyQuery(GET_INTERNAL_TXS)
  const isMount = useIsMount()

  const getVariables = useCallback(
    (vars?: Record<string, string | number | boolean>) => {
      return {
        hash: hash,
        address: address,

        first: PER_PAGE,
        skip: 0,

        ...vars,
      }
    },
    [hash, address]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getInternalTxs({
        variables: getVariables(variables),
      })
    },
    [getInternalTxs, getVariables]
  )

  useEffect(() => {
    getInternalTxs({
      variables: getVariables(),
    })
  }, [getInternalTxs, getVariables])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <StateView
        icon={<IconNoData className={styles.icon} />}
        className={styles.error}
        title="Error while receiving internal transactions events"
        subtitle={`for TX ${hash}`}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () => getInternalTxs({ variables: getVariables() }),
          },
        ]}
      />
    )
  }

  return (
    <DataTable
      isLoading={loading}
      columns={internalTxsColumns(chainConfig, chainStats, !!hash)}
      data={displayData?.internalTransactions?.data}
      total={displayData?.internalTransactions?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No internal transactions events',
        subtitle: `for TX ${hash}`,
      }}
    />
  )
}

export default InternalTxs
