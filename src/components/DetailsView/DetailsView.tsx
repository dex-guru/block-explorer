import { FC } from 'react'
import clsx from 'clsx'
import { DetailsViewProps } from './types'
import Copy from '@/components/Copy'
import Heading from '@/components/Heading'
import Label from '@/components/Label'
import styles from './DetaisView.module.scss'

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  icon,
  tag,
  tagTooltip,
  className,
  children,
  header,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {!!icon && <div className={styles.icon}>{icon}</div>}
        <Heading caption={title} size="lg" className={styles.title} />
        {!!address && (
          <>
            <Heading caption={address} size="lg" className={styles.address} />
            <Copy text={address} />
          </>
        )}
        {!!tag && (
          <Label className={styles.tag} tooltip={tagTooltip}>
            {tag}
          </Label>
        )}
        {!!header && <div className={styles.tools}>{header}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default DetailsView
