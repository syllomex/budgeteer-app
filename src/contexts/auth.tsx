import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { ActivityIndicator, Modal, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'

import { SetState } from '../utils/types'
import { colors } from '../config/styles'

type GoogleUser = {
  displayName: string
  uid: string
  email: string
  photoURL: string
}

type CurrentUser = {
  name: string
  photo?: string
}

type User = GoogleUser

interface AuthContext {
  user: User | null | undefined
  setUser: SetState<User | null>
  initializing: boolean
  setInitializing: SetState<boolean>
  loading: boolean
  setLoading: SetState<boolean>
  currentUser?: CurrentUser
  setCurrentUser: SetState<CurrentUser | undefined>
}

const Auth = createContext({} as AuthContext)

export const AuthProvider: PropsWithChildren<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>()

  const onAuthStateChanged = useCallback(
    user => {
      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        })
      } else {
        setUser(undefined)
      }
      if (initializing) setInitializing(false)
    },
    [initializing]
  )

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [onAuthStateChanged])

  useEffect(() => {
    ;(async () => {
      try {
        const _currentUser = await GoogleSignin.getCurrentUser()
        setCurrentUser(_currentUser.user)
      } catch (err) {
        setCurrentUser(undefined)
      }
    })()
  }, [user])

  useEffect(() => {
    if (!user) return
    firestore().collection('users').doc(user.uid).set(user, { merge: true })
  }, [user])

  return (
    <Auth.Provider
      value={{
        user,
        setUser,
        initializing,
        setInitializing,
        loading,
        setLoading,
        currentUser,
        setCurrentUser
      }}
    >
      <Modal visible={loading || initializing} animationType="fade" transparent>
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
  const { user, setLoading, currentUser, setCurrentUser } = useContext(Auth)

  const signIn = useCallback(async () => {
    setLoading(true)

    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      return auth().signInWithCredential(googleCredential)
    } catch (err) {
      //
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  const revokeAndSignIn = useCallback(async () => {
    try {
      setLoading(true)
      setCurrentUser(undefined)
      await GoogleSignin.revokeAccess()
    } catch (err) {
      //
    }

    await signIn()
  }, [setCurrentUser, setLoading, signIn])

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  return {
    signIn,
    signOut,
    user,
    currentUser,
    revokeAndSignIn
  }
}
