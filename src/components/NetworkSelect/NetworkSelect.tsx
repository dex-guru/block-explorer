import { FC, Suspense, lazy, useState } from 'react'
import { createPortal } from 'react-dom'
import { useResizeDetector } from 'react-resize-detector'
import clsx from 'clsx'
import { NetworkSelectProps } from './types'
import Button from '@/components/Button'
import { IconArrowDown, IconQuestion } from '@/components/Icons'
import OutsideClicker from '@/components/OutsideClicker'
import { getRootElement } from '@/lib/utils'
import styles from './NetworkSelect.module.scss'

const NetworkSelect: FC<NetworkSelectProps> = ({
  current,
  className,
  variants,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { height, ref } = useResizeDetector()

  if (!variants.length) {
    return null
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = (e: Event) => {
    if (!isOpen || ref?.current?.contains(e.target as Node)) {
      return
    }

    setIsOpen(false)
  }

  const rect = ref.current?.getBoundingClientRect()
  const dropdownCoord = rect
    ? { left: rect?.left, top: rect?.top + height }
    : undefined

  const renderDropdown = () =>
    createPortal(
      <OutsideClicker
        className={styles.dropdown}
        onClick={handleClose}
        style={{ left: dropdownCoord?.left, top: dropdownCoord?.top }}
      >
        <ul className={styles.list}>
          {variants.map((variant, idx) => {
            const Icon = lazy(() =>
              import(`@/images/explorers/${variant.standard}.svg`).catch(
                () => ({
                  default: () => <IconQuestion className={styles.icon} />,
                })
              )
            )

            const suspensedIcon = (
              <Suspense fallback={<span className={styles.icon} />}>
                <Icon className={styles.icon} />
              </Suspense>
            )

            return (
              <li key={idx} className={styles.item}>
                <Button
                  icon={suspensedIcon}
                  caption={variant.name}
                  to={variant.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </li>
            )
          })}
        </ul>
      </OutsideClicker>,
      getRootElement()
    )

  return (
    <div className={clsx(styles.container, className)} ref={ref}>
      <div
        className={clsx(styles.body, { [styles.open]: isOpen })}
        onClick={handleClick}
      >
        <span className={styles.caption}>{current}</span>
        <IconArrowDown
          className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
        />
      </div>

      {isOpen && <>{renderDropdown()}</>}
    </div>
  )
}

export default NetworkSelect
