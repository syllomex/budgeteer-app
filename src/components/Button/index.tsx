import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { colors } from '../../config/styles'
import { T } from '../T'
import styles from './styles'

export const Button: React.FunctionComponent<{
  onPress?: () => void | Promise<void>
  loading?: boolean
}> = ({ children, onPress, loading }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, loading && { opacity: 0.6 }]}
      disabled={loading}
    >
      {loading
        ? (
        <ActivityIndicator color={colors['text-in-primary']} />
          )
        : (
        <T f="medium" c="text-in-primary">
          {children}
        </T>
          )}
    </TouchableOpacity>
  )
}
