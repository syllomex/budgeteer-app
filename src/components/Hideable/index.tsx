import React from 'react'
import { View } from 'react-native'
import { colors, rem } from '../../config/styles'
import { useStore } from '../../contexts/store'
import { T, TProps } from '../T'

export const Hideable: React.FunctionComponent<TProps> = ({ ...props }) => {
  const { hideValues } = useStore()

  const length = typeof props.children === 'string' ? props.children.length : 10
  const size = rem(props.s ?? props.size ?? 1.4)

  if (hideValues) {
    return (
      <View
        style={{
          width: length * rem((props.size ?? props.s ?? 1.4) / 2),
          height: size * 1.4,
          backgroundColor: colors['background-matte+3']
        }}
      />
    )
  }

  return <T {...props} />
}
