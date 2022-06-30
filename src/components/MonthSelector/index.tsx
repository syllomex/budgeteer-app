import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { colors, rem } from '../../config/styles'

import { useDashboard } from '../../hooks'
import { displayYearMonth, monetize } from '../../utils'
import { T } from '../T'
import styles from './styles'

const arrowProps = {
  size: rem(2),
  color: colors.primary
}

export const MonthSelector: React.FunctionComponent = () => {
  const { month, goToPrevMonth, goToNextMonth, data } = useDashboard()

  return (
    <View style={styles.monthSelectorContainer}>
      <View style={styles.monthSelectorRow}>
        <TouchableOpacity style={styles.arrowContainer} onPress={goToPrevMonth}>
          <MaterialIcons name="arrow-back" {...arrowProps} />
        </TouchableOpacity>
        <View style={styles.monthSelectorTextContainer}>
          <T f="semiBold" s={1.6}>
            {displayYearMonth(month)}
          </T>
          {data?.totalMonthlyExpenses !== undefined && (
            <T c="muted">Gastos: {monetize(data.totalMonthlyExpenses)}</T>
          )}
        </View>
        <TouchableOpacity style={styles.arrowContainer} onPress={goToNextMonth}>
          <MaterialIcons name="arrow-forward" {...arrowProps} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
