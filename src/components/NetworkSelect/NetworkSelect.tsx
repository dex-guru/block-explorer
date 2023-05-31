import { FC, Suspense, lazy, useState } from 'react'
import clsx from 'clsx'
import { NetworkSelectProps } from './types'
import { Button, IconDown, IconQuestion, OutsideClicker } from '@/components'
import styles from './NetworkSelect.module.scss'

const NetworkSelect: FC<NetworkSelectProps> = ({
  current,
  className,
  variants,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!variants.length) {
    return null
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <OutsideClicker
      className={clsx(styles.container, className)}
      onClick={handleClose}
    >
      <div
        className={clsx(styles.body, { [styles.open]: isOpen })}
        onClick={handleClick}
      >
        <span className={styles.caption}>{current}</span>
        <IconDown
          className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
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
        </div>
      )}
    </OutsideClicker>
  )
}

export default NetworkSelect
