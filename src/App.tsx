import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
  JosefinSans_400Regular_Italic
} from '@expo-google-fonts/josefin-sans'
import AppLoading from 'expo-app-loading'
import { AuthProvider } from './contexts/auth'
import { RootStack } from './routes/RootStack'
import { Toast } from './components/Toast'
import { StoreProvider } from './contexts/store'

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID
})

const AppComponent = () => {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <RootStack />
        <Toast />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  )
}

export default function App () {
  const [fontsLoaded] = useFonts({
    regular: JosefinSans_400Regular,
    medium: JosefinSans_500Medium,
    semiBold: JosefinSans_600SemiBold,
    bold: JosefinSans_700Bold,
    italic: JosefinSans_400Regular_Italic
  })

  if (!fontsLoaded) return <AppLoading />

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <StoreProvider>
            <AppComponent />
          </StoreProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
