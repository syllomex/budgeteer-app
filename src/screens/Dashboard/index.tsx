import React, { useMemo } from 'react'
import { RefreshControl, View } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

import { MonthSelector } from '../../components/MonthSelector'
import { NoContent } from '../../components/NoContent'
import { FloatingButton } from '../../components/FloatingButton'
import { LoadingIndicator } from '../../components/Loading'

import { useStore } from '../../contexts/store'

import { SwipeableScrollView } from '../../components/SwipeableScrollView'
import { Category, NewCategoryButton } from './category'

import styles from './styles'

export const Dashboard = () => {
  const {
    openCategoryModal,
    data,
    refetch,
    refreshing,
    monthlyIncomingForm,
    goToNextMonth,
    goToPrevMonth
  } = useStore()

  const categories = useMemo(() => {
    if (!data) return null

    return [...data.categories].sort((a, b) => {
      return b.totalExpenses - a.totalExpenses
    })
  }, [data])

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={openCategoryModal}
        icon={props => <Ionicons {...props} name="add-outline" />}
      />

      <FloatingButton
        onPress={() => monthlyIncomingForm.current?.open()}
        icon={props => <MaterialIcons name="attach-money" {...props} />}
        bottom={6}
      />

      <SwipeableScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
        onSwipeLeft={goToPrevMonth}
        onSwipeRight={goToNextMonth}
      >
        <MonthSelector />

        <View style={styles.categoriesContainer}>
          {!categories ? (
            <LoadingIndicator />
          ) : (
            <View>
              <NoContent visible={categories.length === 0}>
                Nada cadastrado nesse mês
              </NoContent>

              {categories.map(category => (
                <Category key={category.id} data={category} />
              ))}
            </View>
          )}

          {categories?.length === 0 && (
            <NewCategoryButton center textColor="primary" />
          )}
        </View>
      </SwipeableScrollView>
    </View>
  )
}
