import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { T } from '../../components/T'
import { monetize, PropType, Unpacked } from '../../utils'
import { colors, rem } from '../../config/styles'
import { useStore } from '../../contexts/store'
import { RootStackRouteList } from '../../routes/types'
import { GetMonthlySummaryQuery } from '../../graphql/generated/graphql'
import styles from './category.styles'

interface CategoryProps {
  data: Unpacked<PropType<GetMonthlySummaryQuery, 'categories'>>
}

export const Category: React.FunctionComponent<CategoryProps> = ({ data }) => {
  const { navigate } = useNavigation<RootStackRouteList>()

  const handlePress = () => {
    navigate('Category', {
      category: {
        id: data.id,
        name: data.name
      }
    })
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.row}>
        <T style={{ flex: 1 }}>{data.name}</T>
        <T>{monetize(data.totalExpenses ?? 0)}</T>
      </View>
    </TouchableOpacity>
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
