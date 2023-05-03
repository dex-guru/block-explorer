import {
  ChangeEventHandler,
  FormEventHandler,
  RefObject,
  useRef,
  useState,
} from 'react'
import { NextRouter, useRouter } from 'next/router'
import { isAddress } from '@ethersproject/address'
import { isHexString } from '@ethersproject/bytes'

const doSearch = async (q: string, router: NextRouter) => {
  // Cleanup
  q = q.trim()

  let maybeAddress = q
  let maybeIndex = ''
  const sepIndex = q.lastIndexOf(':')
  if (sepIndex !== -1) {
    maybeAddress = q.substring(0, sepIndex)
    maybeIndex = q.substring(sepIndex + 1)
  }

  // Plain address?
  if (isAddress(maybeAddress)) {
    router.replace(
      `/address/${maybeAddress}${
        maybeIndex !== '' ? `?nonce=${maybeIndex}` : ''
      }`
    )
    return
  }

  // Tx hash?
  if (isHexString(q, 32)) {
    router.replace(`/tx/${q}`)
    return
  }

  // Block number?
  const blockNumber = parseInt(q)
  if (!isNaN(blockNumber)) {
    router.replace(`/block/${blockNumber}`)
    return
  }
}

export type useGenericSearchProps = {
  query?: string
  onChange?: (val: string) => void
}

export const useGenericSearch = ({
  query,
  onChange,
}: useGenericSearchProps = {}): {
  ref: RefObject<HTMLInputElement>
  handleChange: ChangeEventHandler<HTMLInputElement>
  handleSubmit: FormEventHandler<HTMLFormElement>
  canSubmit: boolean
  searchString: string
} => {
  const [searchString, setSearchString] = useState<string>(query || '')
  const [canSubmit, setCanSubmit] = useState<boolean>(searchString.length > 0)
  const router = useRouter()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const searchTerm = e.target.value.trim()
    setCanSubmit(searchTerm.length > 0)
    setSearchString(searchTerm)
    onChange && onChange(searchTerm)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!canSubmit) {
      return
    }

    if (searchRef.current) {
      searchRef.current.value = ''
    }
    doSearch(searchString, router)
  }

  const searchRef = useRef<HTMLInputElement>(null)

  return { ref: searchRef, handleChange, handleSubmit, canSubmit, searchString }
}
