import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import Heading from '@/components/Heading'
import ImgBlockExplorer from '@/images/blockexplorer.svg'
import IconGotoTop from '@/images/icons/goto-top.svg'
import styles from './PageFooter.module.scss'

const PageFooter: FC<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          icon={<IconGotoTop />}
          caption="Back to Top"
          className={styles.gotoTop}
          onClick={() => {
            document.documentElement.scrollTo(0, 0)
          }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.about}>
          <Image
            src="/assets/images/mascot.svg"
            className={styles.aboutImg}
            alt="DexGuru"
            width={0}
            height={0}
          />
          <div className={styles.text}>
            <div className={styles.powered}>
              <ImgBlockExplorer className={styles.logoExplorer} /> Block
              Explorers Powered by DexGuru
            </div>
            <small>
              DexGuru is an Analytics Platform and Block Explorer for{' '}
              {chainConfig.name}.
            </small>
          </div>

          <Button
            caption="Back to Dex.guru"
            className={styles.backlink}
            to="https://dex.guru/"
          />
        </div>

        <div className={styles.navigation}>
          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Products & Services
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link
                  href="https://dex.guru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Trading Terminal
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://dex.guru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Charting
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://dexguru.readme.io/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Developers API
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://b2b.dex.guru/explorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Explorer-as-a-Service
                </Link>
              </li>
            </ul>
          </nav>

          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Company
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link
                  href="https://b2b.dex.guru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  About Us
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://docs.dex.guru/resources/brand-assets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Brand Assets
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://webforms.pipedrive.com/f/6rExdWpdC4j2tsyB09LRGHr6990s7NqeLfhIpT4vPjJOmddqhyIMu7dyvJFAjABNHd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Contact Us
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://docs.dex.guru/resources/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Terms Of Service
                </Link>
              </li>
            </ul>
          </nav>

          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Community
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link
                  href="https://discord.com/invite/dPW8fzwzz9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Discord
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://twitter.com/dexguru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Twitter
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://t.me/dexguru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Telegram
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link
                  href="https://dexguru.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.copyright}>
          ©{new Date().getFullYear()} dex.guru
        </div>
        <div className={styles.version}>
          Version Beta {process.env.GIT_COMMIT}
        </div>

        <nav className={clsx(styles.links)}>
          <ul className={styles.linksLine}>
            <li className={styles.linksItem}>
              <Link
                href="https://docs.dex.guru/legal/terms-of-service"
                className={styles.link}
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default PageFooter
