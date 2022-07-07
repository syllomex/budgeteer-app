import React from 'react'
import { Text, TextProps } from 'react-native'

import { colors, rem } from '../../config/styles'

type FontFamily = 'regular' | 'medium' | 'semiBold' | 'bold' | 'italic'
type Color = keyof typeof colors
type Size = number

interface TProps extends TextProps {
  f?: FontFamily
  font?: FontFamily
  c?: Color
  color?: Color
  s?: Size
  size?: Size
}

export const T: React.FunctionComponent<TProps> = ({
  children,
  f,
  c,
  s,
  font,
  size,
  color,
  ...props
}) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: font ?? f ?? 'regular',
          color:
            c || color ? colors[(color || c) as Color] : colors['text-neutral'],
          fontSize: rem(size ?? s ?? 1.4)
        },
        props.style
      ]}
    >
      {children}
    </Text>
  )
}
