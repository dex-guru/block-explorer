import { NextPage } from 'next'
import Head from 'next/head'
import { Page } from '@/components'
import styles from './Pages.module.scss'

const VerifyContract: NextPage = () => {
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <iframe
          src="https://sourcify.dev/#/verifier"
          className={styles.verifyContractFrame}
        />
      </Page>
    </>
  )
}

export default VerifyContract
