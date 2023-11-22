import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Separated from '../Separated'
import { GasPriceType } from './types'
import { ChainConfigModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import Heading from '@/components/Heading'
import Value from '@/components/Value'
import ImageStress from '@/images/emoji/stress.svg'
import ImageSwear from '@/images/emoji/swear.svg'
import ImageSweet from '@/images/emoji/sweet.svg'
import { getNormalizedValue } from '@/lib/utils'
import styles from './GasPrice.module.scss'

const gasPriceValues: Record<GasPriceType, { title: string; icon: ReactNode }> = {
  standart: {
    title: 'Standart',
    icon: null,
  },
  low: { title: 'Low', icon: <ImageSweet className={styles.icon} /> },
  avg: { title: 'Average', icon: <ImageStress className={styles.icon} /> },
  high: { title: 'High', icon: <ImageSwear className={styles.icon} /> },
}

const GasPriceEntry: FC<{
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
  type: GasPriceType
  value?: number
  base?: number
  className?: string
}> = ({ chainConfig, type, value, base, className }) => {
  return (
    <div className={clsx(styles.entry, className)}>
      <div className={styles.header}>
        {gasPriceValues[type].icon}
        <Heading size="xs" caption={gasPriceValues[type].title} className={styles.title} />
        <Value
          className={clsx(styles.value, styles[type])}
          value={base ? getNormalizedValue(base + (value || 0), 9) : '–'}
          suffix={<>&nbsp;{chainConfig.gasUnit}</>}
        />
      </div>
      {!!value && (
        <div className={styles.body}>
          <Separated>
            <div className={styles.prop}>Base: {base ? getNormalizedValue(base, 9) : '–'}</div>
            <div className={styles.prop}>
              Priority: {value ? getNormalizedValue(value, 9) : '–'}
            </div>
          </Separated>
        </div>
      )}
    </div>
  )
}

export default GasPriceEntry
