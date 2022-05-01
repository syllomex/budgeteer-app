import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { T } from '../../components/T'
import { monetize } from '../../utils'
import { useDashboard } from '../../hooks'
import { colors, rem } from '../../config/styles'
import { useStore } from '../../contexts/store'
import styles from './category.styles'

interface CategoryProps {
  data: {
    uid: string
    name: string
  }
}

export const Category: React.FunctionComponent<CategoryProps> = ({ data }) => {
  const { getCategoryExpendituresRef } = useDashboard()

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const subscriber = getCategoryExpendituresRef(data.uid).onSnapshot(
      snapshot => {
        setTotal(
          snapshot.docs.reduce((acc, doc) => {
            return acc + (doc.data().value ?? 0)
          }, 0)
        )
      }
    )

    return subscriber
  }, [data.uid, getCategoryExpendituresRef])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <T style={{ flex: 1 }}>{data.name}</T>
        <T>{monetize(total)}</T>
      </View>
    </View>
  )
}

export const NewCategoryButton: React.FunctionComponent<{
  center?: boolean
  textColor?: keyof typeof colors
}> = ({ center, textColor }) => {
  const { openCategoryModal } = useStore()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openCategoryModal}
        style={[styles.row, center && { justifyContent: 'center' }]}
      >
        <T c={textColor ?? 'muted'}>Nova categoria</T>
        <Ionicons
          name="add-outline"
          color={textColor ? colors[textColor] : colors.muted}
          size={rem(1.4)}
        />
      </TouchableOpacity>
    </View>
  )
}
