import { NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import StateView from '@/components/StateView'
import ImageError from '@/images/error.svg'
import styles from './Pages.module.scss'

const ErrorPage: NextPage<{ chainConfig: ChainConfigModel }> = () => {
  return (
    <>
      <Head>
        <title>Internal Server Error</title>
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
        ]}
      >
        Give us a little time, we we fix it soon!
      </StateView>
    </>
  )
}

export default ErrorPage
