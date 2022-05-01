import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'
import { Modalize } from 'react-native-modalize'
import Toast from 'react-native-toast-message'
import firestore from '@react-native-firebase/firestore'

import { CategoryForm } from '../components/CategoryForm'
import { getCurrentMonth } from '../utils/month'
import { SetState } from '../utils/types'
import { useAuth } from './auth'

const Store = createContext(
  {} as {
    monthId?: string
    setMonthId?: SetState<string>
    month: string
    setMonth: SetState<string>
    openCategoryModal(): void
  }
)

export const StoreProvider: FunctionComponent = ({ children }) => {
  const { user } = useAuth()

  const categoryModalRef = useRef<Modalize>(null)

  const [monthId, setMonthId] = useState<string>()
  const [month, setMonth] = useState(getCurrentMonth())

  const openCategoryModal = useCallback(() => {
    categoryModalRef.current.open()
  }, [])

  const submitCategory = useCallback(
    async formData => {
      if (!monthId) return
      if (!formData.name) return
      if (!user) return

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('months')
        .doc(monthId)
        .collection('categories')
        .add({ typename: 'Category', ...formData })

      Toast.show({ type: 'success', text1: 'Categoria adicionada!' })
      categoryModalRef.current.close()
    },
    [monthId, user]
  )

  return (
    <Store.Provider
      value={{ monthId, setMonthId, month, setMonth, openCategoryModal }}
    >
      {children}

      <Modalize
        ref={categoryModalRef}
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
      >
        <CategoryForm onSubmit={submitCategory} />
      </Modalize>
    </Store.Provider>
  )
}

export const useStore = () => {
  return useContext(Store)
}
