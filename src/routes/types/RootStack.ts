import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type RootStackParamList = {
  AuthenticatedDrawer?: never
  Category: {
    category: {
      id: string
      name: string
    }
  }
}

export type RootStackRouteList = NativeStackNavigationProp<RootStackParamList>
