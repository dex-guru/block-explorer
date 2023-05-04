export const getTotalPages = (
  total: number,
  currentPerPage: number
): number => {
  if (total) {
    return Math.ceil(total / currentPerPage)
  }
  return 0
}

export const getDisabled = (
  total: number,
  current: number
): { prev: boolean; next: boolean } => {
  if (current < total) {
    return { prev: false, next: false }
  }

  return { prev: current < 2, next: current >= total }
}
