import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { rem } from '../../../config/styles'

export const ClearButton = ({ onPress }: { onPress(): void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: rem(0.6) }}
    >
      <Ionicons name="close-outline" />
    </TouchableOpacity>
  )
}
