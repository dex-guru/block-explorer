import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Button from '../Button'
import { TabsProps } from './types'
import styles from './Tabs.module.scss'

// <T,> because it is a cleaner alternative to <T extends unknown> (moreover, unknown isn't allowed by our rules, so I would have to disable ESlint for that line which isn't ok): https://devtrium.com/posts/react-typescript-using-generics-in-react
const Tabs = <T,>(props: TabsProps<T>): React.ReactElement => {
  const router = useRouter()

  const { tabs, disabled, onChange, className, value } = props
  const [currentValue, setCurrentValue] = useState(value as T)

  useEffect(() => {
    setCurrentValue(value as T)
  }, [value])

  const handleItemClick = (value: T, title: string): void => {
    if (value === currentValue) {
      return
    }

    setCurrentValue(value)
    onChange && onChange(value, title)
  }
  const pathname = router.asPath.split('?')[0]
  const renderTabs = () => {
    return tabs.map((item, index) => {
      const isActive =
        (Array.isArray(item.value) && item.value.includes(currentValue)) ||
        item.value === currentValue ||
        (item.value === ('' as unknown as T) && // tab with value '' shouldn't have url query param
          currentValue === undefined)
      return (
        <Link
          key={index}
          href={`${pathname}${
            item.value &&
            `?tab=${
              Array.isArray(item.value) ? item.value[0] : item.value // Array type is used here for nested tabs routing
            }`
          }`}
        >
          <Button
            className={clsx(
              styles.tab,
              {
                [styles.active]: isActive,
              },
              item.className
            )}
            caption={item.title}
            indicator={item.indicator}
            icon={item.icon}
            hidden={item.hidden}
            disabled={disabled || item.disabled}
            onClick={(): void => {
              item.onClick && item.onClick()
              handleItemClick(item.value, item.title)
            }}
          />
        </Link>
      )
    })
  }

  return <div className={clsx(styles.container, className)}>{renderTabs()}</div>
}

export default Tabs
