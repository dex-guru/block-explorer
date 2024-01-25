import type { AppProps } from 'next/app'
import { IBM_Plex_Sans_Condensed, Sora } from 'next/font/google'

import { FC, useEffect, useState } from 'react'

import { ApolloProvider } from '@apollo/client'
import { Tooltip } from 'react-tooltip'

import Loading from '@/components/Loading'
import { useApollo } from '@/lib/apollo/client'
import { initApm } from '@/services/apmService'
import '@/styles/index.scss'

import styles from './Pages.module.scss'

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
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

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

  useEffect(() => {
    const div = document.createElement('div')
    div.style.cssText = `width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;`
    document.body.appendChild(div)
    const width = div.offsetWidth - div.clientWidth
    setScrollbarWidth(width)
    document.body.removeChild(div)
  }, [])

  return (
    <ApolloProvider client={apolloClient}>
      <style jsx global>{`
        html {
          --font-sora: ${sora.style.fontFamily};
          --font-ibm: ${ibm.style.fontFamily};
          --page-scrollbar: ${scrollbarWidth}px;
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
