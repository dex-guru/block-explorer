import { FC, FocusEventHandler, useState } from 'react'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
import Button from '../Button'
import OutsideClicker from '../OutsideClicker'
import SearchVariants from './SearchVariants'
import { SearchProps, SearchResults } from './types'
import { useGenericSearch } from '@/hooks/useGenericSearch'
import IconQR from '@/images/icons/qr.svg'
import IconSearch from '@/images/icons/search.svg'
import { initializeApollo } from '@/lib/apollo/client'
import { GET_SEARCH } from '@/lib/apollo/queries'
import styles from './Search.module.scss'

const Search: FC<SearchProps> = ({ showFilter, query, withQR, className }) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)
  const apolloClient = initializeApollo({})

  const getIsShowResults = () => {
    return (
      !!results?.addresses?.length ||
      !!results?.blocks?.length ||
      !!results?.transactions?.length
    )
  }

  const getResults = async (value: string): Promise<SearchResults> => {
    const {
      data: { search },
    } = await apolloClient.query<{ search: SearchResults }>({
      query: GET_SEARCH,
      variables: { query: value },
    })

    return search
  }

  const onChange = useDebouncedCallback(async (value: string) => {
    setResults(null)
    setIsOpen(false)

    if (!value) {
      return
    }

    const search = await getResults(value)
    setResults(search)
    setIsOpen(getIsShowResults())
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

      {isOpen && getIsShowResults() && (
        <OutsideClicker onClick={handleHide} className={styles.dropdown}>
          <SearchVariants data={results} className={styles.results} />
        </OutsideClicker>
      )}
    </div>
  )
}

export default Search
