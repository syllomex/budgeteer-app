import React from 'react'
import { Image, View } from 'react-native'

import { rem } from '../../config/styles'
import { useAuth } from '../../contexts/auth'
import { T } from '../T'
import styles from './styles'

export const DrawerHeader: React.FunctionComponent = () => {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={{ uri: user?.photo, width: rem(6.4), height: rem(6.4) }}
          style={styles.picture}
        />

        <View style={styles.infoContainer}>
          <T>{user?.name}</T>
          <T c="muted" s={1.2}>
            {user?.email}
          </T>
        </View>
      </View>
    </View>
  )
}
