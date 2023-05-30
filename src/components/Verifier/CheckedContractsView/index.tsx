import React from 'react'
import { SendableContract, SessionResponse, VerificationInput } from '../types'
import CheckedContract from './CheckedContract'
import { Card } from '@/components'

type CheckedContractsViewProps = {
  checkedContracts: SendableContract[]
  verifyCheckedContract: (
    sendable: VerificationInput
  ) => Promise<SessionResponse | undefined>
}

const CheckedContractsView: React.FC<CheckedContractsViewProps> = ({
  checkedContracts,
  verifyCheckedContract,
}) => {
  if (!checkedContracts.length) return null

  return (
    <Card title="Contracts">
      {checkedContracts.map((contract) => (
        <CheckedContract
          key={contract.verificationId}
          checkedContract={contract}
          verifyCheckedContract={verifyCheckedContract}
        />
      ))}
    </Card>
  )
}

export default CheckedContractsView
