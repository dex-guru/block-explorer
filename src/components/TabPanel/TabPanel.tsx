import { ReactElement } from 'react'
import clsx from 'clsx'
import Tabs from '../Tabs'
import { TabPanelProps } from './types'
import styles from './TabPanel.module.scss'

const TabPanel = <T,>(props: TabPanelProps<T>): ReactElement => {
  return (
    <div className={clsx(styles.container, props.className)}>
      <div className={styles.header}>
        <Tabs {...props} className={styles.tabs} />
      </div>
      <div className={styles.body}>{props.children}</div>
    </div>
  )
}

export default TabPanel
