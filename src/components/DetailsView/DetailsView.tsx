import { FC } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Button from '../Button'
import { IconShare } from '../Icons'
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
  header,
  chainConfig,
}) => {
  const isOpenWith = !!type && !!address && !!chainConfig

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
        {!!tag && (
          <Label className={styles.tag} tooltip={tagTooltip}>
            {tag}
          </Label>
        )}
        {(!!header || isOpenWith || true) && (
          <div className={styles.tools}>
            <Share />
            {header}
            {isOpenWith && (
              <OpenWith
                type={type}
                chainConfig={chainConfig}
                address={address}
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

const Share: FC = () => {
  const router = useRouter()

  if (!navigator.canShare || !navigator?.canShare()) {
    return <>no share</>
  }

  const data = {
    title: document.querySelector('head title')?.innerHTML || undefined,
    text:
      document
        .querySelector('head meta[name="description"]')
        ?.getAttribute('content') || undefined,
    url:
      document
        .querySelector('head link[rel="canonical"]')
        ?.getAttribute('href') || router.asPath,
  }

  return (
    <Button
      icon={<IconShare />}
      onClick={async () => {
        try {
          await navigator.share(data)
        } catch (err) {
          //
        }
      }}
    />
  )
}

export default DetailsView
