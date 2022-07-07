import { NetworkStatus } from '@apollo/client'
import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useMemo, useRef } from 'react'
import { FlatList, View } from 'react-native'

import {
  ExpenditureForm,
  ExpenditureFormHandles
} from '../../components/ExpenditureForm'
import { FloatingButton } from '../../components/FloatingButton'
import { LoadingIndicator } from '../../components/Loading'
import { NoContent } from '../../components/NoContent'
import { Separator } from '../../components/Separator'
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
    variables: { id: params.category.id, yearMonth },
    fetchPolicy: 'cache-and-network'
  })

  const ListEmptyComponent = useMemo(() => {
    if (!data) return <LoadingIndicator spaced />

    if (data?.category.expenditures.length === 0) {
      return <NoContent visible>Nenhuma despesa nessa categoria</NoContent>
    }

    return null
  }, [data])

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

      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={data?.category.expenditures}
        keyExtractor={({ id }) => id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <Item data={item} categoryId={params.category.id} />
        )}
      />
    </View>
  )
}
