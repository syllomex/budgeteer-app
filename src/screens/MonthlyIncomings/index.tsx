import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { FlatList, View } from 'react-native'
import { NetworkStatus } from '@apollo/client'
import { FloatingButton } from '../../components/FloatingButton'
import { MonthSelector } from '../../components/MonthSelector'
import { useStore } from '../../contexts/store'
import { useGetMonthlyIncomingsQuery } from '../../graphql/generated/graphql'
import { LoadingIndicator } from '../../components/Loading'
import { NoContent } from '../../components/NoContent'
import styles from './styles'
import { Incoming } from './incoming'

export const MonthlyIncomings = () => {
  const { yearMonth, monthlyIncomingForm } = useStore()

  const { data, refetch, networkStatus } = useGetMonthlyIncomingsQuery({
    variables: { yearMonth },
    fetchPolicy: 'cache-and-network'
  })

  const fetching = useMemo(
    () => data && networkStatus === NetworkStatus.setVariables,
    [data, networkStatus]
  )

  const ListHeaderComponent = useMemo(() => {
    return (
      <View>
        <MonthSelector totalsHidden isLoading={fetching} />
      </View>
    )
  }, [fetching])

  const ListEmptyComponent = useMemo(() => {
    if (!data) return <LoadingIndicator spaced />
    return (
      <NoContent visible={data.monthlyIncomings.length === 0}>
        Nada cadastrado nesse mês
      </NoContent>
    )
  }, [data])

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={() => monthlyIncomingForm.current?.open()}
        icon={props => <Ionicons name="add" {...props} />}
      />

      <FlatList
        data={data?.monthlyIncomings}
        keyExtractor={({ id }) => id.toString()}
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => <Incoming data={item} />}
      />
    </View>
  )
}
