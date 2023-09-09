import useSWRImmutable from 'swr/immutable'
import { DashboardAnalyzerHistory } from './DashboardAnalyzer'

type Params = Record<string, unknown>

export const useDashboardPrompts = (
  slug: string,
  params?: Params,
  history?: DashboardAnalyzerHistory[]
) =>
  useSWRImmutable([slug, params, history], ([slug, params, history]) =>
    fetch('/api/dashboard/prompts', {
      method: 'POST',
      body: JSON.stringify({
        dashboard_slug: slug,
        parameters: params,
        chat_logs: history,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `An error occurred while fetching analyzer data: [${res.status}] ${res.statusText}`
          )
        }
        return res.json()
      })
      .catch((err) => {
        throw new Error(
          `An error occurred while fetching analyzer data: ${
            (err as Error).message
          }`
        )
      })
  )

export const useDashboardAnalyze = ({
  slug,
  params,
  prompt,
}: {
  slug: string
  params?: Params
  prompt?: string | null
}) =>
  useSWRImmutable<{ output: string }>(
    prompt ? [slug, params, prompt] : null,
    () =>
      fetch('/api/dashboard/analyzer', {
        method: 'POST',
        body: JSON.stringify({
          dashboard_slug: slug,
          parameters: params,
          selected_prompt: prompt,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          }

          throw new Error(
            `An error occurred while fetching analyzer data: [${res.status}] ${res.statusText}`
          )
        })
        .catch((err) => {
          throw new Error(
            `An error occurred while fetching analyzer data: ${
              (err as Error).message
            }`
          )
        })
  )
