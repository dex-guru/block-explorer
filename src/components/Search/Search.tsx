import { FC, FocusEventHandler, useState } from 'react'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
import Button from '../Button'
import OutsideClicker from '../OutsideClicker'
import SearchVariants from './SearchVariants'
import { SearchProps, SearchResults } from './types'
import { TransactionModel } from '@/__generated__/resolvers-types'
import { useGenericSearch } from '@/hooks/useGenericSearch'
import IconQR from '@/images/icons/qr.svg'
import IconSearch from '@/images/icons/search.svg'
import { initializeApollo } from '@/lib/apollo/client'
import { GET_SEARCH, GET_TRANSACTIONS } from '@/lib/apollo/queries'
import styles from './Search.module.scss'

const Search: FC<SearchProps> = ({ showFilter, query, withQR, className }) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)
  const apolloClient = initializeApollo({})

  const getResults = async (value: string): Promise<SearchResults> => {
    const {
      data: { search },
    } = await apolloClient.query<{ search: SearchResults }>({
      query: GET_SEARCH,
      variables: { query: value },
    })

    return search
  }

  const getTxs = async (vars: {
    block?: number
    address?: string
  }): Promise<TransactionModel[]> => {
    if (!vars.block && !vars.address) {
      return []
    }

    const {
      data: { transactions },
    } = await apolloClient.query({
      query: GET_TRANSACTIONS,
      variables: {
        first: 10,
        skip: 0,
        blockNumber: vars.block,
        address: vars.address,
      },
    })

    return transactions
  }

  const onChange = useDebouncedCallback(async (value: string) => {
    setResults(null)
    setIsOpen(false)

    if (!value) {
      return
    }

    const search = await getResults(value)
    setResults(search)
    setIsOpen(!!search?.query)

    const addresses = search?.addresses
    const address = addresses && addresses[0] ? addresses[0].address : undefined

    const blocks = search?.blocks
    const block = blocks && blocks[0] ? blocks[0].number : undefined

    const transactions = await getTxs({ block, address })
    setResults({ ...search, transactions: transactions })
  }, 1500)

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocus(false)
    e.target.value = query || ''
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
    setIsFocus(true)
  }

  const handleHide = () => {
    setIsOpen(false)
  }

  const { ref, handleChange, handleSubmit, canSubmit } = useGenericSearch({
    query,
    onChange,
  })

  const isShowResults =
    !!results?.addresses?.length && !!results?.blocks?.length

  return (
    <div
      className={clsx(styles.container, { [styles.focus]: isFocus }, className)}
    >
      {!!showFilter && <div className={styles.filter}></div>}
      <form className={styles.combo} onSubmit={handleSubmit}>
        <input
          ref={ref}
          className={styles.query}
          type="text"
          placeholder="Search by address / Txn Hash / Block number"
          defaultValue={query}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
        />
        <div className={styles.actions}>
          {withQR && <Button icon={<IconQR />} className={styles.action} />}
          <Button
            disabled={!canSubmit}
            icon={<IconSearch />}
            className={styles.action}
            type="submit"
          />
        </div>
      </form>

      {isOpen && isShowResults && (
        <OutsideClicker onClick={handleHide} className={styles.dropdown}>
          <SearchVariants data={results} className={styles.results} />
        </OutsideClicker>
      )}
    </div>
  )
}

export default Search
