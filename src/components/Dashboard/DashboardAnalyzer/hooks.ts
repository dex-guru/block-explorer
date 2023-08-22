import useSWRImmutable from 'swr/immutable'
import { DashboardAnalyzerHistory } from './DashboardAnalyzer'

type Params = Record<string, unknown>

export const useDashboardPrompts = (
  slug: string,
  params?: Params,
  history?: DashboardAnalyzerHistory[]
) =>
  useSWRImmutable([slug, params], ([slug, params]) =>
    fetch('/api/dashboard/prompts', {
      method: 'POST',
      body: JSON.stringify({
        dashboard_slug: slug,
        parameters: params,
        chat_logs: history,
      }),
    }).then((res) => res.json())
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
    async () => {
      const res = await fetch('/api/dashboard/analyzer', {
        method: 'POST',
        body: JSON.stringify({
          dashboard_slug: slug,
          parameters: params,
          selected_prompt: prompt,
        }),
      })

      if (!res.ok) {
        throw new Error(
          `An error occurred while fetching analyzer data: [${res.status}] ${res.statusText}`
        )
      }

      return res.json()
    }
  )
