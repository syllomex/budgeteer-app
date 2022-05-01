import React, { useMemo } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer'

import { View } from 'react-native'
import { useAuth } from '../contexts/auth'
import { colors } from '../config/styles'
import { DrawerHeader } from '../components/DrawerHeader'
import { DashboardStack } from './DashboardStack'

const { Navigator, Screen } = createDrawerNavigator()

function CustomDrawerContent (props: DrawerContentComponentProps) {
  const { signOut } = useAuth()

  const options = useMemo(() => {
    const key = Object.keys(props.descriptors)[0]
    return props.descriptors[key].options
  }, [props.descriptors])

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <DrawerHeader />
      <View style={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem
        {...options}
        labelStyle={options.drawerLabelStyle}
        style={options.drawerItemStyle}
        label="Sair"
        onPress={signOut}
      />
    </DrawerContentScrollView>
  )
}

export const AuthenticatedDrawer = () => {
  return (
    <Navigator
      screenOptions={{
        headerTitle: '',
        drawerLabelStyle: { fontFamily: 'regular' },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: 'transparent',
        drawerItemStyle: { borderRadius: 0, marginHorizontal: 0 }
      }}
      drawerContent={CustomDrawerContent}
    >
      <Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
    </Navigator>
  )
}
