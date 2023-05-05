import { useState, useEffect } from 'react'
import { ADD_FILES_FROM_CONTRACT_URL } from './constants'
import { SessionResponse } from './types'

type EtherscanInputProps = {
  fetchAndUpdate: (
    URL: string,
    fetchOptions?: RequestInit
  ) => Promise<SessionResponse | undefined>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}
const ContractInput = ({
  fetchAndUpdate,
  setIsLoading,
  isLoading,
}: EtherscanInputProps) => {
  const [address, setAddress] = useState<string>('')
  const [chainId, setChainId] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleAddressChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault()
    setAddress(e.target.value)
    if (!e.target.value) return setError('')
  }

  useEffect(() => {
    if (address === '' || chainId === '') {
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('address', address)
    formData.append('chainId', chainId)

    fetchAndUpdate(ADD_FILES_FROM_CONTRACT_URL, {
      method: 'POST',
      body: formData,
    }).finally(() => {
      setAddress('')
      setChainId('')
      setIsLoading(false)
    })
  }, [address, chainId, fetchAndUpdate, setIsLoading])

  return (
    <div className="mb-2">
      {error && <div className="text-sm text-red-400">{error}</div>}
      <input
        disabled={isLoading}
        value={address}
        onChange={handleAddressChange}
        placeholder="0x00878Ac0D6B8d9..."
        className="mb-2"
      />
    </div>
  )
}

export default ContractInput
