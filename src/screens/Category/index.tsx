import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { FloatingButton } from '../../components/FloatingButton'
import { NoContent } from '../../components/NoContent'
import { useCategory, useStore } from '../../contexts/store'
import { useScreenTitle } from '../../hooks/useScreenTitle'
import { RootStackParamList } from '../../routes/types'
import { Item } from './item'
import styles from './styles'

export const Category: React.FunctionComponent = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Category'>>()
  useScreenTitle(params.category.name)

  const { expenditures } = useCategory(params.category.id)
  const { openExpenditureModal } = useStore()

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={() => openExpenditureModal({ categoryId: params.category.id })}
        icon={props => <Ionicons name="add-outline" {...props} />}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <NoContent visible={expenditures?.length === 0}>
          Nada cadastrado nessa categoria
        </NoContent>

        {expenditures?.map(expenditure => (
          <Item key={expenditure.id} data={expenditure} />
        ))}
      </ScrollView>
    </View>
  )
}
