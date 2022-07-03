import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { Color, colors, rem } from '../../config/styles'
import { T } from '../T'
import styles from './styles'

export const Button: React.FunctionComponent<{
  onPress?: () => void | Promise<void>
  loading?: boolean
  accentColor?: Color | null | false
  thin?: boolean
}> = ({ children, onPress, loading, accentColor, thin }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        loading && { opacity: 0.6 },
        accentColor && { backgroundColor: colors[accentColor] },
        thin && { paddingVertical: rem(0.8) }
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors['text-in-primary']} />
      ) : (
        <T f="medium" c="text-in-primary">
          {children}
        </T>
      )}
    </TouchableOpacity>
  )
}
