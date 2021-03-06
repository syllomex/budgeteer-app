import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { renderCustomStackHeader } from '../components/CustomStackHeader'
import { useAuth } from '../contexts/auth'
import { Category } from '../screens/Category'
import { AnonymousStack } from './AnonymousStack'
import { AuthenticatedDrawer } from './AuthenticatedDrawer'
import { RootStackParamList } from './types'

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>()

export const RootStack = () => {
  const { user } = useAuth()

  if (user) {
    return (
      <Navigator
        initialRouteName="AuthenticatedDrawer"
        screenOptions={{
          animation: 'slide_from_right',
          header: renderCustomStackHeader
        }}
      >
        <Screen
          name="AuthenticatedDrawer"
          component={AuthenticatedDrawer}
          options={{ headerShown: false }}
        />
        <Screen
          name="Category"
          component={Category}
          options={{ title: 'Categoria' }}
        />
      </Navigator>
    )
  }
  return <AnonymousStack />
}
