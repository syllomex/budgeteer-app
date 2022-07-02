import { NetworkStatus } from '@apollo/client'
import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'

import {
  ExpenditureForm,
  ExpenditureFormHandles
} from '../../components/ExpenditureForm'
import { FloatingButton } from '../../components/FloatingButton'
import { LoadingIndicator } from '../../components/Loading'
import { NoContent } from '../../components/NoContent'
import { useStore } from '../../contexts/store'
import { useGetCategoryQuery } from '../../graphql/generated/graphql'
import { useScreenTitle } from '../../hooks/useScreenTitle'
import { RootStackParamList } from '../../routes/types'
import { Item } from './item'

import styles from './styles'

export const Category: React.FunctionComponent = () => {
  const expenditureFormRef = useRef<ExpenditureFormHandles>(null)

  const { params } = useRoute<RouteProp<RootStackParamList, 'Category'>>()
  useScreenTitle(params.category.name)

  const { yearMonth } = useStore()

  const { data, refetch, networkStatus } = useGetCategoryQuery({
    variables: { id: params.category.id, yearMonth }
  })

  return (
    <View style={styles.container}>
      <ExpenditureForm
        ref={expenditureFormRef}
        categoryId={params.category.id}
        yearMonth={yearMonth}
      />

      <FloatingButton
        onPress={() => expenditureFormRef.current?.open()}
        icon={props => <Ionicons name="add-outline" {...props} />}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={networkStatus === NetworkStatus.refetch}
          />
        }
      >
        {!data && <LoadingIndicator />}

        <NoContent visible={data?.category.expenditures?.length === 0}>
          Nenhuma despesa nessa categoria
        </NoContent>

        {data?.category.expenditures.map(expenditure => (
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
