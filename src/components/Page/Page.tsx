import { FC } from 'react'
import PageHeader from './PageHeader'
import { PageProps } from './types'
import styles from './Page.module.scss'

const Page: FC<PageProps> = ({ withMenu, withSearch, children }) => {
  return (
    <div className={styles.container}>
      {(withMenu || withSearch) && (
        <div className={styles.header}>
          <PageHeader withMenu={withMenu} withSearch={withSearch} />
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default Page
