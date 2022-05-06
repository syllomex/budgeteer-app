import React from 'react'
import { Image, View } from 'react-native'
import { rem } from '../../config/styles'
import { T } from '../T'

import noData from '../../assets/images/no-data.png'

import styles from './styles'

export const NoContent: React.FunctionComponent<{
  visible?: boolean
  children: string
}> = ({ children, visible }) => {
  if (!visible) return null

  return (
    <View style={styles.container}>
      <Image source={noData} />
      <T style={{ textAlign: 'center', paddingTop: rem(1.6) }} c="muted">
        {children}
      </T>
    </View>
  )
}
