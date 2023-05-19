import { FC, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Button from '../Button'
import Copy from '../Copy'
import { CodeFormat, CodeProps } from './types'
import styles from './Code.module.scss'

const Code: FC<CodeProps> = ({
  children: initialText = '',
  className,
  isCopy = true,
  format,
  defaultFormat = 'ascii',
}) => {
  const [currentFormat, setCurrentFormat] = useState<CodeFormat>(defaultFormat)
  const [currentText, setCurrentText] = useState<string>(initialText)

  useEffect(() => {
    if (currentFormat === defaultFormat) {
      setCurrentText(initialText)
      return
    }

    if (currentFormat === 'custom' && format?.decode) {
      const text = format.decode(initialText)
      setCurrentText(text)
      return
    }

    if (['hex', 'dec'].includes(defaultFormat)) {
      const number = new BigNumber(
        initialText,
        defaultFormat === 'dec' ? 10 : 16
      )
      setCurrentText(number.toString(currentFormat === 'dec' ? 10 : 16))
      return
    }

    setCurrentText(initialText)
    return
  }, [currentFormat, initialText, defaultFormat, format])

  const handleClickDec = () => {
    setCurrentFormat('dec')
  }

  const handleClickHex = () => {
    setCurrentFormat('hex')
  }

  const handleClickDecode = () => {
    setCurrentFormat('custom')
  }

  return (
    <div className={clsx(styles.container, className)}>
      {!!initialText && (
        <div className={styles.tools}>
          {!!format && (
            <div className={styles.group}>
              {!!format.hex && (
                <Button
                  caption="Hex"
                  onClick={handleClickHex}
                  className={clsx(styles.action, styles.groupAction, {
                    [styles.active]: currentFormat === 'hex',
                  })}
                />
              )}
              {!!format.dec && (
                <Button
                  caption="Dec"
                  onClick={handleClickDec}
                  className={clsx(styles.action, styles.groupAction, {
                    [styles.active]: currentFormat === 'dec',
                  })}
                />
              )}
              {!!format.decode && (
                <Button
                  caption="Decode"
                  onClick={handleClickDecode}
                  className={clsx(styles.action, styles.groupAction, {
                    [styles.active]: currentFormat === 'custom',
                  })}
                />
              )}
            </div>
          )}

          {isCopy && <Copy text={currentText} className={styles.action} />}
        </div>
      )}

      <pre className={styles.pre}>
        <code className={styles.code}>{currentText}</code>
      </pre>
    </div>
  )
}
export default Code
