import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

import { colors } from '../../config/styles'
import { useDashboard } from '../../hooks'
import { MonthSelector } from '../../components/MonthSelector'
import { NoContent } from '../../components/NoContent'
import { Category, NewCategoryButton } from './category'
import styles from './styles'

export const Dashboard = () => {
  const { categories } = useDashboard()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <MonthSelector />

        <View style={styles.categoriesContainer}>
          {!categories
            ? (
            <ActivityIndicator size="large" color={colors.primary} />
              )
            : (
            <View>
              <NoContent visible={categories.length === 0}>
                Nada cadastrado nesse mês
              </NoContent>

              {categories.map(category => (
                <Category key={category.uid} data={category} />
              ))}

              <NewCategoryButton
                center={!categories.length}
                textColor={!categories.length ? 'primary' : 'muted'}
              />
            </View>
              )}
        </View>
      </ScrollView>
    </View>
  )
}
