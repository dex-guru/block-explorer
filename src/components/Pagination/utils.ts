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
): { prev: boolean; next: boolean } => {
  return {
    prev: page <= 1,
    next: page >= total,
  }
}
