import { FC } from 'react'
import { TransactionModel } from '@/__generated__/resolvers-types'
import { Card } from '@/components'

const TxTrace: FC<{ data: TransactionModel }> = ({}) => {
  return <Card>Some trace here</Card>
}

export default TxTrace
