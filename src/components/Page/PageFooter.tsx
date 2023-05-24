import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Button from '../Button'
import { SocialType } from '../Socials'
import { Socials } from '@/components'
import ImgFooter from '@/images/footer.svg'
import IconGotoTop from '@/images/icons/goto-top.svg'
import IconQuestion from '@/images/icons/question.svg'
import styles from './PageFooter.module.scss'

const PageFooter: FC = () => {
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
        <Socials
          className={styles.socials}
          socials={[
            { type: SocialType.twitter, url: 'https://twitter.com/dexguru' },
            { type: SocialType.telegram, url: 'https://t.me/dexguru' },
            {
              type: SocialType.discord,
              url: 'https://discord.gg/dPW8fzwzz9',
            },
          ]}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.about}>
          <ImgFooter className={styles.aboutImg} />

          <div className={clsx('text', styles.text)}>
            <p>
              DexGuru is a non-custodial trading terminal made for traders in
              the DeFi era
            </p>
            <small>
              DexGuru is a non-custodial trading terminal made for traders in
              the DeFi era, leveraging on-chain analytics combined with token
              swap execution capabilities.
            </small>
          </div>

          <Button
            caption="Back to Dex.guru"
            className={styles.backlink}
            to="https://dex.guru/"
          />
        </div>

        {/* <div className={styles.navigation}>
          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Use Cases
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Search Market
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Alerts & Notifications
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Top Cryptos by Market Cap
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Tokens Explorer
                </Link>
              </li>
            </ul>
          </nav>
          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Use Cases
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Search Market
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Alerts & Notifications
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Top Cryptos by Market Cap
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Tokens Explorer
                </Link>
              </li>
            </ul>
          </nav>
          <nav className={styles.links}>
            <Heading className={styles.linksTitle} size="xs">
              Use Cases
            </Heading>

            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Search Market
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Alerts & Notifications
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Top Cryptos by Market Cap
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link href="#" className={styles.link}>
                  Tokens Explorer
                </Link>
              </li>
            </ul>
          </nav>
        </div> */}
      </div>

      <div className={styles.footer}>
        <div className={styles.copyright}>
          ©{new Date().getFullYear()} dex.guru
        </div>
        <div className={styles.version}>Version Beta 433bd13</div>

        <div className={clsx(styles.links)}>
          <ul className={styles.linksLine}>
            <li className={styles.linksItem}>
              <Link href="https://feedback.dex.guru/" className={styles.link}>
                Make a suggestion
              </Link>
            </li>
            <li className={styles.linksItem}>
              <Link
                href="https://docs.dex.guru/legal/terms-of-service"
                className={styles.link}
              >
                Terms of Use
              </Link>
            </li>
            <li className={styles.linksItem}>
              <Link href="https://feedback.dex.guru/" className={styles.link}>
                <IconQuestion className={styles.linkIcon} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PageFooter
