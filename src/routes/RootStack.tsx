import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { useAuth } from '../contexts/auth'
import { CategoryForm } from '../screens/CategoryForm'
import { ExpenditureForm } from '../screens/ExpenditureForm'
import { AnonymousStack } from './AnonymousStack'
import { AuthenticatedDrawer } from './AuthenticatedDrawer'

const { Navigator, Screen } = createNativeStackNavigator()

export const RootStack = () => {
  const { user } = useAuth()

  if (user) {
    return (
      <Navigator
        initialRouteName="AuthenticatedDrawer"
        screenOptions={{ animation: 'slide_from_right' }}
      >
        <Screen
          name="AuthenticatedDrawer"
          component={AuthenticatedDrawer}
          options={{ headerShown: false }}
        />
        <Screen
          name="CategoryForm"
          component={CategoryForm}
          options={{ title: 'Categoria' }}
        />
        <Screen
          name="ExpenditureForm"
          component={ExpenditureForm}
          options={{ title: 'Gasto' }}
        />
      </Navigator>
    )
  }
  return <AnonymousStack />
}
