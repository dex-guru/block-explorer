import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import TooltipAnchor from '../TooltipAnchor'
import { TabsProps } from './types'
import styles from './Tabs.module.scss'

// <T,> because it is a cleaner alternative to <T extends unknown> (moreover, unknown isn't allowed by our rules, so I would have to disable ESlint for that line which isn't ok): https://devtrium.com/posts/react-typescript-using-generics-in-react
const Tabs = <T,>(props: TabsProps<T>): React.ReactElement => {
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

  const renderTabs = () => {
    return tabs.map((item, index) => {
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
          key={index}
          className={clsx(
            item.className,
            {
              [styles.active]: isActive,
            },
            styles.tab
          )}
          to={item.to}
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
          onClick={(): void => {
            item.onClick && item.onClick()
            handleItemClick(item.value, item.title)
          }}
        />
      )
    })
  }

  return <div className={clsx(styles.container, className)}>{renderTabs()}</div>
}

export default Tabs
