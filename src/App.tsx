import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppLoading from 'expo-app-loading'
import { AuthProvider } from './contexts/auth'
import { RootStack } from './routes/RootStack'
import { Toast } from './components/Toast'
import { StoreProvider } from './contexts/store'
import { useConfigureFonts } from './config/fonts'

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true
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
  const { fontsLoaded } = useConfigureFonts()

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
