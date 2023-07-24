import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { Loading, Tooltip } from '@/components'
import { useApollo } from '@/lib/apollo/client'
import { initApm } from '@/services/apmService'
import styles from './Pages.module.scss'
import '@/styles/index.scss'

initApm()

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const router = useRouter()

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
      {isPageLoading && <Loading className={styles.pageLoading} />}
      <Component {...pageProps} />
      <Tooltip
        id="app-tooltip"
        variant="light"
        positionStrategy="fixed"
        delayHide={500}
        clickable
      />
      <Tooltip
        openOnClick
        content="Copied!"
        variant="light"
        place="bottom"
        anchorSelect=".clipboard-copy"
        delayHide={1500}
      />
    </ApolloProvider>
  )
}
