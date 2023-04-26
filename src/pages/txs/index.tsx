import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import { useLazyQuery } from '@apollo/client'
import { columns } from './txsColumns'
import { TransactionModel } from '@/__generated__/resolvers-types'
import { Card } from '@/components'
import { Pagination } from '@/components/Pagination'
import { Table } from '@/components/Table/Table'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

interface ITxsProps {
  data: { transactions: TransactionModel[] }
}

const Txs: NextPage<ITxsProps> = (props) => {
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.data.transactions)
  const [getTransactions, { data }] = useLazyQuery(GET_TRANSACTIONS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({ variables })
    },
    [getTransactions]
  )

  useEffect(() => {
    if (data && isMount) {
      setTransactions(data.transactions)
    }
  }, [data, isMount])

  return (
    <Card>
      {transactions.length && <Table columns={columns} data={transactions} />}

      {transactions.length && (
        <Pagination
          total={transactions[0].blockNumber}
          perPage={perPage[1]}
          onChange={onPaginationChange}
        />
      )}
    </Card>
  )
}

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data } = await apolloClient.query({
    query: GET_TRANSACTIONS,
    variables: { first: 10, skip: 0 },
  })

  return addApolloState(apolloClient, {
    props: { data },
  })
}
