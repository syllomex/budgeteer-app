export const monetize = (value: number) => {
  const fixed = Math.abs(value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${value < 0 ? '-' : ''}R$ ${fixed}`
}
