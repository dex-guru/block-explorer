import dynamic from 'next/dynamic'

import { FC, MouseEvent, useMemo, useState } from 'react'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import Cookies from 'js-cookie'

import Logo from '@/components/Logo'
import Search from '@/components/Search'
import { APP_OWNER, AUTH_COOKIE_NAME } from '@/constants'
import { SUCCESS_AUTH_EVENT } from '@/containers/RainbowKitAuthWrapper'
import { checkChainFeature } from '@/lib/utils'

import InfoBlock from './InfoBlock'
import PageMenu, { PageMenuMainLink } from './PageMenu'
import { PageHeaderProps } from './types'

import styles from './PageHeader.module.scss'

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
})
const NetworkSelect = dynamic(() => import('@/components/NetworkSelect'), {
  ssr: false,
})

const PageHeader: FC<PageHeaderProps> = ({ chainConfig }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { openConnectModal } = useConnectModal()

  const links = useMemo(() => {
    const baseLinks: PageMenuMainLink[] = [
      { caption: 'Home', href: '/' },
      {
        caption: 'Blockchain',
        href: '',
        submenu: [
          { caption: 'Transactions', href: '/txs' },
          ...(checkChainFeature(chainConfig, 'traces')
            ? [
                {
                  caption: 'Contract Internal Transactions',
                  href: '/txsInternal',
                },
              ]
            : []),
          { caption: 'View Blocks', href: '/blocks' },
          { caption: 'Chain Info', href: '/chain' },
        ],
      },
      {
        caption: 'Tokens',
        href: '',
        submenu: [
          { caption: 'ERC-20 Top Tokens', href: '/tokens' },
          { caption: 'ERC-20 Token TXns', href: '/tokentxns' },
        ],
      },
      ...(!APP_OWNER || process.env.NEXT_PUBLIC_REDASH_URL
        ? [
            {
              caption: 'Developers',
              href: '',
              submenu: [
                ...(!APP_OWNER
                  ? [
                      {
                        caption: 'Developers API',
                        href: 'https://developers.dex.guru',
                      },
                      { caption: 'Verify Contract', href: '/verifyContract' },
                    ]
                  : []),
                ...(!!process.env.NEXT_PUBLIC_ABI_VERIFY_URL
                  ? [{ caption: 'Verify Contract ABI', href: '/verifyABI' }]
                  : []),
                ...(checkChainFeature(chainConfig, 'charts')
                  ? [
                      {
                        caption: 'Data Warehouse',
                        href: process.env.NEXT_PUBLIC_REDASH_URL || 'https://warehouse.dex.guru',
                        onClick: (e: MouseEvent) => {
                          const accessTokenCookie = Cookies.get(AUTH_COOKIE_NAME)
                          if (!accessTokenCookie && openConnectModal) {
                            openConnectModal()
                            document.addEventListener(
                              SUCCESS_AUTH_EVENT,
                              () =>
                                window.open(
                                  process.env.NEXT_PUBLIC_REDASH_URL ||
                                    'https://warehouse.dex.guru',
                                  '_blank'
                                ),
                              { once: true }
                            )
                            e.preventDefault()
                          }
                        },
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      {
        caption: 'More',
        href: '',
        submenu: [
          ...(!APP_OWNER
            ? [
                {
                  caption: 'Dex Metrics',
                  href: `https://dex.guru/markets?chain=${chainConfig.shortName}`,
                },
              ]
            : []),
          {
            caption: 'Gas Tracker',
            href: '/gastracker',
          },
          ...(checkChainFeature(chainConfig, 'charts')
            ? [
                {
                  caption: 'Charts & Statistics',
                  href: '/charts',
                },
              ]
            : []),
          ...(checkChainFeature(chainConfig, 'csr') ? [{ caption: 'CSR', href: '/csr' }] : []),
        ],
      },
    ]
    return baseLinks
  }, [chainConfig])

  const onOpenChange = (value: boolean) => {
    setIsMenuOpen(value)
  }

  return (
    <header className={clsx(styles.container, { [styles.open]: isMenuOpen })}>
      <div className={styles.logo}>
        <Logo title={`${chainConfig.name}`} to="/" url={chainConfig.icon} />
      </div>
      <div className={styles.price}>
        <InfoBlock chainConfig={chainConfig} />
      </div>
      <div className={styles.search}>
        <Search className={styles.searchElement} />
      </div>
      <PageMenu className={styles.menu} links={links} onOpenChange={onOpenChange} />
      {!!chainConfig.relatives.length && (
        <div className={styles.network}>
          <NetworkSelect current={chainConfig.chain} variants={chainConfig.relatives} />
        </div>
      )}
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default PageHeader
