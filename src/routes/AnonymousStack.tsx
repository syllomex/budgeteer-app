import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignIn } from '../screens/SignIn'

const { Navigator, Screen } = createNativeStackNavigator()

export const AnonymousStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  )
}
