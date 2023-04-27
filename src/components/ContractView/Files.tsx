import { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Properties from '../Properties'
import { Match, MatchType } from '@/types'

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
          <h3>ABI</h3>
          <SyntaxHighlighter language="json" showLineNumbers>
            {JSON.stringify(match?.metadata.output.abi, null, '  ') ?? ''}
          </SyntaxHighlighter>
        </>
      )}

      {match?.metadata.sources && (
        <>
          <h3>Source files</h3>
          {Object.keys(match.metadata.sources).map((key) => {
            const sourcecode = match.metadata.sources[key].content
            if (!sourcecode) {
              return null
            }
            const filename = key.split('/').pop()
            return (
              <>
                <h4>{filename}</h4>
                <SyntaxHighlighter language="solidity" showLineNumbers>
                  {sourcecode}
                </SyntaxHighlighter>
              </>
            )
          })}
        </>
      )}
    </>
  )
}

export default Files
