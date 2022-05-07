import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../config/styles'
import { useDashboard } from '../../hooks'
import { MonthSelector } from '../../components/MonthSelector'
import { NoContent } from '../../components/NoContent'
import { FloatingButton } from '../../components/FloatingButton'
import { useStore } from '../../contexts/store'
import { Category, NewCategoryButton } from './category'
import styles from './styles'

export const Dashboard = () => {
  const { categories } = useDashboard()

  const { openCategoryModal } = useStore()

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={openCategoryModal}
        icon={props => <Ionicons {...props} name="add-outline" />}
      />

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
            </View>
              )}

          {categories?.length === 0 && (
            <NewCategoryButton center textColor="primary" />
          )}
        </View>
      </ScrollView>
    </View>
  )
}
