import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Button from '../Button'
import { Heading, Socials } from '@/components'
import ImgFooter from '@/images/footer.svg'
import IconGotoTop from '@/images/icons/goto-top.svg'
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
        <Socials className={styles.socials} />
      </div>
      <div className={styles.body}>
        <div className={styles.about}>
          <ImgFooter className={styles.aboutImg} />

          <div className={clsx('text', styles.text)}>
            <p>
              Powered by DexGuru{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                width="32"
                height="32"
              >
                <g clip-path="url(#a)">
                  <path
                    fill="#0B0F14"
                    d="M19.854 40c10.965 0 19.854-8.954 19.854-20S30.818 0 19.854 0C8.889 0 0 8.954 0 20s8.889 20 19.854 20Z"
                  />
                  <path
                    fill="url(#b)"
                    fill-rule="evenodd"
                    d="M19.866 6.901c-1.43 0-2.547.566-3.286 1.485-.716.89-1.016 2.031-1.016 3.12 0 1.152.45 2.446 1.146 3.457.682.99 1.77 1.938 3.156 1.938 1.384 0 2.472-.944 3.155-1.933.697-1.01 1.147-2.305 1.147-3.462 0-1.086-.286-2.23-1-3.122-.739-.925-1.86-1.483-3.302-1.483Zm-2.34 4.605c0-.75.208-1.418.577-1.877.346-.43.89-.752 1.763-.752.898 0 1.438.324 1.775.745.361.453.566 1.119.566 1.884 0 .695-.292 1.604-.796 2.335-.518.75-1.09 1.085-1.545 1.085-.453 0-1.025-.335-1.544-1.09-.506-.733-.797-1.642-.797-2.33Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill="url(#c)"
                    d="M13.324 21.364c-1.988-.222-3.63 1.38-3.63 3.019 0 1.63 1.276 3.11 3.677 3.11.863 0 1.745-.38 2.713-1.09 1.128-.828 2.064-1.8 3-2.775.94-.976 1.88-1.954 3.018-2.788 1.127-.826 2.414-1.47 3.867-1.47 3.311 0 5.638 2.2 5.638 5.087 0 2.879-2.72 5.326-5.807 4.982-1.239-.138-2.692-.56-3.86-1.707l1.368-1.415c.743.73 1.716 1.048 2.707 1.158h.001c1.988.223 3.63-1.379 3.63-3.018 0-1.631-1.277-3.111-3.677-3.111-.863 0-1.745.38-2.713 1.091-1.128.828-2.064 1.8-3.001 2.774-.94.977-1.88 1.954-3.017 2.788-1.127.827-2.414 1.47-3.867 1.47-3.311 0-5.638-2.199-5.638-5.086 0-2.88 2.72-5.327 5.807-4.982 1.239.137 2.692.56 3.86 1.706l-1.368 1.415c-.743-.73-1.716-1.048-2.707-1.157h-.001Z"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="b"
                    x1="6.683"
                    x2="22.728"
                    y1="16.389"
                    y2="32.316"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#6046FF" />
                    <stop offset="1" stop-color="#46D7AB" />
                  </linearGradient>
                  <linearGradient
                    id="c"
                    x1="6.683"
                    x2="22.728"
                    y1="16.389"
                    y2="32.316"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#6046FF" />
                    <stop offset="1" stop-color="#46D7AB" />
                  </linearGradient>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h39.708v40H0z" />
                  </clipPath>
                </defs>
              </svg>
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
                  href="https://developers.dex.guru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  On-Chain REST API
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
