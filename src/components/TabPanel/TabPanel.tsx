import { ReactElement } from 'react'

import clsx from 'clsx'

import Tabs from '@/components/Tabs'

import { TabPanelProps } from './types'

import styles from './TabPanel.module.scss'

const TabPanel = <T,>(props: TabPanelProps<T>): ReactElement => {
  const content = props.tabs.find((el) => el.value === props.value)?.content

  return (
    <div className={clsx(styles.container, props.className)}>
      {props.tabs.length > 1 && (
        <div className={styles.header}>
          <Tabs {...props} className={clsx(styles.tabs, props.tabsClassName)} />
        </div>
      )}
      <div className={styles.body}>
        {content}
        {props.children}
      </div>
    </div>
  )
}

export default TabPanel
