import React from 'react'
import { View } from 'react-native'
import { rem } from '../../config/styles'

interface SpacerProps {
  width?: number
  height?: number
}

export const Spacer: React.FunctionComponent<SpacerProps> = ({
  height,
  width
}) => {
  return (
    <View
      style={[
        height && { height: rem(height) },
        width && { width: rem(width) }
      ]}
    />
  )
}
