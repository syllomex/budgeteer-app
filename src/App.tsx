import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Button, Text, View } from 'react-native'
import { AuthProvider, useAuth } from './contexts/auth'

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID
})

const AppComponent = () => {
  const { signIn, signOut, user } = useAuth()

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {!user
        ? (
        <>
          <Text>Hello! Sign in now!</Text>
          <Button onPress={signIn} title="SignIn" />
        </>
          )
        : (
        <>
          <Text>Welcome, {user.displayName}</Text>
          <Button onPress={signOut} title="SignOut" />
        </>
          )}

      <StatusBar style="auto" />
    </View>
  )
}

export default function App () {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  )
}
