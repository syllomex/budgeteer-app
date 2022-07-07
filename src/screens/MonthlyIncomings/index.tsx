import React from 'react'
import { FlatList, View } from 'react-native'
import { MonthSelector } from '../../components/MonthSelector'
import { useStore } from '../../contexts/store'
import { useGetMonthlyIncomingsQuery } from '../../graphql/generated/graphql'
import { Incoming } from './incoming'

export const MonthlyIncomings = () => {
  const { yearMonth } = useStore()

  const { data } = useGetMonthlyIncomingsQuery({ variables: { yearMonth } })

  return (
    <View>
      <FlatList
        data={data?.monthlyIncomings}
        keyExtractor={({ id }) => id.toString()}
        ListHeaderComponent={
          <View>
            <MonthSelector />
          </View>
        }
        renderItem={({ item }) => <Incoming data={item} />}
      />
    </View>
  )
}
