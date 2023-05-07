import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import IconQuestion from '@/images/icons/question.svg'
import styles from './PageFooter.module.scss'

const PageFooter: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        <Link href="https://feedback.dex.guru/" className={styles.link}>
          Make a suggestion
        </Link>
        <Link
          href="https://docs.dex.guru/legal/terms-of-service"
          className={styles.link}
        >
          Terms of Use
        </Link>
        <Link href="https://feedback.dex.guru/" className={styles.link}>
          <IconQuestion />
        </Link>
        <Link
          href="https://dex.guru/"
          className={clsx(styles.link, styles.backlink)}
        >
          Back to Dex.guru
        </Link>
      </div>

      <div className={styles.info}>
        <div className={styles.copyright}>
          ©{new Date().getFullYear()} dex.guru
        </div>
        <div className={styles.version}>Version Beta 433bd13</div>
      </div>
    </div>
  )
}

export default PageFooter
