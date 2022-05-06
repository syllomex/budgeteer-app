import React from 'react'
import { Text, TextProps } from 'react-native'

import { colors, rem } from '../../config/styles'

type FontFamily = 'regular' | 'medium' | 'semiBold' | 'bold' | 'italic'
type Color = keyof typeof colors
type Size = number

interface TProps extends TextProps {
  f?: FontFamily
  c?: Color
  s?: Size
}

export const T: React.FunctionComponent<TProps> = ({
  children,
  f,
  c,
  s,
  ...props
}) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: f ?? 'regular',
          color: c ? colors[c] : colors['text-neutral'],
          fontSize: rem(s ?? 1.4)
        },
        props.style
      ]}
    >
      {children}
    </Text>
  )
}
