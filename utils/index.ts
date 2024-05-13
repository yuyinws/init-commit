export function formatNumber(number: number | undefined) {
  if (!number)
    return number

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumSignificantDigits: 2,
  }).format(number)
}
