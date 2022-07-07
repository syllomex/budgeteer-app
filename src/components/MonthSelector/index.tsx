import { MaterialIcons } from '@expo/vector-icons'
import React, { useMemo, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { colors, rem } from '../../config/styles'

import { useDashboard } from '../../hooks'
import { displayYearMonth, monetize } from '../../utils'
import { YearMonthPicker, YearMonthPickerHandles } from '../Form/YearMonth'
import { useLoadingText } from '../Loading'
import { T } from '../T'
import styles from './styles'

const arrowProps = {
  size: rem(2),
  color: colors.primary
}

export const MonthSelector: React.FunctionComponent = () => {
  const yearMonthPicker = useRef<YearMonthPickerHandles>(null)

  const { month, goToPrevMonth, goToNextMonth, data, fetching, setMonth } =
    useDashboard()

  const refreshingText = useLoadingText({
    enabled: fetching,
    text: 'Atualizando'
  })

  const description = useMemo(() => {
    if (!data) return ''
    if (fetching) return refreshingText
    return `Renda: ${monetize(data.totalMonthlyIncomings)}\nGastos: ${monetize(
      data.totalMonthlyExpenses
    )}`
  }, [data, fetching, refreshingText])

  return (
    <View style={styles.monthSelectorContainer}>
      <YearMonthPicker
        ref={yearMonthPicker}
        onSelect={month => setMonth(month as string)}
      />

      <View style={styles.monthSelectorRow}>
        <TouchableOpacity style={styles.arrowContainer} onPress={goToPrevMonth}>
          <MaterialIcons name="arrow-back" {...arrowProps} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => yearMonthPicker.current?.open()}
          style={styles.monthSelectorTextContainer}
        >
          <T f="semiBold" s={1.6}>
            {displayYearMonth(month)}
          </T>
          <T c="muted" style={{ textAlign: 'center', lineHeight: rem(2) }}>
            {description}
          </T>
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowContainer} onPress={goToNextMonth}>
          <MaterialIcons name="arrow-forward" {...arrowProps} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
