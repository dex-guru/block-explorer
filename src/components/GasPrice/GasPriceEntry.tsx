import { FC, ReactNode } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Separated from '../Separated'
import { GasPriceType } from './types'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import Heading from '@/components/Heading'
import Value from '@/components/Value'
import ImageStress from '@/images/emoji/stress.svg'
import ImageSwear from '@/images/emoji/swear.svg'
import ImageSweet from '@/images/emoji/sweet.svg'
import styles from './GasPrice.module.scss'

const gasPriceValues: Record<GasPriceType, { title: string; icon: ReactNode }> =
  {
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
  const calcValue = new BigNumber(base && value ? base + value : 0)

  return (
    <div className={clsx(styles.entry, className)}>
      <div className={styles.header}>
        {gasPriceValues[type].icon}
        <Heading
          size="xs"
          caption={gasPriceValues[type].title}
          className={styles.title}
        />
        <Value
          className={clsx(styles.value, styles[type])}
          value={Math.ceil(calcValue.shiftedBy(-9).toNumber()) || '–'}
          suffix={<>&nbsp;{chainConfig.gasUnit}</>}
        />
      </div>
      <div className={styles.body}>
        <Separated>
          <div className={styles.prop}>
            Base: {base ? Math.ceil(base / 10 ** 9) : '–'}
          </div>
          <div className={styles.prop}>
            Priority: {value ? Math.ceil(value / 10 ** 9) : '–'}
          </div>
        </Separated>
      </div>
    </div>
  )
}

export default GasPriceEntry
