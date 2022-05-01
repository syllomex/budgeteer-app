import React from 'react'
import { TouchableOpacity } from 'react-native'
import { T } from '../T'
import styles from './styles'

export const Button: React.FunctionComponent<{
  onPress?: () => void | Promise<void>
}> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <T f="medium" c="text-in-primary">
        {children}
      </T>
    </TouchableOpacity>
  )
}
