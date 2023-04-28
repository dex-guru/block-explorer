import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { DEFAULT_PER_PAGE } from '../Pagination/Pagination'
import { useIsMount } from '@/hooks'
import styles from './PerPageSelector.module.scss'

interface IPerPageSelectorProps {
  defaultPerPage?: number
  className?: string
  onChange: (variable: number) => void
}

export const PerPageSelector: FC<IPerPageSelectorProps> = ({
  defaultPerPage = DEFAULT_PER_PAGE,
  onChange,
  className,
}) => {
  const [currentPerPage, setCurrentPerPage] = useState(defaultPerPage)
  const isMounted = useIsMount()

  const onPerPageChangeHandler = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCurrentPerPage(Number(e.target.value))
      onChange(Number(e.target.value))
    },
    [onChange]
  )

  useEffect(() => {
    if (isMounted) {
      setCurrentPerPage(defaultPerPage)
    }
  }, [defaultPerPage, isMounted])

  return (
    <div className={styles.container}>
      <span className={styles.label}>Show rows</span>
      <select
        onChange={onPerPageChangeHandler}
        className={clsx(styles.selector, className)}
      >
        <option value="5" selected={5 === currentPerPage}>
          5
        </option>
        <option value="10" selected={10 === currentPerPage}>
          10
        </option>
        <option value="25" selected={25 === currentPerPage}>
          25
        </option>
        <option value="50" selected={50 === currentPerPage}>
          50
        </option>
        <option value="100" selected={100 === currentPerPage}>
          100
        </option>
      </select>
    </div>
  )
}
