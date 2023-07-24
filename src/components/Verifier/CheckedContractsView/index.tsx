import React from 'react'
import styles from '../Verifier.module.scss'
import { SendableContract, VerificationInput, VerifyResponse } from '../types'
import CheckedContract from './CheckedContract'
import Card from '@/components/Card'

type CheckedContractsViewProps = {
  checkedContracts: SendableContract[]
  verifyCheckedContract: (
    sendable: VerificationInput
  ) => Promise<VerifyResponse | undefined>
}

const CheckedContractsView: React.FC<CheckedContractsViewProps> = ({
  checkedContracts,
  verifyCheckedContract,
}) => {
  if (!checkedContracts.length) return null

  return (
    <Card title="Contracts" className={styles.contracts}>
      {checkedContracts.map((contract) => (
        <CheckedContract
          isOpen={checkedContracts.length === 1}
          key={contract.verificationId}
          checkedContract={contract}
          verifyCheckedContract={verifyCheckedContract}
        />
      ))}
    </Card>
  )
}

export default CheckedContractsView
