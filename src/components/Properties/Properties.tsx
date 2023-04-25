import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '../Heading'
import { PropertiesProps } from './types'
import styles from './Properties.module.scss'

const Properties: FC<PropertiesProps> = ({ data, className, isCardChild }) => {
  return (
    <div
      className={clsx(
        styles.container,
        { [styles.cardChild]: isCardChild },
        className
      )}
    >
      <ul className={styles.list}>
        {data.map((item, idx) => {
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
                <div className={styles.entryBody}>{item.value || '–'}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Properties
