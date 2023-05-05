import { FC } from 'react'
import Address from '../Address'

interface ITopicsProps {
  topics: string[]
}

export const Topics: FC<ITopicsProps> = ({ topics }) => {
  if (!topics.length) {
    return null
  }

  return (
    <div className="text">
      <ul>
        {topics.map((topic, tIdx) => (
          <li key={tIdx}>
            [{tIdx}]{' '}
            <Address
              type="account"
              address={topic}
              isLink={false}
              isShorten={false}
              isCopy
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
