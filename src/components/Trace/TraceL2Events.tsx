import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Address from '../Address'
import Code from '../Code'
import Label from '../Label'
import Properties from '../Properties'
import { TraceL2EventsProps } from './types'
import IconArrow from '@/images/icons/arrow-down.svg'
import styles from './Trace.module.scss'

const TraceL2Events: FC<TraceL2EventsProps> = ({ title, events }) => {
  if (!events?.length) {
    return null
  }

  const displayAddress = (address: string | null): ReactNode => {
    if (!address) {
      return <span className={styles.muted}>–</span>
    }

    return <Address type="account" address={address} isShorten={false} isCopy />
  }

  return (
    <details className={clsx(styles.container, styles.events)}>
      <summary className={styles.header}>
        <IconArrow className={styles.arrow} />
        <Label type="tag" className={styles.info}>
          {title}
        </Label>
      </summary>
      <div className={styles.body}>
        <ul className={styles.eventsList}>
          {events.map((event, idx) => {
            return (
              <li key={idx} className={styles.eventsItem}>
                <Properties
                  data={[
                    {
                      title: 'Purpose',
                      value: <Code>{event.purpose?.toString()}</Code>,
                    },
                    {
                      title: 'From',
                      value: displayAddress(event.from),
                    },
                    {
                      title: 'To',
                      value: displayAddress(event.to),
                    },
                    {
                      title: 'Value',
                      value: (
                        <Code
                          defaultFormat="hex"
                          format={{ dec: true, hex: true }}
                        >
                          {event.value?.toString()}
                        </Code>
                      ),
                    },
                  ]}
                  className={styles.eventProperties}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </details>
  )
}

export default TraceL2Events
