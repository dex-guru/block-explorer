export const formatTime = (seconds: number): string => {
  const years = Math.floor(seconds / 60 / 60 / 24 / 365)

  if (years > 1) {
    return years + ' years'
  }
  const months = Math.floor(seconds / 60 / 60 / 24 / 30)
  if (months > 1) {
    return months + ' months'
  }
  const weeks = Math.floor(seconds / 60 / 60 / 24 / 7)
  if (weeks > 1) {
    return weeks + ' weeks'
  }
  const days = Math.floor(seconds / 60 / 60 / 24)
  if (days > 1) {
    return days + ' days'
  }
  const hours = Math.floor(seconds / 60 / 60)
  if (hours > 1) {
    return hours + ' hours'
  }
  const mins = Math.floor(seconds / 60)
  if (mins > 1) {
    return mins + ' min'
  }
  return Math.floor(seconds) + ' sec'
}
