import { FC } from 'react'
import clsx from 'clsx'
import { SocialsProps } from './types'
import IconDiscord from '@/images/socials/discord.svg'
import IconTelegram from '@/images/socials/telegram.svg'
import IconTwitter from '@/images/socials/twitter.svg'
import styles from './Socials.module.scss'

const Socials: FC<SocialsProps> = ({ className }) => {
  return (
    <nav className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <a
            href="https://twitter.com/dexguru"
            rel="noreferrer noopener"
            className={styles.link}
          >
            <IconTwitter className={styles.icon} />
          </a>
        </li>
        <li className={styles.item}>
          <a
            href="https://t.me/dexguru"
            rel="noreferrer noopener"
            className={styles.link}
          >
            <IconTelegram className={styles.icon} />
          </a>
        </li>
        <li className={styles.item}>
          <a
            href="https://discord.gg/dPW8fzwzz9"
            rel="noreferrer noopener"
            className={styles.link}
          >
            <IconDiscord className={styles.icon} />
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Socials
