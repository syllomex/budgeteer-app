import React from 'react'
import { Image, Linking, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { T } from '../../components/T'
import { useAuth } from '../../contexts/auth'
import google from '../../assets/images/google.png'
import logo from '../../assets/images/logo.png'

import styles from './styles'

export const SignIn = () => {
  const { currentUser, signIn, revokeAndSignIn } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, styles.logoContainer]}>
        <Image source={logo} style={styles.logoImage} />
        <T s={2.2} f="bold" c="primary">
          Budgeteer
        </T>
      </View>

      <View style={[styles.container, { flex: 0 }]}>
        <TouchableOpacity onPress={signIn} style={styles.buttonContainer}>
          <Image
            style={[styles.buttonImage, !currentUser && styles.googleIcon]}
            source={currentUser?.photo ? { uri: currentUser.photo } : google}
          />
          <T>
            {currentUser
              ? `Continuar como ${currentUser.name}`
              : 'Entrar com Google'}
          </T>
        </TouchableOpacity>

        {!!currentUser && (
          <TouchableOpacity
            onPress={revokeAndSignIn}
            style={styles.revokeContainer}
          >
            <T>Não é você? Entre com outra conta</T>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.container, styles.footer]}>
        <T
          c="primary"
          s={1.2}
          onPress={() =>
            Linking.openURL('https://www.linkedin.com/in/leojsantos/')
          }
        >
          Desenvolvido por{' '}
          <T c="primary" f="semiBold" s={1.2}>
            Leonardo Santos
          </T>
        </T>
      </View>
    </SafeAreaView>
  )
}
