import { FC } from 'react'
import PageFooter from './PageFooter'
import PageHeader from './PageHeader'
import { PageProps } from './types'
import styles from './Page.module.scss'

const Page: FC<PageProps> = ({
  withMenu,
  withSearch,
  children,
  chainConfig,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader
          withMenu={withMenu}
          withSearch={withSearch}
          chainConfig={chainConfig}
        />
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <PageFooter />
      </div>
    </div>
  )
}

export default Page
