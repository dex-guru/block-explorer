import { ReactElement, ReactNode } from 'react'
import Tabs, { TabsProps } from './Tabs'

const TabPanel = <T,>(
  props: TabsProps<T> & { children: ReactNode }
): ReactElement => {
  return (
    <div className="tab-panel">
      <div className="tab-panel__header">
        <Tabs {...props} className="tab-panel__tabs" />
      </div>
      <div className="tab-panel__body">{props.children}</div>
    </div>
  )
}

export default TabPanel
