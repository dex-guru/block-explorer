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
  page: number
): { prev: boolean; first: boolean; last: boolean; next: boolean } => {
  return {
    first: page <= 1,
    prev: page <= 1,
    next: page >= total,
    last: page >= total,
  }
}
