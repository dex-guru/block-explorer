import { FC } from 'react'
import { Abi, AbiFunction } from 'abitype'
import { LoadingCard } from '../Loading'
import ContractMethodForm from './ContractMethodForm'
import ContractProperty from './ContractProperty'
import { IContractViewContractTabProps } from './types'
import { Files, ConnectButton } from '@/components'
import { useSourcifyMetadata } from '@/hooks/useSourcify'

const ContractViewContractTab: FC<IContractViewContractTabProps> = ({
  address,
  tab,
}) => {
  const match = useSourcifyMetadata(address, 7700)
  const abi = (match?.metadata?.output?.abi as Abi) || undefined

  return (
    <>
      {['readContract', 'writeContract'].includes(tab as string) && (
        <>
          {!!abi && <ConnectButton />}
          {!abi && <LoadingCard />}
        </>
      )}
      {tab === 'code' && <Files match={match} address={address} />}
      {tab === 'readContract' && (
        <>
          {!!abi &&
            (abi as Abi)
              .filter(
                (item) =>
                  item.type === 'function' && item.stateMutability === 'view'
              )
              .map((method, index) => {
                const contractMethod = method as AbiFunction & {
                  type: 'function'
                }

                if (contractMethod.inputs.length) {
                  return (
                    <ContractMethodForm
                      key={`${index}-${contractMethod}`}
                      method={contractMethod}
                      address={address}
                      abi={abi}
                    />
                  )
                }

                return (
                  <ContractProperty
                    key={`${index}-${contractMethod}`}
                    method={contractMethod}
                    address={address}
                    abi={abi}
                  />
                )
              })}
        </>
      )}
      {tab === 'writeContract' && (
        <>
          {!!abi &&
            (abi as Abi)
              .filter(
                (item) =>
                  item.type === 'function' &&
                  (item.stateMutability === 'nonpayable' ||
                    item.stateMutability === 'payable')
              )
              .map((method, index) => {
                const contractMethod = method as AbiFunction & {
                  type: 'function'
                }
                return (
                  <ContractMethodForm
                    key={`${index}-${contractMethod}`}
                    method={contractMethod}
                    address={address}
                    abi={abi}
                    isWrite
                  />
                )
              })}
        </>
      )}
    </>
  )
}

export default ContractViewContractTab
