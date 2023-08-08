import { FC, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import type { AppProps } from 'next/app'
import { Sora, IBM_Plex_Sans_Condensed } from 'next/font/google'
import { ApolloProvider } from '@apollo/client'
import Loading from '@/components/Loading'
import { useApollo } from '@/lib/apollo/client'
import { initApm } from '@/services/apmService'
import styles from './Pages.module.scss'
import '@/styles/index.scss'

const sora = Sora({
  weight: ['500', '600'],
  subsets: ['latin-ext'],
  variable: '--font-sora',
})

const ibm = IBM_Plex_Sans_Condensed({
  weight: ['400', '500'],
  subsets: ['latin-ext'],
  variable: '--font-ibm',
})

initApm()

const App: FC<AppProps> = ({ Component, pageProps, router }) => {
  const apolloClient = useApollo(pageProps)
  const [isPageLoading, setIsPageLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsPageLoading(true)
    const handleStop = () => setIsPageLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <ApolloProvider client={apolloClient}>
      <style jsx global>{`
        html {
          --font-sora: ${sora.style.fontFamily};
          --font-ibm: ${ibm.style.fontFamily};
        }
      `}</style>
      {isPageLoading && <Loading className={styles.pageLoading} />}
      <Component {...pageProps} />
      <Tooltip
        id="app-tooltip"
        variant="light"
        positionStrategy="fixed"
        delayHide={500}
        clickable
        disableStyleInjection="core"
      />
      <Tooltip
        openOnClick
        content="Copied!"
        variant="light"
        place="bottom"
        anchorSelect=".clipboard-copy"
        delayHide={1500}
        disableStyleInjection="core"
      />
    </ApolloProvider>
  )
}

export default App
