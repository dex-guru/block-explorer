import { FC } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { sanitize } from 'isomorphic-dompurify'
import useSWRImmutable from 'swr/immutable'
import Card from '@/components/Card'
import Message from '@/components/Message'
import styles from './Dashboard.module.scss'

const DashboardAnalyzer: FC<{
  slug: string
  params?: Record<string, unknown>
}> = ({ slug, params }) => {
  // const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)

  // const {
  //   data: promptsData,
  //   error: promptsError,
  //   isLoading: isLoadingPrompts,
  // } = useSWRImmutable([slug, params], ([slug, params]) =>
  //   fetch('/api/dashboard/prompts', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       dashboard_slug: slug,
  //       parameters: params,
  //     }),
  //   }).then((res) => res.json())
  // )

  const {
    data: analyzeData,
    error: analyzeError,
    isLoading: isLoadingAnalyze,
  } = useSWRImmutable<{ output: string }>([slug, params], () =>
    fetch('/api/dashboard/analyzer', {
      method: 'POST',
      body: JSON.stringify({
        dashboard_slug: slug,
        parameters: params,
        // selected_prompt: currentPrompt,
        selected_prompt: '',
      }),
    }).then((res) => res.json())
  )

  const analyzeOutput = analyzeData?.output || null

  if (!analyzeOutput && isLoadingAnalyze) {
    return (
      <Message
        text="🤔 DexGuruGPT takes ~30 sec to analyze this dashboard data"
        type="prompt"
      />
    )
  }

  if (analyzeError) {
    return <Message text="😢 DexGuruGPT left this chat" type="danger" />
  }

  if (!analyzeOutput) {
    return null
  }

  const renderedPrompts = undefined
  // aiPrompts?.length ? (
  //   <Tabs
  //     tabs={aiPrompts.map((prompt, idx) => {
  //       return { title: prompt, value: idx }
  //     })}
  //     value={0}
  //     className={styles.prompts}
  //     onChange={(value) => {
  //       setCurrentPrompt(aiPrompts[value])
  //     }}
  //   />
  // ) : undefined

  const responseOutput = sanitize(analyzeOutput).trim()

  return (
    <Card
      title="🤖 DexGuruGPT says: "
      className={styles.analyzer}
      footer={renderedPrompts}
    >
      <div className={styles.output}>
        <div
          className={styles.outputPlaceholder}
          dangerouslySetInnerHTML={{
            __html: responseOutput,
          }}
        />
        <TypeAnimation
          sequence={[responseOutput]}
          className={styles.outputTyping}
          speed={75}
        />
      </div>
    </Card>
  )
}

export default DashboardAnalyzer
