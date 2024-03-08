'use client'

import { FC, useCallback, useEffect, useRef } from 'react'

import useScript from 'react-script-hook'

import styles from './Ad.module.scss'

export type SevioAdProps = {
  zone: string
  adType: string
  inventoryId: string
  accountId: string

  style?: React.CSSProperties
  __overrideSevioHost?: string
}

export const Ad: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const zone = '7aecae46-d352-4bab-8fa2-aaf53481cdd7'
  const adType = 'banner'
  const inventoryId = '2b61ac91-467e-4230-ae17-91acd647a900'
  const accountId = '012bff72-4fdf-4622-8741-9ddfbdc582fe'

  const addSlot = useCallback(() => {
    const wnd = window as Window & typeof globalThis & { sevioads: [[SevioAdProps]] }
    wnd.sevioads = (wnd.sevioads || []) as [[SevioAdProps]]
    wnd.sevioads.push([{ zone, adType, inventoryId, accountId }])
  }, [accountId, adType, inventoryId, zone])

  const [loading, error] = useScript({
    src: 'https://cdn.adx.ws/scripts/loader.js',
    checkForExisting: true,
    async: true,
  })

  useEffect(() => {
    !loading && !error && ref?.current && addSlot()
  }, [addSlot, loading, error])

  return <div className={styles.container} data-zone={zone} ref={ref} />
}

export default Ad
