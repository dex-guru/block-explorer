import React, { useState } from 'react'
import clsx from 'clsx'
import DetailedView from '../../DetailedView'
import styles from '../../Verifier.module.scss'
import {
  SendableContract,
  VerificationInput,
  VerifyResponse,
} from '../../types'
import { Status } from '../../types'
import ChainAddressForm from './ChainAddressForm'
import Invalid from './Invalid'
import Missing from './Missing'
import Details from '@/components/Details'
import Label from '@/components/Label'
import { LoadingCard } from '@/components/Loading'
import Properties from '@/components/Properties'

type CheckedContractProps = {
  isOpen?: boolean
  checkedContract: SendableContract
  verifyCheckedContract: (
    sendable: VerificationInput
  ) => Promise<VerifyResponse | undefined>
}

type CustomStatus = Status | 'missing' | 'invalid'

const statusText: Record<CustomStatus, { className: string; text: string }> = {
  perfect: {
    text: 'Perfect Match',
    className: styles.contractTagSuccess,
  },
  partial: {
    text: 'Partial Match',
    className: styles.contractTagWarn,
  },
  missing: {
    text: 'Files Missing',
    className: styles.contractTagError,
  },
  invalid: {
    text: 'Invalid Files',
    className: styles.contractTagError,
  },
  error: {
    text: 'Chain & Address Missing',
    className: styles.contractTagError,
  },
}

const CheckedContract: React.FC<CheckedContractProps> = ({
  isOpen,
  checkedContract,
  verifyCheckedContract,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  let customStatus: CustomStatus
  if (checkedContract.status === 'perfect') customStatus = 'perfect'
  else if (checkedContract.status === 'partial') customStatus = 'partial'
  else if (Object.keys(checkedContract.files.missing).length > 0)
    customStatus = 'missing'
  // Missing files status takes precedence over invalid
  else if (Object.keys(checkedContract.files.invalid).length > 0)
    customStatus = 'invalid'
  else customStatus = 'error'

  const status = (
    <Label
      className={clsx(styles.contractTag, statusText[customStatus].className)}
    >
      {statusText[customStatus].text}
    </Label>
  )

  const { files } = checkedContract
  const foundCount = files.found.length
  const missingCount = Object.keys(files.missing).length
  const invalidCount = Object.keys(files.invalid).length
  const totalFilesCount = foundCount + missingCount + invalidCount

  return (
    <Details
      isOpen={isOpen}
      title={
        <>
          {checkedContract.name} {status}
        </>
      }
      className={styles.contract}
    >
      {isLoading && <LoadingCard />}

      {['perfect', 'partial', 'error'].includes(customStatus) && (
        <ChainAddressForm
          checkedContract={checkedContract}
          customStatus={customStatus}
          verifyCheckedContract={verifyCheckedContract}
          setIsLoading={setIsLoading}
        />
      )}

      {customStatus === 'missing' && (
        <>
          <Properties
            className={styles.viewProps}
            data={[
              { title: 'Contract Name:', value: checkedContract.name },
              { title: 'Compiled Path:', value: checkedContract.compiledPath },
              {
                title: (
                  <>
                    Sources <Label>{totalFilesCount}</Label>
                  </>
                ),
                value: <Missing checkedContract={checkedContract} />,
              },
            ]}
          />
          <DetailedView checkedContract={checkedContract} />
        </>
      )}

      {customStatus === 'invalid' && (
        <Invalid checkedContract={checkedContract} />
      )}
    </Details>
  )
}

export default CheckedContract
