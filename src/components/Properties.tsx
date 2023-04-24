import { FC, ReactNode } from 'react'
import Card from './Card'
import classNames from 'classnames'
import { Heading } from './Heading'

type Property = {
  title: string
  tooltip?: ReactNode
  value?: ReactNode
}

const Properties: FC<{ data: Property[]; className?: string }> = ({
  data,
  className,
}) => {
  return (
    <div className={classNames('properties', className)}>
      <ul className="properties__list">
        {data.map((item, idx) => {
          return (
            <li className="properties__item" key={idx}>
              <div className="properties-entry">
                <div className="properties-entry__header">
                  <Heading
                    caption={item.title}
                    className="properties-entry__title"
                    size="xs"
                  />
                </div>
                <div className="properties-entry__body">
                  {item.value || '–'}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Properties
