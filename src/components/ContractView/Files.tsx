import { FC, useMemo } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useQuery } from '@apollo/client'
import { ContractCodeModel } from '@/__generated__/resolvers-types'
import Code from '@/components/Code'
import Details from '@/components/Details'
import Heading from '@/components/Heading'
import { LoadingCard } from '@/components/Loading'
import Properties from '@/components/Properties'
import { Property } from '@/components/Properties/types'
import { GET_CONTRACT_CODE } from '@/lib/apollo/queries'
import { Match } from '@/types'
import styles from './ContractView.module.scss'

export interface IFilesProps {
  match: Match | undefined | null
  address: string
}
const Files: FC<IFilesProps> = ({ match, address }) => {
  const isMatchLoaded = match !== undefined
  const hasSources = !!match?.metadata?.sources
  const { data } = useQuery<{
    contractCode: ContractCodeModel
  }>(GET_CONTRACT_CODE, {
    variables: { address },
  })

  const bytecode = useMemo(
    () => (!hasSources && data ? data.contractCode.code : ''),
    [data, hasSources]
  )

  const properties: Property[] = []
  if (match?.metadata?.language) {
    properties.push({
      title: 'Language',
      value: match?.metadata?.language,
    })
  }
  if (match?.metadata?.compiler?.version) {
    properties.push({
      title: 'Compiler Version:',
      value: match?.metadata?.compiler?.version,
    })
  }

  properties.push({
    title: 'Optimizer Enabled',
    value: match?.metadata?.settings?.optimizer?.enabled
      ? `Yes with ${match?.metadata?.settings?.optimizer?.runs} runs`
      : 'No',
  })

  const renderFiles = () => {
    if (!isMatchLoaded) {
      return <LoadingCard />
    }

    if (!hasSources) {
      return (
        <>
          <Heading size="md">Bytecode</Heading>
          {bytecode ? <Code>{bytecode}</Code> : <LoadingCard />}
        </>
      )
    }

    return (
      <>
        {match?.metadata?.output.abi && (
          <>
            <Heading size="md">ABI</Heading>
            <SyntaxHighlighter
              className={styles.code}
              language="json"
              wrapLongLines
              showLineNumbers
              useInlineStyles={false}>
              {JSON.stringify(match?.metadata?.output.abi, null, '  ') ?? ''}
            </SyntaxHighlighter>
          </>
        )}

        {hasSources && (
          <>
            <Heading size="md">Source files</Heading>
            {Object.keys(match.metadata?.sources).map((key) => {
              const sourcecode = match.metadata?.sources[key].content
              if (!sourcecode) {
                return null
              }
              const filename = key.split('/').pop()
              return (
                <Details title={filename || ''} key={key}>
                  <SyntaxHighlighter
                    language="solidity"
                    showLineNumbers
                    wrapLongLines
                    className={styles.code}
                    useInlineStyles={false}>
                    {sourcecode}
                  </SyntaxHighlighter>
                </Details>
              )
            })}
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Properties data={properties} />
      {renderFiles()}
    </>
  )
}

export default Files
