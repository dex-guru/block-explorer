import { FC } from 'react'

import clsx from 'clsx'

import Card from '@/components/Card'
import Heading from '@/components/Heading'

import { PropertiesProps } from './types'

import styles from './Properties.module.scss'

const Properties: FC<PropertiesProps> = (props) => {
  const renderItems = () => {
    return props.data.map((item, idx) => {
      return (
        <li className={styles.item} key={idx}>
          <div className={styles.entry}>
            <div className={styles.entryHeader}>
              <Heading
                caption={item.title}
                className={styles.entryTitle}
                size="xs"
                tooltip={item.tooltip}
              />
            </div>
            <div className={styles.entryBody}>
              {item.value || <span className={styles.notAccessible}>–</span>}
            </div>
          </div>
        </li>
      )
    })
  }

  return (
    <Card {...props} className={clsx(styles.container, props.className)}>
      <ul className={styles.list}>{renderItems()}</ul>
    </Card>
  )
}

export default Properties
