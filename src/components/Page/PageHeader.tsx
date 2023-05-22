import { FC, useMemo } from 'react'
import Logo from '../Logo'
import Search from '../Search'
import ThemeToggle from '../ThemeToggle'
import InfoBlock from './InfoBlock'
import PageMenu from './PageMenu'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({
  chainConfig,
  withSearch,
  withMenu = true,
}) => {
  const links = useMemo(() => {
    const baseLinks = [
      { caption: 'Home', href: '/' },
      { caption: 'Verify Contract', href: '/verifyContract' },
      {
        caption: 'API',
        href: 'https://developers.dex.guru',
      },
      {
        caption: 'Dex Metrics',
        href: `https://dex.guru/markets?chain=${chainConfig.shortName}`,
      },
    ]
    chainConfig.features.some((x) => x.name === 'csr') &&
      baseLinks.push({ caption: 'CSR', href: '/csr' })
    return baseLinks
  }, [chainConfig.features, chainConfig.shortName])

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Logo title={`${chainConfig.name}`} to="/" url={chainConfig.icon} />
      </div>
      <div className={styles.price}>
        <InfoBlock chainConfig={chainConfig} />
      </div>
      <div className={styles.search}>
        {!!withSearch && <Search className={styles.searchElement} />}
      </div>
      {!!withMenu && <PageMenu className={styles.menu} links={links} />}
      <div className={styles.network}>
        <ThemeToggle />
      </div>
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default PageHeader
