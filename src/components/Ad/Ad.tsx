'use client'

import { FC, useCallback, useEffect, useRef } from 'react'

import useScript from 'react-script-hook'

import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { checkChainFeature } from '@/lib/utils'

import styles from './Ad.module.scss'

export type SevioAdProps = {
  zone: string
  adType: string
  inventoryId: string
  accountId: string
}

export const Ad: FC<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
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

  const [loading] = useScript({
    src: '/assets/js/loader.js',
    checkForExisting: true,
    async: true,
  })

  useEffect(() => {
    !loading && ref?.current && addSlot()
  }, [addSlot, loading])

  if (checkChainFeature(chainConfig, 'no_ads')) {
    return null
  }

  return <div className={`sevioads ${styles.container}`} data-zone={zone} ref={ref} />
}

export default Ad
