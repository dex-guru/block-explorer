export const getTotalPages = (
  total: number,
  currentPerPage: number
): number => {
  if (total) {
    return Math.floor(total / currentPerPage)
  }
  return 0
}

export const getDisabled = (
  total: number,
  perPage: number
): { prev: boolean; first: boolean; last: boolean; next: boolean } => {
  if (total > perPage) {
    return { prev: true, first: true, last: false, next: false }
  }

  return { prev: true, first: true, last: true, next: true }
}
