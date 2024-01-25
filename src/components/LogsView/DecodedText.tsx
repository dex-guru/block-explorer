import { FC } from 'react'

import { LogModel } from '@/__generated__/resolvers-types'

import styles from './LogsView.module.scss'

interface IDecodedTextProps {
  data: LogModel
}

export const DecodedText: FC<IDecodedTextProps> = ({ data }) => {
  const { eventName, decodedInput } = data

  if (!eventName || !decodedInput) {
    return null
  }

  const args = decodedInput.map((el, idx) => (
    <span className={styles.arg} key={idx}>
      <span className={styles.type}>{el.type}</span>{' '}
      {el.isIndexed && <span className={styles.indexed}>indexed</span>}{' '}
      <span className={styles.name}>{el.name}</span>
      {idx < decodedInput.length - 1 && ', '}
    </span>
  ))

  return (
    <div className={styles.code}>
      <span className={styles.method}>{eventName}</span>
      <span className={styles.args}>({args})</span>
    </div>
  )
}
