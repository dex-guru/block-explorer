import Head from 'next/head'
import Link from 'next/link'
import {
  Address,
  Avatar,
  Card,
  DetailsView,
  Heading,
  Label,
  Page,
  Properties,
  TabPanel,
  Tile,
} from '@/components'
import IconVerify from '@/images/icons/verified.svg'

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
