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

type GoogleUser = {
  displayName: string
  uid: string
  email: string
  photoURL: string
}

type User = GoogleUser

interface AuthContext {
  user: User | null | undefined
  setUser: SetState<User | null>
  initializing: boolean
  setInitializing: SetState<boolean>
  loading: boolean
  setLoading: SetState<boolean>
}

const Auth = createContext({} as AuthContext)

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  const onAuthStateChanged = useCallback(
    user => {
      setUser(user)
      if (initializing) setInitializing(false)
    },
    [initializing]
  )

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [onAuthStateChanged])

  return (
    <Auth.Provider
      value={{
        user,
        setUser,
        initializing,
        setInitializing,
        loading,
        setLoading
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
          <ActivityIndicator size="large" color="blue" />
        </View>
      </Modal>
      {children}
    </Auth.Provider>
  )
}

export const useAuth = () => {
  const { user, setLoading } = useContext(Auth)

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

  const signOut = useCallback(() => {
    auth().signOut()
  }, [])

  return {
    signIn,
    signOut,
    user
  }
}
