import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react'
import { getAddress } from '@ethersproject/address'
import { isHexString } from '@ethersproject/bytes'
import { clsx } from 'clsx'
import styles from '../../../Verifier.module.scss'
import { checkAllByAddresses } from '../../../api'
import {
  CheckAllByAddressResult,
  SendableContract,
  VerificationInput,
  VerifyResponse,
} from '../../../types'
import Message from './Message'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Properties from '@/components/Properties'
import DetailedView from '@/components/Verifier/DetailedView'
import { CHAIN_ID } from '@/constants'

type ChainAddressFormProps = {
  customStatus: string
  checkedContract: SendableContract
  verifyCheckedContract: (
    sendable: VerificationInput
  ) => Promise<VerifyResponse | undefined>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const ChainAddressForm = ({
  customStatus,
  checkedContract,
  verifyCheckedContract,
  setIsLoading,
}: ChainAddressFormProps) => {
  const [address, setAddress] = useState<string>('')
  const [isInvalidAddress, setIsInvalidAddress] = useState<boolean>(false)
  const [foundMatches, setFoundMatches] = useState<CheckAllByAddressResult>()
  const [creatorTxHash, setCreatorTxHash] = useState<string>('')
  const [isInvalidCreatorTxHash, setIsInvalidCreatorTxHash] =
    useState<boolean>(false)

  useEffect(() => {
    if (checkedContract.address) {
      setAddress(checkedContract.address)
    }
  }, [setAddress, checkedContract])

  const handleAddressChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const tempAddr = e.target.value
    let checksummedAddress: string
    try {
      // getAddress: returns the checksummed address only if you pass all lowercase
      // if you pass a wrong checksum then in throws, so I'm converting the address
      // to lowercase
      checksummedAddress = getAddress(tempAddr.toLowerCase())
      setAddress(checksummedAddress)
      setIsInvalidAddress(false)
    } catch (e) {
      setFoundMatches(undefined)
      setAddress(tempAddr)
      return setIsInvalidAddress(true)
    }

    checkAllByAddresses(checksummedAddress, CHAIN_ID.toString()).then((res) => {
      // checkAllByAddresses inputs and outptus multiple addresses.
      const currentAddressMatches = res.find(
        (match) => (match.address = checksummedAddress)
      )
      setFoundMatches(currentAddressMatches)
    })
  }
  const handleCreatorTxHashChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const tempHash = e.target.value
    setCreatorTxHash(tempHash)
    if (!isHexString(tempHash, 32) && tempHash !== '') {
      return setIsInvalidCreatorTxHash(true)
    }
    setIsInvalidCreatorTxHash(false)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!address || isInvalidAddress /* || isInvalidMsgSender */) return
    setIsLoading(true)
    verifyCheckedContract({
      verificationId: checkedContract.verificationId || '',
      address: address || '',
      chainId: CHAIN_ID.toString(),
      /* contextVariables: {
        abiEncodedConstructorArguments,
        msgSender,
      }, */
      creatorTxHash,
    }).finally(() => setIsLoading(false))
  }

  const foundCount = checkedContract.files.found.length
  const missingCount = Object.keys(checkedContract.files.missing).length
  const invalidCount = Object.keys(checkedContract.files.invalid).length
  const totalFilesCount = foundCount + missingCount + invalidCount

  return (
    <div className="">
      <div className="">
        <Message
          customStatus={customStatus}
          checkedContract={checkedContract}
          foundMatches={foundMatches}
        />
      </div>
      <form className={styles.viewForm} onSubmit={handleSubmit}>
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
              value: (
                <DetailedView
                  checkedContract={checkedContract}
                  className={styles.viewDetails}
                />
              ),
            },
            {
              title: (
                <label
                  className={clsx({
                    [styles.viewInputInvalid]: isInvalidAddress,
                  })}
                  htmlFor="address"
                >
                  Address
                </label>
              ),
              value: (
                <input
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="0x2fabe97..."
                  className={styles.viewInput}
                />
              ),
            },
            { title: 'Chain', value: CHAIN_ID },
            {
              title: (
                <label
                  className={clsx({
                    [styles.viewInputInvalid]: isInvalidCreatorTxHash,
                  })}
                  htmlFor="creatorTxHash"
                >
                  Creator Tx Hash (optional)
                </label>
              ),
              value: (
                <input
                  id="creatorTxHash"
                  value={creatorTxHash}
                  onChange={handleCreatorTxHashChange}
                  placeholder="0x2fabe97..."
                  className={styles.viewInput}
                />
              ),
            },
          ]}
        />

        <Button
          caption="Verify"
          type="submit"
          className={styles.viewSubmit}
          disabled={!address || isInvalidAddress}
        />
      </form>
    </div>
  )
}

export default ChainAddressForm
