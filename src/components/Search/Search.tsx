import { FC, FocusEventHandler, useState } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { SearchProps } from './types'
import IconQR from '@/images/icons/qr.svg'
import IconSearch from '@/images/icons/search.svg'
import styles from './Search.module.scss'

const Search: FC<SearchProps> = ({ showFilter, query, withQR, className }) => {
  const [isFocus, setIsFocus] = useState(false)

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocus(false)
    e.target.value = query || ''
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
    setIsFocus(true)
  }

  return (
    <div
      className={clsx(styles.container, { [styles.focus]: isFocus }, className)}
    >
      {!!showFilter && <div className={styles.filter}></div>}
      <div className={styles.combo}>
        <input
          className={styles.query}
          type="text"
          placeholder="Search by address / Txn Hash / Block number"
          defaultValue={query}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <div className={styles.actions}>
          {withQR && <Button icon={<IconQR />} className={styles.action} />}
          <Button icon={<IconSearch />} className={styles.action} />
        </div>
      </div>
    </div>
  )
}

export default Search
