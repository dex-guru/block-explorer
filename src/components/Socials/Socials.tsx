import { FC, Suspense, lazy } from 'react'
import clsx from 'clsx'
import { SocialsProps } from './types'
import styles from './Socials.module.scss'

const Socials: FC<SocialsProps> = ({ className, socials }) => {
  return (
    <nav className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {socials.map((social, idx) => {
          const Icon = lazy(() =>
            import(`../../images/socials/${social.type}.svg`).catch(() => ({
              default: () => social.type,
            }))
          )

          return (
            <li key={idx} className={styles.item}>
              <a
                href={social.url}
                rel="noreferrer noopener"
                className={styles.link}
              >
                <Suspense>
                  <Icon className={clsx(styles.icon, styles[social.type])} />
                </Suspense>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Socials
