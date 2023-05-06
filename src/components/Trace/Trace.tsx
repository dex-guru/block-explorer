import { FC } from 'react'
import clsx from 'clsx'
import Address from '../Address'
import Code, { CodeFormat } from '../Code'
import Label from '../Label'
import Properties from '../Properties'
import { Property } from '../Properties/types'
import Value from '../Value'
import { TraceProps } from './types'
import IconArrow from '@/images/icons/arrow-down.svg'
import { hex2ascii } from '@/lib/utils'
import styles from './Trace.module.scss'

const Trace: FC<TraceProps> = ({ data }) => {
  const value = hex2ascii(data.value)

  const content = (
    <div className={styles.content}>
      <Label type="tag" className={styles.type}>
        {data.type}
      </Label>{' '}
      <span className={clsx(styles.field, styles.address)}>
        <Value
          value={<Address address={data.from} type="account" isCopy />}
          prefix={'From '}
        />
      </span>{' '}
      <Label type="tag">&rarr;</Label>{' '}
      <span className={clsx(styles.field, styles.address)}>
        <Value
          value={<Address address={data.to} type="account" isCopy />}
          prefix={'To '}
        />
      </span>{' '}
      {!!value && (
        <span className={clsx(styles.field, styles.value)}>
          for:
          <Value value={value} />
        </span>
      )}
    </div>
  )

  if (data.calls?.length) {
    const properties: Property[] = Object.entries(data)
      .filter(([key]) => key !== 'calls')
      .map(([key, value]) => {
        let defaultFormat: CodeFormat = 'ascii'
        let format = {}

        if (['gas', 'gasUsed', 'value'].includes(key)) {
          defaultFormat = 'hex'
          format = { hex: true, dec: true }
        }

        return {
          title: key,
          value: (
            <Code defaultFormat={defaultFormat} format={format}>
              {value.toString()}
            </Code>
          ),
        }
      })

    return (
      <details className={styles.container}>
        <summary className={styles.header}>
          <IconArrow className={styles.arrow} />
          {content}
        </summary>
        {data.calls?.length && (
          <div className={styles.body}>
            <Properties data={properties} className={styles.properties} />
            <ul className={styles.list}>
              {data.calls.map((item, idx) => (
                <li key={idx} className={styles.item}>
                  <Trace data={item} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </details>
    )
  }

  return content
}

export default Trace
