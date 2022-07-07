import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MonthlyIncomings } from '../screens/MonthlyIncomings'

const { Navigator, Screen } = createNativeStackNavigator()

export const IncomingStack = () => {
  return (
    <Navigator
      initialRouteName="MonthlyIncomings"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Screen name="MonthlyIncomings" component={MonthlyIncomings} />
    </Navigator>
  )
}
