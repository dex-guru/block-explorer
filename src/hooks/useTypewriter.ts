import { useEffect, useState } from 'react'

export const useTypewriter = (text = '', delay = 40) => {
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<[string, string]>(['', ''])

  useEffect(() => {
    setIndex(0)
  }, [text, delay])

  useEffect(() => {
    if (index >= text.length) {
      return
    }

    const [printed, notPrinted] = [
      text.substring(0, index + 1),
      text.substring(index),
    ]

    setTimeout(() => {
      setResult([printed, notPrinted])
      setIndex(index + 1)
    }, delay)
  }, [index, text, delay])

  return result
}
