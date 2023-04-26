import Head from 'next/head'
import { Heading, Page } from '@/components'

export default function Home() {
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Heading size="lg" caption="Hello" />
      </Page>
    </>
  )
}
