import { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Property } from '../Properties/types'
import { Heading, Properties, Details } from '@/components'
import { Match } from '@/types'
import styles from './ContractView.module.scss'

export interface IFilesProps {
  match: Match | undefined | null
}
const Files: FC<IFilesProps> = ({ match }) => {
  const properties: Property[] = []
  if (match?.metadata?.language) {
    properties.push({
      title: 'Language',
      value: match?.metadata.language,
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

  return (
    <>
      <Properties data={properties} />
      {match?.metadata.output.abi && (
        <>
          <Heading size="md">ABI</Heading>
          <SyntaxHighlighter
            className={styles.code}
            language="json"
            wrapLongLines
            showLineNumbers
          >
            {JSON.stringify(match?.metadata.output.abi, null, '  ') ?? ''}
          </SyntaxHighlighter>
        </>
      )}

      {match?.metadata.sources && (
        <>
          <Heading size="md">Source files</Heading>
          {Object.keys(match.metadata.sources).map((key) => {
            const sourcecode = match.metadata.sources[key].content
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
                >
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

export default Files
