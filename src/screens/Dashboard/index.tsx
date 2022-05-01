import React from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import noData from '../../assets/images/no-data.png'

import { T } from '../../components/T'

import { colors, rem } from '../../config/styles'
import { useDashboard } from '../../hooks'
import { MonthSelector } from '../../components/MonthSelector'
import { Category } from './category'
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
              {!categories.length && (
                <View style={styles.noDataContainer}>
                  <Image source={noData} />
                  <T
                    style={{ textAlign: 'center', paddingTop: rem(1.6) }}
                    c="muted"
                  >
                    Nada cadastrado nesse mês
                  </T>
                </View>
              )}
              {categories.map(category => (
                <Category key={category.uid} data={category} />
              ))}
            </View>
              )}
        </View>
      </ScrollView>
    </View>
  )
}
