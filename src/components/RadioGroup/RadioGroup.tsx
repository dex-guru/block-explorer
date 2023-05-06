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
      <label key={item.value} htmlFor={item.name}>
        <input
          id={item.name}
          type="radio"
          name={groupName}
          value={item.value}
          checked={item.value === selectedValue}
          onChange={onOptionChange}
          className={styles.radioInput}
        />
        <span className={styles.radioLabel}>{item.label ?? item.name}</span>
      </label>
    )
  })

  return <div className={styles.radioGroup}>{itemsEl}</div>
}
