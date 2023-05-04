import { FC, FocusEventHandler, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
import Button from '../Button'
import OutsideClicker from '../OutsideClicker'
import SearchVariants from './SearchVariants'
import { SearchProps, SearchResults } from './types'
import { useGenericSearch } from '@/hooks/useGenericSearch'
import IconQR from '@/images/icons/qr.svg'
import IconSearch from '@/images/icons/search.svg'
import { GET_SEARCH } from '@/lib/apollo/queries'
import styles from './Search.module.scss'

const Search: FC<SearchProps> = ({ showFilter, query, withQR, className }) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [getSearch, { data, loading }] = useLazyQuery<{
    search: SearchResults
  }>(GET_SEARCH)

  const onChange = useDebouncedCallback(async (value: string) => {
    setIsOpen(false)

    if (!value) {
      return
    }

    getSearch({ variables: { query: value } })
  }, 500)

  useEffect(() => {
    const allowOpen =
      !!data?.search?.addresses?.length ||
      !!data?.search?.blocks?.length ||
      !!data?.search?.transactions?.length

    setIsOpen(allowOpen)
  }, [data])

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
          className={clsx(styles.query, { [styles.loading]: loading })}
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

      {isOpen && (
        <OutsideClicker onClick={handleHide} className={styles.dropdown}>
          <SearchVariants data={data?.search} className={styles.results} />
        </OutsideClicker>
      )}
    </div>
  )
}

export default Search
