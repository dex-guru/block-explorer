export const getTotalPages = (
  total: number,
  currentPerPage: number
): number => {
  return Math.floor(total / currentPerPage) + 1
}

export const getDisabled = (
  total: number,
  current: number
): { prev: boolean; next: boolean } => {
  return { prev: current < 2, next: current >= total }
}
