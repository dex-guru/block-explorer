import { FC, FocusEventHandler, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
import SearchVariants from './SearchVariants'
import { SearchProps, SearchResults } from './types'
import Button from '@/components/Button'
import { IconSearch } from '@/components/Icons'
import OutsideClicker from '@/components/OutsideClicker'
import { useGenericSearch } from '@/hooks/useGenericSearch'
import { GET_SEARCH } from '@/lib/apollo/queries'
import styles from './Search.module.scss'

const Search: FC<SearchProps> = ({ showFilter, query, className }) => {
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

  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    setIsFocus(false)
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
      <form className={styles.body} onSubmit={handleSubmit}>
        <label className={styles.combo}>
          <input
            ref={ref}
            className={clsx(styles.query, { [styles.queryLoading]: loading })}
            type="text"
            placeholder="Search by address / TX Hash / Block number"
            defaultValue={query}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
          />
          <div className={styles.actions}>
            <Button
              disabled={!canSubmit}
              icon={
                !loading ? <IconSearch className={styles.icon} /> : undefined
              }
              className={clsx(styles.action, {
                [styles.actionLoading]: loading,
              })}
              type="submit"
            />
          </div>
        </label>
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
