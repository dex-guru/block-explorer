export const getTotalPages = (
  total: number,
  currentPerPage: number
): number => {
  return Math.ceil(total / currentPerPage)
}

export const getDisabled = (
  total: number,
  current: number
): { prev: boolean; next: boolean } => {
  return { prev: current < 2, next: current >= total }
}
