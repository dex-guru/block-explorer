import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Button from './Button'

export interface Tab<T> {
  title: string
  value: T
  icon?: ReactNode
  indicator?: ReactNode
  disabled?: boolean
  hidden?: boolean
  className?: string
  onClick?: () => void
  tooltip?: string
}

export interface TabsProps<T> {
  tabs: Tab<T>[]
  value?: T
  onChange?: (value: T, title?: string) => void
  disabled?: boolean
  className?: string
}

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

  return (
    <div className={clsx('tabs', className || '')}>
      {tabs.map((item, index) => {
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
              className={clsx('tabs__tab', {
                active:
                  (Array.isArray(item.value) &&
                    item.value.includes(currentValue)) ||
                  item.value === currentValue ||
                  (item.value === ('' as unknown as T) && // tab with value '' shouldn't have url query param
                    currentValue === undefined),
                [`${item.className}`]: !!item.className,
              })}
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
      })}
    </div>
  )
}

export default Tabs
