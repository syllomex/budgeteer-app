import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { ScrollView, View } from 'react-native'

import {
  ExpenditureForm,
  ExpenditureFormHandles
} from '../../components/ExpenditureForm'
import { FloatingButton } from '../../components/FloatingButton'
import { NoContent } from '../../components/NoContent'
import { useCategory } from '../../contexts/store'
import { useScreenTitle } from '../../hooks/useScreenTitle'
import { RootStackParamList } from '../../routes/types'
import { Item } from './item'

import styles from './styles'

export const Category: React.FunctionComponent = () => {
  const expenditureFormRef = useRef<ExpenditureFormHandles>(null)

  const { params } = useRoute<RouteProp<RootStackParamList, 'Category'>>()
  useScreenTitle(params.category.name)

  const { expenditures } = useCategory(params.category.id)

  return (
    <View style={styles.container}>
      <ExpenditureForm
        ref={expenditureFormRef}
        categoryId={params.category.id}
      />

      <FloatingButton
        onPress={() => expenditureFormRef.current?.open()}
        icon={props => <Ionicons name="add-outline" {...props} />}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <NoContent visible={expenditures?.length === 0}>
          Nada cadastrado nessa categoria
        </NoContent>

        {expenditures?.map(expenditure => (
          <Item
            key={expenditure.id}
            data={expenditure}
            categoryId={params.category.id}
          />
        ))}
      </ScrollView>
    </View>
  )
}
