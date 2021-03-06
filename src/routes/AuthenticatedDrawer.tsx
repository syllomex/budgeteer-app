import React, { useMemo } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer'

import { TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/auth'
import { Color, colors, rem } from '../config/styles'
import { DrawerHeader } from '../components/DrawerHeader'
import { T } from '../components/T'
import { getCurrentYearMonth, monetize } from '../utils'
import { useLoadingText } from '../components/Loading'
import { useGetAvailableBudgetQuery } from '../graphql/generated/graphql'
import { Hideable } from '../components/Hideable'
import { useStore } from '../contexts/store'
import { DashboardStack } from './DashboardStack'
import { IncomingStack } from './IncomingStack'

const { Navigator, Screen } = createDrawerNavigator()

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
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

const HeaderRight = () => {
  const { hideValues, setHideValues } = useStore()

  const { data } = useGetAvailableBudgetQuery({
    variables: { yearMonth: getCurrentYearMonth() }
  })

  const loadingText = useLoadingText({ enabled: !data, text: 'Carregando' })

  const color = useMemo((): Color => {
    if (!data) return 'muted'
    if (data.availableBudget >= 0) return 'primary'
    return 'danger'
  }, [data])

  return (
    <View style={{ paddingRight: rem(1.6) }}>
      <View>
        <T size={1} style={{ textAlign: 'right' }} color="muted">
          Esse m??s
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginRight: rem(0.8) }}
            onPress={() => setHideValues(cur => !cur)}
          >
            <Ionicons
              name={hideValues ? 'eye-off-outline' : 'eye-outline'}
              color={colors['border-line']}
              size={rem(2)}
            />
          </TouchableOpacity>
          <Hideable color={color} size={1.8}>
            {data ? monetize(data?.availableBudget) : loadingText}
          </Hideable>
        </View>
      </View>
    </View>
  )
}

export const AuthenticatedDrawer = () => {
  return (
    <Navigator
      useLegacyImplementation
      screenOptions={{
        headerTitle: '',
        drawerLabelStyle: { fontFamily: 'regular' },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: 'transparent',
        drawerItemStyle: { borderRadius: 0, marginHorizontal: 0 },
        drawerType: 'back',
        headerRight: () => <HeaderRight />,
        headerStyle: {
          borderBottomWidth: 1,
          elevation: 0,
          borderBottomColor: colors['background-matte']
        }
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Screen
        name="IncomingStack"
        component={IncomingStack}
        options={{ title: 'Rendimentos' }}
      />
    </Navigator>
  )
}
