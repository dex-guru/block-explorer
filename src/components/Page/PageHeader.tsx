import { FC, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import InfoBlock from './InfoBlock'
import PageMenu, { PageMenuMainLink } from './PageMenu'
import { PageHeaderProps } from './types'
import Logo from '@/components/Logo'
import Search from '@/components/Search'
import { checkChainFeature } from '@/lib/utils'
import styles from './PageHeader.module.scss'

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
})
const NetworkSelect = dynamic(() => import('@/components/NetworkSelect'), {
  ssr: false,
})

const PageHeader: FC<PageHeaderProps> = ({ chainConfig }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      {
        caption: 'Developers',
        href: '',
        submenu: [
          {
            caption: 'Developers API',
            href: 'https://developers.dex.guru',
          },
          { caption: 'Verify Contract', href: '/verifyContract' },
          ...(checkChainFeature(chainConfig, 'charts')
            ? [
                {
                  caption: 'Data Warehouse',
                  href: 'https://warehouse.dex.guru',
                },
              ]
            : []),
        ],
      },
      {
        caption: 'More',
        href: '',
        submenu: [
          {
            caption: 'Dex Metrics',
            href: `https://dex.guru/markets?chain=${chainConfig.shortName}`,
          },
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
          ...(checkChainFeature(chainConfig, 'csr')
            ? [{ caption: 'CSR', href: '/csr' }]
            : []),
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
      <PageMenu
        className={styles.menu}
        links={links}
        onOpenChange={onOpenChange}
      />
      {!!chainConfig.relatives.length && (
        <div className={styles.network}>
          <NetworkSelect
            current={chainConfig.chain}
            variants={chainConfig.relatives}
          />
        </div>
      )}
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default PageHeader
