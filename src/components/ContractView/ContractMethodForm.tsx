import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { readContract, writeContract, prepareWriteContract } from '@wagmi/core'
import { Abi, AbiFunction } from 'abitype'
import { useAccount, useChainId } from 'wagmi'
import { getValidator } from './validators'
import Button from '@/components/Button'
import Details from '@/components/Details'
import Heading from '@/components/Heading'
import Loading from '@/components/Loading'
import Message from '@/components/Message'
import styles from './ContractView.module.scss'

export interface IFormProps {
  method: AbiFunction & { type: 'function' }
  abi: Abi
  address: string
  isWrite?: boolean
}

const ContractMethodForm: FC<IFormProps> = ({
  method,
  address,
  abi,
  isWrite,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { address: account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const chainId = useChainId()

  const [callResult, setCallResult] = useState<string | undefined>(undefined)

  const onRead = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()
      setCallResult(undefined)
      setIsLoading(true)
      const methodArgs = Object.values(args)
      try {
        const data = await readContract({
          address: address as `0x${string}`,
          abi,
          functionName: method.name,
          args: methodArgs,
          chainId: chainId,
        })
        const result = `${data}`

        setCallResult(result)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
      }
    },
    [abi, address, method.name, chainId]
  )

  const onWrite = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()
      setCallResult(undefined)
      setIsLoading(true)

      let value = '0'
      const methodArgs = Object.values(args)
      if (method.stateMutability === 'payable' && methodArgs.length > 0) {
        value = methodArgs.pop() as string // methodArgs isn't empty so it will be never undefined
      }
      try {
        const config = await prepareWriteContract({
          address: address as `0x${string}`,
          abi,
          functionName: method.name,
          args: methodArgs,
          chainId: chainId,
          account,
          value: BigInt(value),
        })
        const data = await writeContract<Abi, string>(config)

        const result = `${data}`

        setCallResult(result.toString())
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
      }
    },
    [abi, account, address, method.name, method.stateMutability, chainId]
  )

  return (
    <Details title={method.name}>
      <form
        key={method.name}
        onSubmit={handleSubmit(isWrite ? onWrite : onRead)}
        className={styles.form}
      >
        <>
          {method.inputs?.map((input, index: number) => {
            const name = `input-${index}-${input.name}`
            const errorMessage = errors[name]?.message as string
            const validator = getValidator(input.type)

            return (
              <label key={index} className={styles.field}>
                <Heading
                  caption={input.name}
                  size="xs"
                  className={styles.label}
                />
                <input
                  {...register(name, {
                    required: true,
                    validate: validator,
                  })}
                  className={styles.input}
                  placeholder={`${input.name} (${
                    input.internalType || input.type
                  })`}
                />
                {errorMessage && <span>{errorMessage}</span>}
              </label>
            )
          })}
          {method.stateMutability === 'payable' && (
            <label className={styles.field}>
              <Heading
                caption="native token amount (payable)"
                size="xs"
                className={styles.label}
              />
              <input
                {...register('payable')}
                className={styles.input}
                placeholder="payable"
              />
              {errors.payable && (
                <span>{errors.payable.message?.toString()}</span>
              )}
            </label>
          )}
          <div className={styles.proceed}>
            <Button
              type="submit"
              caption={isWrite ? 'Write' : 'Query'}
              className={styles.submit}
              disabled={!account || isLoading}
            />
            {isLoading && <Loading className={styles.loader} />}
            {!!callResult && <Message text={callResult} />}
          </div>
        </>
      </form>
    </Details>
  )
}

export default ContractMethodForm
