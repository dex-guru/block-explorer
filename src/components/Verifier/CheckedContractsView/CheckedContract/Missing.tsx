import React from 'react'
import { SendableContract } from '../../types'
import Message from '@/components/Message'

type MissingProps = {
  checkedContract: SendableContract
}

const Missing: React.FC<MissingProps> = ({ checkedContract }) => {
  const { files } = checkedContract
  const missingCount = Object.keys(files.missing).length
  const totalContracts =
    files.found.length + missingCount + Object.keys(files.invalid).length
  return (
    <Message type="danger">
      {missingCount} out of {totalContracts} source files missing. Please add
      the files in the add file zone
    </Message>
  )
}

export default Missing
