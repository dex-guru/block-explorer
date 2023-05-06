import { ChangeEvent, FC, useState } from 'react'
import styles from './RadioGroup.module.scss'

export interface RadioGroupItem {
  name: string
  value: string
  label?: string
}

interface IRadioGroupProps {
  items: RadioGroupItem[]
  groupName: string
  value: string
  onChange: (value: string) => void
}

export const RadioGroup: FC<IRadioGroupProps> = ({
  items,
  onChange,
  value,
  groupName,
}) => {
  const [selectedValue, setSelectedValue] = useState(value)

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value)
    onChange(e.target.value)
  }

  const itemsEl = items.map((item) => {
    return (
      <div className={styles['radio_group-item']} key={item.value}>
        <input
          id={item.name}
          type="radio"
          name={groupName}
          value={item.value}
          checked={item.value === selectedValue}
          onChange={onOptionChange}
        />
        <label htmlFor={item.name}>{item.label ?? item.name}</label>
      </div>
    )
  })

  return <div className={styles['radio_group']}>{itemsEl}</div>
}
