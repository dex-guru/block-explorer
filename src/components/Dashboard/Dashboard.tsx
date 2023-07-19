import { FC } from 'react'
import DashboardWidget from './DashboardWidget'
import { DashboardData, DashboardWidgetQueryResult } from './types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<
  DashboardData & {
    queriesResults: Record<number, DashboardWidgetQueryResult>
  }
> = ({ widgets, queriesResults }) => {
  return (
    <div className={styles.container}>
      {widgets
        ?.filter((widget) => !widget.options.isHidden)
        .map((widget) => (
          <DashboardWidget
            {...widget}
            queryResult={queriesResults[widget?.visualization?.query?.id]}
            key={widget.id}
          />
        ))}
    </div>
  )
}

export default Dashboard
