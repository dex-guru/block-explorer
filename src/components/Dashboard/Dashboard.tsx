import { FC } from 'react'
import DashboardWidget from './DashboardWidget'
import { DashboardData, DashboardWidgetQueryData } from './types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<
  DashboardData & {
    queries: Record<number, DashboardWidgetQueryData>
  }
> = ({ widgets, queries }) => {
  return (
    <div className={styles.container}>
      {widgets
        ?.filter((widget) => !widget.options.isHidden)
        .sort((a, b) => {
          const aPos = a.options.position.row * 100 + a.options.position.col
          const bPos = b.options.position.row * 100 + b.options.position.col

          return aPos - bPos
        })
        .map((widget) => (
          <DashboardWidget
            {...widget}
            query={queries[widget?.visualization?.query?.id]}
            key={widget.id}
          />
        ))}
    </div>
  )
}

export default Dashboard
