import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { sanitize } from 'isomorphic-dompurify'
import { DashboardAnalyzerHistory } from './DashboardAnalyzer'
import DashboardAnalyzerVariants from './DashboardAnalyzerVariants'
import { useDashboardAnalyze } from './hooks'
import Button from '@/components/Button'
import { IconSend, IconUser } from '@/components/Icons'
import { useTypewriter } from '@/hooks/useTypewriter'
import ImageAvatar from '@/images/guru-avatar.svg'
import styles from './DashboardAnalyzerChat.module.scss'

const DashboardAnalyzerChat: FC<{
  slug: string
  params?: Record<string, unknown>
  history: DashboardAnalyzerHistory[]
  onSelect?: (prompt_submitted: string, summary: string) => void
}> = ({ slug, params, history, onSelect }) => {
  const [isSendDisabled, setIsSendDisabled] = useState(true)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const refInput = useRef<HTMLInputElement>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsSendDisabled(!e.target.value.trim())
  }

  const { data, error, isLoading } = useDashboardAnalyze({
    slug,
    params,
    prompt: currentPrompt,
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    if (!refInput.current) {
      return
    }
    const value = refInput.current.value.trim()
    if (value) {
      setCurrentPrompt(value)
      setIsSendDisabled(true)
      refInput.current.value = ''
      refInput.current.focus()
    }
  }

  useEffect(() => {
    if (!onSelect || !currentPrompt || !data?.output) {
      return
    }

    onSelect(currentPrompt, data.output)
    setCurrentPrompt(null)

    if (refInput?.current) {
      refInput.current.focus()
    }
  }, [onSelect, currentPrompt, data?.output])

  const response =
    history?.length && data?.output === history[history.length - 1].summary
      ? sanitize(data.output.trim())
      : isLoading
      ? 'Hmmm... Let me think...'
      : error
      ? 'Ooops! Sorry, I got my circuits shorted...'
      : 'What do you want to know today?'

  const [printed, notPrinted] = useTypewriter(response)

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.entries}>
          {!history.length && !currentPrompt && (
            <div className={styles.entry}>
              <div className={styles.response}>
                <div className={styles.wrapper}>
                  <ImageAvatar className={styles.robot} />
                  <div className={styles.text}>
                    {!!printed && (
                      <>
                        <span className={styles.printed}>{printed}</span>
                        <span className={styles.notPrinted}>{notPrinted}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {history.map((entry, idx) => {
            if (data?.output === entry.summary) {
              return null
            }

            return (
              <div className={styles.entry} key={idx}>
                <div className={styles.prompt}>
                  <div className={styles.wrapper}>
                    <IconUser className={styles.user} />
                    <div className={styles.text}>{entry.prompt_submitted}</div>
                  </div>
                </div>
                <div className={styles.response}>
                  <div className={styles.wrapper}>
                    <ImageAvatar className={styles.robot} />
                    <div className={styles.text}>{entry.summary}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {currentPrompt && (
            <div className={styles.entry}>
              <div className={styles.prompt}>
                <div className={styles.wrapper}>
                  <IconUser className={styles.user} />
                  <div className={styles.text}>{currentPrompt}</div>
                </div>
              </div>
              <div className={styles.response}>
                <div className={styles.wrapper}>
                  <ImageAvatar className={styles.robot} />
                  <div className={styles.text}>
                    {!!printed && (
                      <>
                        <span className={styles.printed}>{printed}</span>
                        <span className={styles.notPrinted}>{notPrinted}</span>
                      </>
                    )}

                    {isLoading && (
                      <div className={styles.processing}>
                        <span />
                        <span />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!!history?.length && !isLoading && (
            <div className={styles.entry}>
              <div className={styles.response}>
                <div className={styles.wrapper}>
                  <ImageAvatar className={styles.robot} />
                  <div className={styles.text}>What&apos;s next?</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <DashboardAnalyzerVariants
          className={styles.variants}
          slug={slug}
          params={params}
          history={history}
          onSubmit={(value) => {
            setCurrentPrompt(value)
          }}
        />

        <form className={styles.input} onSubmit={handleSubmit}>
          <input
            className={styles.query}
            placeholder="Type your query"
            ref={refInput}
            onChange={handleChange}
            autoFocus
          />
          <Button
            className={styles.submit}
            icon={<IconSend className={styles.submitIcon} />}
            disabled={isSendDisabled}
          />
        </form>
      </div>
    </div>
  )
}

export default DashboardAnalyzerChat
