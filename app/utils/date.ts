const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const getDisplayDate = (date: Date) => {
  const month = date.getMonth()
  const day = date.getDate()
  const year = date.getFullYear()
  return `${MONTH[month]} ${day}, ${year}`
}
