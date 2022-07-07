import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { colors } from '../../config/styles'

export const Separator: FunctionComponent = () => {
  return (
    <View style={{ height: 1, backgroundColor: colors['background-matte'] }} />
  )
}
