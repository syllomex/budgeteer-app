import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { colors, rem } from '../../config/styles'

import { useDashboard } from '../../hooks'
import { displayYearMonth, monetize } from '../../utils'
import { YearMonthPicker, YearMonthPickerHandles } from '../Form/YearMonth'
import { LoadingIndicator, useLoadingText } from '../Loading'
import { Spacer } from '../Spacer'
import { T } from '../T'
import styles from './styles'

const arrowProps = {
  size: rem(2),
  color: colors.primary
}

export const MonthSelector: React.FunctionComponent<{
  totalsHidden?: boolean
  isLoading?: boolean
}> = ({ totalsHidden, isLoading }) => {
  const yearMonthPicker = useRef<YearMonthPickerHandles>(null)

  const { month, goToPrevMonth, goToNextMonth, data, fetching, setMonth } =
    useDashboard()

  const refreshingText = useLoadingText({
    enabled: fetching,
    text: ''
  })

  return (
    <View>
      <View style={styles.monthSelectorContainer}>
        <YearMonthPicker
          ref={yearMonthPicker}
          onSelect={month => setMonth(month as string)}
        />

        <View style={styles.monthSelectorRow}>
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={goToPrevMonth}
          >
            <MaterialIcons name="arrow-back" {...arrowProps} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => yearMonthPicker.current?.open()}
            style={styles.monthSelectorTextContainer}
          >
            {isLoading && <Spacer width={2.4} />}
            <T f="semiBold" s={1.6} style={{ textAlignVertical: 'center' }}>
              {displayYearMonth(month)}
            </T>
            {isLoading && (
              <LoadingIndicator
                size="small"
                containerStyle={{ marginLeft: rem(0.4) }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={goToNextMonth}
          >
            <MaterialIcons name="arrow-forward" {...arrowProps} />
          </TouchableOpacity>
        </View>
      </View>

      {data && !totalsHidden && (
        <View style={styles.monthInfoContainer}>
          <View style={styles.monthInfoColumn}>
            <T color="muted">Rendimentos</T>
            <T>
              {fetching ? refreshingText : monetize(data.totalMonthlyIncomings)}
            </T>
          </View>
          <View style={styles.monthInfoColumn}>
            <T color="muted">Gastos</T>
            <T>
              {fetching ? refreshingText : monetize(data.totalMonthlyExpenses)}
            </T>
          </View>
          <View style={styles.monthInfoColumn}>
            <T color="muted">Disponível</T>
            <T>{fetching ? refreshingText : monetize(data.availableBudget)}</T>
          </View>
        </View>
      )}
    </View>
  )
}
