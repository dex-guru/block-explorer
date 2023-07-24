import { FC } from 'react'
import clsx from 'clsx'
import { DetailsViewProps } from './types'
import Copy from '@/components/Copy'
import Heading from '@/components/Heading'
import Label from '@/components/Label'
import OpenWith from '@/components/OpenWith'
import IconVerify from '@/images/icons/verified.svg'
import styles from './DetaisView.module.scss'

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  isVerified,
  icon,
  tag,
  tagTooltip,
  className,
  children,
  type,
  chainConfig,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {!!icon && <div className={styles.icon}>{icon}</div>}
        <Heading caption={title} size="lg" className={styles.title} />
        {!!address && (
          <>
            <Heading caption={address} size="lg" className={styles.address} />
            {!!isVerified && <IconVerify className={styles.verified} />}
            <Copy text={address} />
          </>
        )}
        {!address && !!isVerified && <IconVerify className={styles.verified} />}
        <div className={styles.tools}></div>
        {!!tag && (
          <Label className={styles.tag} tooltip={tagTooltip}>
            {tag}
          </Label>
        )}
        {!!type && !!address && !!chainConfig && (
          <OpenWith type={type} chainConfig={chainConfig} address={address} />
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default DetailsView
