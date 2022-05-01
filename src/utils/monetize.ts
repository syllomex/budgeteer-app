export const monetize = (value: number) => {
  const fixed = value
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `R$ ${fixed}`
}
