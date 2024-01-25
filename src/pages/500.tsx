import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useEffect } from 'react'

import StateView from '@/components/StateView'
import { CHAIN_ID } from '@/constants'
import ImageError from '@/images/error.svg'

import styles from './Pages.module.scss'

const ErrorPage: NextPage = () => {
  const title = `Internal Server Error on ${CHAIN_ID}`
  const { asPath } = useRouter()

  useEffect(() => {
    const _window = window as Window & {
      dataLayer?: Array<Record<string, string>>
    }

    if (_window?.dataLayer?.push) {
      _window.dataLayer.push({
        event: 'page_error',
        path: asPath,
        chainId: `${CHAIN_ID}`,
      })
    }
  }, [asPath])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <StateView
        className={styles.errorPage}
        illustration={<ImageError />}
        title={
          <>
            Oh no! Something went <strong>completely</strong> wrong!
          </>
        }
        actions={[
          {
            className: styles.retry,
            caption: 'Retry now?',
            onClick: () => {
              window.location.reload()
            },
          },
        ]}>
        Give us a little time, we we fix it soon!
      </StateView>
    </>
  )
}

export default ErrorPage
