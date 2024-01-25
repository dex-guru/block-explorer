import { FC } from 'react'

import clsx from 'clsx'

import Copy from '@/components/Copy'
import Heading from '@/components/Heading'
import Label from '@/components/Label'

import { DetailsViewProps } from './types'

import styles from './DetaisView.module.scss'

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  icon,
  tags,
  className,
  children,
  header,
  ens,
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
        {tags
          ?.filter((tag) => !!tag)
          .map((tag, idx) => {
            return (
              <Label key={idx} className={styles.tag}>
                {tag}
              </Label>
            )
          })}
        {!!ens && <Label className={styles.tag}>{ens}</Label>}
        {!!header && <div className={styles.tools}>{header}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default DetailsView
