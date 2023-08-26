import { FC, Suspense, lazy } from 'react'
import clsx from 'clsx'
import Dropdown from '../Dropdown'
import { NetworkSelectProps } from './types'
import Button from '@/components/Button'
import { IconQuestion } from '@/components/Icons'
import styles from './NetworkSelect.module.scss'

const NetworkSelect: FC<NetworkSelectProps> = ({
  current,
  className,
  variants,
}) => {
  if (!variants.length) {
    return null
  }
  const renderContent = () => (
    <ul className={styles.list}>
      {variants.map((variant, idx) => {
        const Icon = lazy(() =>
          import(`@/images/explorers/${variant.standard}.svg`).catch(() => ({
            default: () => <IconQuestion className={styles.icon} />,
          }))
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
  )

  return (
    <Dropdown
      caption={current}
      className={clsx(styles.container, className)}
      contentClassName={styles.dropdown}
      isRight
      content={renderContent()}
    />
  )
}

export default NetworkSelect
