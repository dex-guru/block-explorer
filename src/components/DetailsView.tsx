import { FC, ReactNode } from 'react'
import { Heading } from './Heading'

const DetailsView: FC<{
  title: string
  address?: string
  icon?: ReactNode
  tag?: string
  children: ReactNode
}> = ({ title, address, icon, tag, children }) => {
  return (
    <div className="details-view">
      <div className="details-view__header">
        {!!icon && (
          <div className="details-view__icon">
            <div className="icon">{icon}</div>
          </div>
        )}
        <Heading caption={title} size="lg" className="details-view__title" />
        {!!address && (
          <Heading
            caption={address}
            size="lg"
            className="details-view__address"
          />
        )}
        <div className="details-view__tools"></div>
        {!!tag && <div className="details-view__tag">{tag}</div>}
      </div>
      <div className="details-view__body">{children}</div>
    </div>
  )
}

export default DetailsView
