import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { ActivityIndicator, Modal, View } from 'react-native'

import { SetState } from '../utils/types'
import { colors } from '../config/styles'
import { setAuthorization } from '../services/graphql'
import { useSignInQuery } from '../graphql/generated/graphql'

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
  idToken: Nullable<string>
  setIdToken: SetState<Nullable<string>>
  initializing: boolean
  setInitializing: SetState<boolean>
  loading: boolean
  setLoading: SetState<boolean>
  currentUser: Nullable<User>
  setCurrentUser: SetState<Nullable<User>>
}

const Auth = createContext({} as AuthContext)

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<Nullable<User>>()
  const [idToken, setIdToken] = useState<Nullable<string>>()
  const [currentUser, setCurrentUser] = useState<Nullable<User>>()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [gettingTokens, setGettingTokens] = useState(false)

  const { data } = useSignInQuery({
    variables: {
      data: { googleId: user?.id as string, idToken: idToken as string }
    },
    skip: !user?.id || !idToken,
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
    ;(async () => {
      if (idToken) return
      if (gettingTokens) return
      if (!user) return

      setGettingTokens(true)
      const tokens = await GoogleSignin.getTokens()
      setIdToken(tokens.idToken)
      setGettingTokens(false)
    })()
  }, [gettingTokens, idToken, user])

  useEffect(() => {
    if (!idToken) return
    setAuthorization(idToken)
  }, [idToken])

  return (
    <Auth.Provider
      value={{
        user: data ? user : undefined,
        setUser,
        idToken,
        setIdToken,
        initializing,
        setInitializing,
        loading,
        setLoading,
        currentUser,
        setCurrentUser
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
    idToken,
    setIdToken
  } = useContext(Auth)

  const signIn = useCallback(async () => {
    setLoading(true)

    try {
      const { idToken, user } = await GoogleSignin.signIn()
      setIdToken(idToken)
      setUser(user)
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      // return auth().signInWithCredential(googleCredential)
    } catch (err) {
      setUser(null)
    }
  }, [setIdToken, setLoading, setUser])

  const revokeAndSignIn = useCallback(async () => {
    try {
      setLoading(true)
      setCurrentUser(undefined)
      setIdToken(null)
      await GoogleSignin.revokeAccess()
    } catch (err) {
      //
    }

    await signIn()
  }, [setCurrentUser, setIdToken, setLoading, signIn])

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  return {
    signIn,
    signOut,
    user: idToken ? user : undefined,
    currentUser,
    revokeAndSignIn,
    idToken
  }
}
