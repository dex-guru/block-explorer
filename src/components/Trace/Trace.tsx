import { FC, ReactNode } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { title } from 'process'
import TraceL2Events from './TraceL2Events'
import { TraceProps } from './types'
import Address from '@/components/Address'
import Code from '@/components/Code'
import { IconArrowDown } from '@/components/Icons'
import Label from '@/components/Label'
import Message from '@/components/Message'
import Properties from '@/components/Properties'
import Value from '@/components/Value'
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

  const {
    type,
    error,
    from,
    to,
    value,
    gas,
    gasUsed,
    input,
    beforeEVMTransfers,
    afterEVMTransfers,
    output,
    calls,
    ...rest
  } = data

  const properties = [
    {
      title: 'Type',
      value: type,
    },
    ...(error
      ? [
          {
            title: 'Error',
            value: (
              <Message text={error} type="danger" className={styles.message} />
            ),
          },
        ]
      : []),
    {
      title: 'From',
      value: displayAddress(from),
    },
    {
      title: 'To',
      value: displayAddress(to),
    },
    {
      title: 'Value',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {value?.toString()}
        </Code>
      ),
    },
    {
      title: 'Gas',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {gas?.toString()}
        </Code>
      ),
    },
    {
      title: 'Gas Used',
      value: (
        <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
          {gasUsed?.toString()}
        </Code>
      ),
    },
    {
      title: 'Input',
      value: <Code>{input?.toString()}</Code>,
    },
    ...(output
      ? [
          {
            title: 'Output',
            value: (
              <Code defaultFormat="hex" format={{ hex: true, dec: true }}>
                {output?.toString()}
              </Code>
            ),
          },
        ]
      : []),
    ...Object.entries(rest).map(([key, value]) => {
      return { title: key, value: value.toString() }
    }),
  ]

  return (
    <details className={styles.container}>
      <summary className={styles.header}>
        <IconArrowDown className={styles.arrow} />
        {content}
      </summary>
      <div className={styles.body}>
        <Properties
          data={properties}
          className={clsx(styles.properties, {
            [styles.inner]: !!calls?.length,
          })}
        />

        <TraceL2Events
          title="Before EVM Transfers"
          events={beforeEVMTransfers}
        />

        <TraceL2Events title="After EVM Transfers" events={afterEVMTransfers} />

        {!!calls?.length && (
          <ul className={styles.list}>
            {calls.map((item, idx) => (
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
