import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { ActivityIndicator, Modal, View } from 'react-native'

import { SetState } from '../utils/types'
import { colors } from '../config/styles'
import { setAuthorization } from '../services/graphql'
import {
  useGetGoogleRefreshTokenLazyQuery,
  useSignInQuery
} from '../graphql/generated/graphql'
import { showMessage } from '../utils'
import { useStorage } from '../services/storage'

type User = {
  id: string
  name: string | null
  email: string
  photo: string | null
  familyName: string | null
  givenName: string | null
}

type Nullable<T> = T | null | undefined

interface AuthContext {
  user: Nullable<User>
  setUser: SetState<Nullable<User>>
  refreshToken: Nullable<string>
  setRefreshToken: SetState<Nullable<string>>
  initializing: boolean
  setInitializing: SetState<boolean>
  loading: boolean
  setLoading: SetState<boolean>
  currentUser: Nullable<User>
  setCurrentUser: SetState<Nullable<User>>
  storedToken: Nullable<{ refreshToken: string }>
  setStoredToken: SetState<Nullable<{ refreshToken: string }>>
}

const Auth = createContext({} as AuthContext)

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<Nullable<User>>()
  const [refreshToken, setRefreshToken] = useState<Nullable<string>>()
  const [currentUser, setCurrentUser] = useState<Nullable<User>>()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  const [storedToken, setStoredToken] = useStorage<{
    refreshToken: string
  }>('@budgeteer:google-refresh-token')

  const { data } = useSignInQuery({
    variables: {
      data: {
        googleId: user?.id as string,
        refreshToken: refreshToken as string
      }
    },
    skip: !user?.id || !refreshToken,
    onCompleted () {
      setLoading(false)
      setInitializing(false)
    }
  })

  useEffect(() => {
    ;(async () => {
      try {
        const _currentUser = await GoogleSignin.getCurrentUser()
        if (!_currentUser) throw new Error()
        setCurrentUser(_currentUser?.user)
      } catch (err) {
        setCurrentUser(undefined)
      }
    })()
  }, [user])

  useEffect(() => {}, [])

  useEffect(() => {
    if (!refreshToken) return
    setAuthorization(refreshToken)
  }, [refreshToken])

  return (
    <Auth.Provider
      value={{
        user: data ? user : undefined,
        setUser,
        refreshToken,
        setRefreshToken,
        initializing,
        setInitializing,
        loading,
        setLoading,
        currentUser,
        setCurrentUser,
        storedToken,
        setStoredToken
      }}
    >
      <Modal visible={loading} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Modal>

      {children}
    </Auth.Provider>
  )
}

export const useAuth = () => {
  const {
    user,
    setUser,
    setLoading,
    currentUser,
    setCurrentUser,
    setRefreshToken,
    refreshToken,
    storedToken,
    setStoredToken
  } = useContext(Auth)

  const [getRefreshToken] = useGetGoogleRefreshTokenLazyQuery()

  const signIn = useCallback(async () => {
    setLoading(true)

    try {
      const showError = () => {
        showMessage({ message: 'Não foi possível conectar-se.', type: 'error' })
        setLoading(false)
        setUser(null)
      }

      GoogleSignin.configure({
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        forceCodeForRefreshToken: !storedToken,
        offlineAccess: true
      })

      const { user, serverAuthCode } = await GoogleSignin.signIn()

      if (!serverAuthCode) {
        return showError()
      }

      const refreshToken = await (async () => {
        if (storedToken) {
          return storedToken.refreshToken
        }

        const result = await getRefreshToken({
          variables: { serverAuthCode }
        })

        const resultToken = result.data?.getGoogleRefreshToken
        if (resultToken) {
          setStoredToken({ refreshToken: resultToken })
        }

        return resultToken
      })()

      if (!refreshToken) {
        return showError()
      }

      setRefreshToken(refreshToken)
      setUser(user)
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      // return auth().signInWithCredential(googleCredential)
    } catch (err) {
      setUser(null)
    }
  }, [
    getRefreshToken,
    setLoading,
    setRefreshToken,
    setStoredToken,
    setUser,
    storedToken
  ])

  const revokeAndSignIn = useCallback(async () => {
    try {
      setLoading(true)
      setCurrentUser(undefined)
      setRefreshToken(null)
      setStoredToken(null)
      await GoogleSignin.revokeAccess()
    } catch (err) {
      //
    }

    await signIn()
  }, [setCurrentUser, setLoading, setRefreshToken, setStoredToken, signIn])

  const signOut = useCallback(() => {
    setUser(null)
    setRefreshToken(null)
  }, [setRefreshToken, setUser])

  return {
    signIn,
    signOut,
    user: refreshToken ? user : undefined,
    currentUser,
    revokeAndSignIn,
    refreshToken
  }
}
