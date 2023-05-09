import { FC } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Address from '../Address'
import Code, { CodeFormat } from '../Code'
import Label from '../Label'
import Properties from '../Properties'
import { Property } from '../Properties/types'
import Value from '../Value'
import { TraceProps } from './types'
import IconArrow from '@/images/icons/arrow-down.svg'
import { getNormalizedValue } from '@/lib/utils'
import styles from './Trace.module.scss'

const Trace: FC<TraceProps> = ({ data, chainConfig }) => {
  const decValue = new BigNumber(data.value, 16).toString(10)
  const displayValue = getNormalizedValue(
    decValue,
    chainConfig?.nativeCurrency?.decimals
  )

  const content = (
    <div className={styles.content}>
      <Label type="tag" className={styles.type}>
        {data.type}
      </Label>{' '}
      <span className={clsx(styles.field, styles.address)}>
        <Value
          value={<Address address={data.from} type="account" isCopy />}
          prefix={<>From&nbsp;</>}
        />
      </span>{' '}
      <Label type="tag" className={styles.direction}>
        &rarr;
      </Label>{' '}
      <span className={clsx(styles.field, styles.address)}>
        <Value
          value={<Address address={data.to} type="account" isCopy />}
          prefix={<>To&nbsp;</>}
        />
      </span>{' '}
      {!!data.value && (
        <span className={clsx(styles.field, styles.value)}>
          <Value value={displayValue} prefix={<>For&nbsp;</>} />
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
                  <Trace data={item} chainConfig={chainConfig} />
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
