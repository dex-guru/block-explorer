export const getTotalPages = (
  total: number,
  currentPerPage: number
): number => {
  if (total) {
    return Math.floor(total / currentPerPage)
  }
  return 0
}
