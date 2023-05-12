import { NextPage } from 'next'
import Head from 'next/head'
import { Error, Page } from '@/components'

const AddressIndex: NextPage = () => {
  return (
    <>
      <Head>
        <title>No address provided</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <Page withSearch>
        <Error title="No address provided" />
      </Page>
    </>
  )
}

export default AddressIndex
