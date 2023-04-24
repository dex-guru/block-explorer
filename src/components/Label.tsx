import { FC, ReactNode } from 'react'

const Label: FC<{ title?: string; children?: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <span className="label">
      <div className="label__title">
        <span className="caption">{title || children}</span>
      </div>
    </span>
  )
}

export default Label
