import { FC, ReactNode } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Address from '../Address'
import Code from '../Code'
import Label from '../Label'
import Properties from '../Properties'
import Value from '../Value'
import TraceL2Events from './TraceL2Events'
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
      <Value
        className={clsx(styles.field, styles.address)}
        value={<Address address={data.from} type="account" isCopy />}
        prefix={<>From&nbsp;</>}
      />{' '}
      <Label type="tag">&rarr;</Label>{' '}
      <Value
        className={clsx(styles.field, styles.address)}
        value={<Address address={data.to} type="account" isCopy />}
        prefix={<>To&nbsp;</>}
      />{' '}
      {!!data.value && (
        <Value
          className={clsx(styles.field, styles.value)}
          value={displayValue}
          prefix={<>For:&nbsp;</>}
        />
      )}
    </div>
  )

  const displayAddress = (address: string | null): ReactNode => {
    if (!address) {
      return <span className={styles.muted}>–</span>
    }

    return <Address type="account" address={address} isShorten={false} isCopy />
  }

  const properties = [
    {
      title: 'Type',
      value: data.type,
    },
    {
      title: 'From',
      value: displayAddress(data.from),
    },
    {
      title: 'To',
      value: displayAddress(data.to),
    },
    {
      title: 'Value',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {data.value?.toString()}
        </Code>
      ),
    },
    {
      title: 'Gas',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {data.gas?.toString()}
        </Code>
      ),
    },
    {
      title: 'Gas Used',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {data.gasUsed?.toString()}
        </Code>
      ),
    },
    {
      title: 'Input',
      value: <Code>{data.input?.toString()}</Code>,
    },
  ]

  return (
    <details className={styles.container}>
      <summary className={styles.header}>
        <IconArrow className={styles.arrow} />
        {content}
      </summary>
      <div className={styles.body}>
        <Properties
          data={properties}
          className={clsx(styles.properties, {
            [styles.inner]: !!data.calls?.length,
          })}
        />

        <TraceL2Events
          title="Before EVM Transfers"
          events={data.beforeEVMTransfers}
        />

        <TraceL2Events
          title="After EVM Transfers"
          events={data.afterEVMTransfers}
        />

        {!!data.calls?.length && (
          <ul className={styles.list}>
            {data.calls.map((item, idx) => (
              <li key={idx} className={styles.item}>
                <Trace data={item} chainConfig={chainConfig} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}

export default Trace
