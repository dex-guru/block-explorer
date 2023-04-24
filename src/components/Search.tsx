import { FC, FocusEventHandler, useState } from 'react'
import Button from './Button'
import classNames from 'classnames'

import IconQR from '@/images/icons/qr.svg'
import IconSearch from '@/images/icons/search.svg'

const Search: FC<{
  showFilter?: boolean
  query?: string
  className?: string
}> = ({ showFilter, query, className }) => {
  const [isFocus, setIsFocus] = useState(false)

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocus(false)
    e.target.value = query || ''
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocus(true)
  }

  return (
    <div
      className={classNames(
        'app-search',
        { 'app-search--focus': isFocus },
        className
      )}
    >
      {!!showFilter && <div className="app-search__filter"></div>}
      <div className="app-search__combo">
        <input
          className="app-search__query"
          type="text"
          placeholder="Search by address / Txn Hash / Block number"
          defaultValue={query}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <div className="app-search__actions">
          <Button icon={<IconQR />} className="app-search__action" />
          <Button icon={<IconSearch />} className="app-search__action" />
        </div>
      </div>
    </div>
  )
}

export default Search
