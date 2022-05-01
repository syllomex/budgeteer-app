import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Dashboard } from '../screens/Dashboard'

const { Navigator, Screen } = createNativeStackNavigator()

export const DashboardStack = () => {
  return (
    <Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Screen name="Dashboard" component={Dashboard} />
    </Navigator>
  )
}
