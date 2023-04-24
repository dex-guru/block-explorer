import Logo from '@/components/Logo'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page">
        <div className="page__wrapper">
          <Header
          <header>
            <Logo withText />
          </header>
        </div>
      </div>
    </>
  )
}
