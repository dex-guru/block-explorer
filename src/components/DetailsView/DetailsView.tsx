import { FC } from 'react'
import { IconVerify } from '..'
import clsx from 'clsx'
import Copy from '../Copy'
import Heading from '../Heading'
import Label from '../Label'
import OpenWith from '../OpenWith'
import { DetailsViewProps } from './types'
import styles from './DetaisView.module.scss'

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  icon,
  tag,
  className,
  children,
  type,
  chainConfig,
  titleIndicator,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {!!icon && <div className={styles.icon}>{icon}</div>}
        <Heading caption={title} size="lg" className={styles.title} />
        {!!address && (
          <>
            <Heading
              caption={address}
              size="lg"
              className={styles.address}
              indicator={titleIndicator}
            />
            <Copy text={address} />
          </>
        )}
        <div className={styles.tools}></div>
        {!!tag && <Label className={styles.tag}>{tag}</Label>}
        {!!type && !!address && !!chainConfig && (
          <OpenWith type={type} chainConfig={chainConfig} address={address} />
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default DetailsView
