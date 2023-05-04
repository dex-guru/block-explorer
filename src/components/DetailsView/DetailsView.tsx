import { FC } from 'react'
import clsx from 'clsx'
import Copy from '../Copy'
import Heading from '../Heading'
import Label from '../Label'
import { DetailsViewProps } from './types'
import styles from './DetaisView.module.scss'

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  icon,
  tag,
  className,
  children,
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
        <div className={styles.tools}></div>
        {!!tag && <Label className={styles.tag}>{tag}</Label>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default DetailsView
