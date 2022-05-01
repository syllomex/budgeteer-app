import React from 'react'
import { View } from 'react-native'
import { T } from '../../T'

import styles from './styles'

export const Label: React.FunctionComponent<{ required?: boolean }> = ({
  children,
  required
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <T f="medium" style={styles.label}>
        {children}
        {required && <T c="danger">*</T>}
      </T>
    </View>
  )
}
