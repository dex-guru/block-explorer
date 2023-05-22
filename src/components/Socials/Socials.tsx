import { FC, lazy } from 'react'
import clsx from 'clsx'
import { SocialsProps } from './types'
import styles from './Socials.module.scss'

const Socials: FC<SocialsProps> = ({ className, socials }) => {
  return (
    <nav className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {socials.map((social, idx) => {
          const Icon = lazy(() => import(`../../images/${social.type}.svg`))

          return (
            <li key={idx} className={styles.item}>
              {<Icon />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Socials
