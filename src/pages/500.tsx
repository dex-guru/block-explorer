import { useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntervalWhen } from 'rooks'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import ImageError from '@/images/error.svg'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import styles from './Pages.module.scss'

const PAGE_RELOAD_BASE_TIME = 5
const PAGE_RELOAD_RETRIES = 10

const ErrorPage: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => {
  const router = useRouter()
  const { retry: queryRetry } = router.query

  const retry = Math.min(Number(queryRetry) || 1, PAGE_RELOAD_RETRIES)
  const max = retry * PAGE_RELOAD_BASE_TIME
  const isAllowWaiting = retry < PAGE_RELOAD_RETRIES

  const [progress, setProgress] = useState(0)
  const [isWaiting, setIsWaiting] = useState(isAllowWaiting)

  useIntervalWhen(
    () => {
      if (progress >= max) {
        handleClick()
        return
      }

      setProgress(progress + 1)
    },
    1000,
    isWaiting,
    false
  )

  const handleClick = () => {
    setIsWaiting(false)
    router.query.retry = `${Math.min(retry + 1, PAGE_RELOAD_RETRIES)}`
    router.replace(router)
  }

  return (
    <>
      <Head>
        <title>Internal Server Error</title>
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={chainConfig}>
        <StateView
          illustration={<ImageError />}
          title={
            <>
              Oh no! Something went{' '}
              {!isAllowWaiting ? <strong>completely</strong> : ''} wrong!
            </>
          }
          actions={
            isAllowWaiting
              ? [
                  {
                    className: styles.retry,
                    caption: 'Retry now?',
                    onClick: handleClick,
                  },
                ]
              : undefined
          }
        >
          {isAllowWaiting && (
            <progress max={max} value={isWaiting ? progress : max} />
          )}
          {!isAllowWaiting && <>Give us a little time, we we fix it soon!</>}
        </StateView>
      </Page>
    </>
  )
}

export default ErrorPage

export const getStaticProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const {
    data: { chainConfig },
  } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  return addApolloState(apolloClient, {
    props: {
      chainConfig,
    },
  })
}
