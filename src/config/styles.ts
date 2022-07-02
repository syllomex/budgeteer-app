export const rem = (value: number) => {
  return value * 10
}

export type Color = keyof typeof colors

export const colors = {
  primary: '#66AAEE',
  'primary-1': '#CCDDEE',
  'primary+1': '#5566BB',
  'background-light': '#FFFFFF',
  'background-neutral': '#DDCCCC',
  'background-matte': '#F4F6FF',
  'background-matte+1': '#E7E8E9',
  'background-matte+2': '#E4E6EF',
  'border-line': '#BABABA',
  muted: '#9A9A9A',
  'muted-blue': '#AAAABB',
  placeholder: '#929292',
  'text-neutral': '#4E4E4E',
  'text-dark': '#252525',
  'text-in-primary': '#FFFFFF',
  success: '#66AAEE',
  warning: '#FFFF66',
  danger: '#EE6666',
  'color-overlay': '#00000044'
}
