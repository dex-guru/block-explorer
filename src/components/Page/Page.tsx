import { CSSProperties, FC } from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import PageFooter from './PageFooter'
import PageHeader from './PageHeader'
import { PageProps } from './types'
import RainbowKitAuthWrapper from '@/containers/RainbowKitAuthWrapper'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { hexToHsl } from '@/lib/utils'
import styles from './Page.module.scss'

const Page: FC<PageProps> = ({ children, chainConfig }) => {
  const [h, s, l] = hexToHsl(chainConfig.chainColor)

  const { wagmiConfig, chains } = useWagmiConfig(chainConfig)
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthWrapper>
        <RainbowKitProvider chains={chains}>
          <div
            id="page"
            className={styles.container}
            style={
              {
                '--color-accent-base-h': `${h * 360}`,
                '--color-accent-base-s': `${s * 100}%`,
                '--color-accent-base-l': `${l * 100}%`,
              } as CSSProperties
            }
          >
            <div className={styles.header}>
              <PageHeader chainConfig={chainConfig} />
            </div>
            <div className={styles.body}>{children}</div>
            <div className={styles.footer}>
              <PageFooter chainConfig={chainConfig} />
            </div>
          </div>
        </RainbowKitProvider>
      </RainbowKitAuthWrapper>
    </WagmiConfig>
  )
}

export default Page
