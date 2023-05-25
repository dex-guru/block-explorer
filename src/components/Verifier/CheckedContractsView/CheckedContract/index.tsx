import React, { MouseEventHandler, useState } from 'react'
import DetailedView from '../../DetailedView'
import {
  SendableContract,
  SessionResponse,
  VerificationInput,
} from '../../types'
import ChainAddressForm from './ChainAddressForm'
import Invalid from './Invalid'
import Label from './Label'
import Missing from './Missing'

type CheckedContractProps = {
  checkedContract: SendableContract
  verifyCheckedContract: (
    sendable: VerificationInput
  ) => Promise<SessionResponse | undefined>
  collapsed: boolean
  toggleCollapse: () => void
}

enum VerifyMethods {
  DEPLOYED,
  CREATE2,
}

const CheckedContract: React.FC<CheckedContractProps> = ({
  checkedContract,
  verifyCheckedContract,
  collapsed,
  toggleCollapse,
}) => {
  const [verifyMethodSelected, setVerifyMethodSelected] =
    useState<VerifyMethods>(VerifyMethods.DEPLOYED)

  const selectVerifyMethod = (method: VerifyMethods) => {
    if (method === verifyMethodSelected) {
      setVerifyMethodSelected(VerifyMethods.DEPLOYED)
    } else {
      setVerifyMethodSelected(method)
    }
  }

  const [isDetailedViewShown, setIsDetailedViewShown] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const closeModal = () => {
    setIsDetailedViewShown(false)
  }
  const openModal = () => {
    setIsDetailedViewShown(true)
  }

  const toggleCollapseWrapper: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    toggleCollapse()
  }

  let customStatus
  if (checkedContract.status === 'perfect') customStatus = 'perfect'
  else if (checkedContract.status === 'partial') customStatus = 'partial'
  else if (Object.keys(checkedContract.files.missing).length > 0)
    customStatus = 'missing'
  // Missing files status takes precedence over invalid
  else if (Object.keys(checkedContract.files.invalid).length > 0)
    customStatus = 'invalid'
  else customStatus = 'error'

  return (
    <div className="mb-4 bg-ceruleanBlue-100 rounded-md relative">
      {/* Loading Overlay */}
      {isLoading && <p>Verifying Contract</p>}
      {/* Contract item header */}
      <button
        onClick={toggleCollapseWrapper}
        className="flex flex-row justify-between w-full bg-ceruleanBlue-500 rounded-md text-white p-4"
      >
        <h2 className="font-bold text-lg break-all text-left mr-1">
          {checkedContract.name}
        </h2>
        <div className="flex flex-nowrap items-center">
          {/* <div className="flex flex-row items-center"> */}
          <Label customStatus={customStatus} />
        </div>
      </button>

      {/* Collapsed section */}
      <div className={`${collapsed ? 'hidden' : ''} break-words px-4 p-4`}>
        <div className="flex flex-row flex-wrap gap-3 mt-4 justify-center md:justify-start mb-6">
          <div className="">
            <button
              onClick={() => selectVerifyMethod(VerifyMethods.DEPLOYED)}
              className="text-sm"
            >
              Verify deployed contract
            </button>
          </div>
        </div>
        {verifyMethodSelected === VerifyMethods.DEPLOYED &&
          ['perfect', 'partial', 'error'].includes(customStatus) && (
            <ChainAddressForm
              checkedContract={checkedContract}
              customStatus={customStatus}
              verifyCheckedContract={verifyCheckedContract}
              setIsLoading={setIsLoading}
            />
          )}

        {customStatus === 'missing' && (
          <Missing checkedContract={checkedContract} />
        )}
        {customStatus === 'invalid' && (
          <Invalid checkedContract={checkedContract} />
        )}
        <DetailedView
          isShown={isDetailedViewShown}
          closeModal={closeModal}
          checkedContract={checkedContract}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={openModal}
            className="font-bold hover:underline flex items-center"
          >
            Detailed View
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckedContract
