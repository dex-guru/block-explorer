import { FC, ReactNode } from 'react'

const Label: FC<{ title?: string; children?: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="label">
      <div className="label__title">
        <span className="caption">{title || children}</span>
      </div>
    </div>
  )
}

export default Label
