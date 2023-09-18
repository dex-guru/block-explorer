import { ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'
import { TabsProps } from './types'
import Button from '@/components/Button'
import TooltipAnchor from '@/components/TooltipAnchor'
import styles from './Tabs.module.scss'

// <T,> because it is a cleaner alternative to <T extends unknown> (moreover, unknown isn't allowed by our rules, so I would have to disable ESlint for that line which isn't ok): https://devtrium.com/posts/react-typescript-using-generics-in-react
const Tabs = <T,>(props: TabsProps<T>): React.ReactElement => {
  const { tabs, disabled, onChange, className, value } = props
  const [currentValue, setCurrentValue] = useState(value as T)

  useEffect(() => {
    setCurrentValue(value as T)
  }, [value])

  const handleItemClick = (value: T, title: ReactNode): void => {
    if (value === currentValue) {
      return
    }

    setCurrentValue(value)
    onChange && onChange(value, title)
  }

  const renderTabs = () => {
    return tabs?.map((item, index) => {
      const isActive =
        item.isActive ||
        item.value === currentValue ||
        (item.value === ('' as unknown as T) && // tab with value '' shouldn't have url query param
          currentValue === undefined)

      const tooltip = !!item.tooltip ? (
        <>
          {' '}
          <TooltipAnchor tooltip={item.tooltip} />
        </>
      ) : null

      return (
        <Button
          type="button"
          key={index}
          className={clsx(
            item.className,
            {
              [styles.active]: isActive,
            },
            styles.tab
          )}
          to={item.to || undefined}
          caption={
            <>
              {item.title}
              {tooltip}
            </>
          }
          indicator={item.indicator}
          icon={item.icon}
          hidden={item.hidden}
          disabled={disabled || item.disabled}
          onClick={(e): void => {
            item.onClick && item.onClick()
            handleItemClick(item.value, item.title)
            const target = e.target as HTMLElement
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest',
              })
            }
          }}
        />
      )
    })
  }

  return <div className={clsx(styles.container, className)}>{renderTabs()}</div>
}

export default Tabs
