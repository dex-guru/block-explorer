import { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Heading, Properties, Details } from '@/components'
import { Match, MatchType } from '@/types'
import styles from './ContractView.module.scss'

export interface IFilesProps {
  match: Match | undefined | null
}
const Files: FC<IFilesProps> = ({ match }) => {
  return (
    <>
      <Properties
        data={[
          {
            title: 'Language',
            value: match?.metadata.language,
          },
          {
            title: 'Compiler Version:',
            value: match?.metadata.compiler.version,
          },
          {
            title: 'Optimizer Enabled',
            value: match?.metadata.settings.optimizer?.enabled
              ? `Yes with ${match?.metadata.settings.optimizer?.runs} runs`
              : 'No',
          },
          {
            title: 'Match',
            value: match?.type === MatchType.FULL_MATCH ? 'Full' : 'Partial',
          },
        ]}
      />
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
