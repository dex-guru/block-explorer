import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import { RainbowKitProvider, darkTheme, lightTheme, Theme } from '@rainbow-me/rainbowkit'
import merge from 'lodash.merge'
import { WagmiConfig } from 'wagmi'
import { Theme as ThemeEnum } from '../ThemeToggle'
import { THEME_STORAGE_NAME, getCurrentTheme } from '../ThemeToggle/ThemeToggle'
import PageFooter from './PageFooter'
import PageHeader from './PageHeader'
import { PageProps } from './types'
import RainbowKitAuthWrapper from '@/containers/RainbowKitAuthWrapper'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { hexToHsl } from '@/lib/utils'
import styles from './Page.module.scss'

const Page: FC<PageProps> = ({ children, chainConfig }) => {
  const [h, s, l] = hexToHsl(chainConfig.chainColor)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { wagmiConfig, chains } = useWagmiConfig(chainConfig)

  const customTheme = useMemo(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_NAME)
      const currentTheme = savedTheme || getCurrentTheme()
      return currentTheme === ThemeEnum.dark
        ? merge(darkTheme({ borderRadius: 'medium' }), {
            colors: {
              modalBackground: '#1e242c',
              accentColor: '#9488f0',
              connectButtonBackground: '#1e242c',
            },
            fonts: {
              body: 'Sora, sans-serif',
            },
          } as Theme)
        : lightTheme({ borderRadius: 'medium' })
    }
  }, [])

  const body = (
    <div
      id="page"
      className={styles.container}
      style={
        {
          '--color-accent-base-h': `${h * 360}`,
          '--color-accent-base-s': `${s * 100}%`,
          '--color-accent-base-l': `${l * 100}%`,
        } as CSSProperties
      }>
      <div className={styles.header}>
        <PageHeader chainConfig={chainConfig} />
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <PageFooter chainConfig={chainConfig} />
      </div>
    </div>
  )

  return isMounted ? (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthWrapper>
        <RainbowKitProvider chains={chains} theme={customTheme}>
          {body}
        </RainbowKitProvider>
      </RainbowKitAuthWrapper>
    </WagmiConfig>
  ) : (
    body
  )
}

export default Page
