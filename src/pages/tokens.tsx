import { ChangeEventHandler, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  ChainConfigModel,
  ChainStatsModel,
  TopTokensModel,
} from '@/__generated__/resolvers-types'
import DataTable from '@/components/DataTable'
import DetailsView from '@/components/DetailsView'
import Page from '@/components/Page'
import { topTokensColumns } from '@/components/Table/columns/topTokensColumns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TOP_TOKENS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { PaginationVariables } from '@/types'
import styles from '@/pages/Pages.module.scss'

const perPage = [5, 10, 25, 50, 100]

interface ITopTokensProps {
  topTokens: TopTokensModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const TopTokensPage: NextPage<ITopTokensProps> = (props) => {
  const isMount = useIsMount()
  const [topTokens, setTopTokens] = useState(props.topTokens)
  const [getTopTokens, { data, loading }] = useLazyQuery(GET_TOP_TOKENS)
  const [currentVariables, setCurrentVariables] = useState({
    first: perPage[1],
    skip: 0,
    onlyVerified: false,
  })

  const onPaginationChange = (variables: PaginationVariables) => {
    setCurrentVariables({ ...currentVariables, ...variables })
  }

  useEffect(() => {
    if (data && isMount) {
      setTopTokens(data.topTokens)
    }
  }, [data, isMount])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentVariables({
      ...currentVariables,
      skip: 0,
      onlyVerified: !!e.target.checked,
    })
  }

  useEffect(() => {
    getTopTokens({
      variables: {
        ...currentVariables,
      },
    })
  }, [getTopTokens, currentVariables])

  const pageTitle = `ERC-20 Top Tokens on ${props.chainConfig.name}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore top tokens on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView title="ERC-20 Top Tokens">
          <DataTable
            isLoading={loading}
            columns={topTokensColumns}
            data={topTokens.data}
            header={
              <label className={styles.formLabel}>
                <span className={styles.formLabelCaption}>Verified only</span>{' '}
                <input
                  type="checkbox"
                  className={styles.formControlSwitch}
                  defaultChecked={currentVariables.onlyVerified}
                  onChange={handleChange}
                />
              </label>
            }
            total={topTokens.total}
            empty={{
              title: 'No top tokens data',
            }}
            perPage={perPage[1]}
            onPageChange={onPaginationChange}
          />
        </DetailsView>
      </Page>
    </>
  )
}

export default TopTokensPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('tokens')

  const apolloClient = initializeApollo({ ctx })

  const {
    data: { topTokens, chainConfig },
    error,
  } = await apolloClient.query({
    query: GET_TOP_TOKENS,
    variables: { first: perPage[1], skip: 0, onlyVerified: false },
  })

  error
    ? logger.error(error, 'Error getting GET_TOP_TOKENS info')
    : logger.info({
        msg: 'Got GET_TOP_TOKENS info',
        obj: { topTokens, chainConfig },
      })

  return addApolloState(apolloClient, {
    props: { topTokens, chainConfig },
  })
}
