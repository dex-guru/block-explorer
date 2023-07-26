import { FC } from 'react'
import Code from '@/components/Code'
import styles from './Topics.module.scss'

interface ITopicsProps {
  topics: string[]
}

export const Topics: FC<ITopicsProps> = ({ topics }) => {
  if (!topics.length) {
    return null
  }

  return (
    <div className={styles.container}>
      <ol start={0} className={styles.list}>
        {topics.map((topic, tIdx) => (
          <li key={tIdx} className={styles.item}>
            <Code>{topic}</Code>
          </li>
        ))}
      </ol>
    </div>
  )
}
