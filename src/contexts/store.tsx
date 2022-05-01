import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Modalize } from 'react-native-modalize'
import Toast from 'react-native-toast-message'
import firestore from '@react-native-firebase/firestore'

import { addMonths, subMonths } from 'date-fns'
import { CategoryForm } from '../components/CategoryForm'
import { getCurrentMonth, getDateByMonth } from '../utils'
import { SetState } from '../utils/types'
import { useAuth } from './auth'

type Category = { uid: string; name: string; total?: number }

const Store = createContext(
  {} as {
    monthId?: string
    setMonthId?: SetState<string>
    month: string
    setMonth: SetState<string>
    openCategoryModal(): void
    categories?: Category[]
    setCategories: SetState<Category[] | undefined>
    total: number
  }
)

export const userStore = (userId: string) =>
  firestore().collection('users').doc(userId)

export const StoreProvider: FunctionComponent = ({ children }) => {
  const { user } = useAuth()

  const categoryModalRef = useRef<Modalize>(null)

  const [monthId, setMonthId] = useState<string>()
  const [month, setMonth] = useState(getCurrentMonth())
  const [isMonthInit, setMonthInit] = useState(false)

  const [categories, setCategories] = useState<Category[]>()

  const initMonth = useCallback(async () => {
    if (!user) return
    const result = await userStore(user.uid)
      .collection('months')
      .where('month', '==', month)
      .limit(1)
      .get()

    const exists = result.docs[0]

    const createMonth = () => {
      return userStore(user.uid).collection('months').add({
        typename: 'Month',
        month
      })
    }

    const doc = exists ?? (await createMonth())

    setMonthId(doc.id)
    setMonthInit(true)
  }, [month, user])

  const initCategories = useCallback(() => {
    if (!user) return
    const subscriber = userStore(user.uid)
      .collection('months')
      .doc(monthId)
      .collection('categories')
      .orderBy('name')
      .onSnapshot(async snapshot => {
        const arr = []

        await Promise.all(
          snapshot.docs.map(async doc => {
            const data = {
              uid: doc.id,
              name: doc.data().name,
              total: doc.data().total
            }

            arr.push(data)
          })
        )

        setCategories(arr)
      })

    return subscriber
  }, [monthId, user])

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
        .add({ typename: 'Category', ...formData, total: 0 })

      Toast.show({ type: 'success', text1: 'Categoria adicionada!' })
      categoryModalRef.current.close()
    },
    [monthId, user]
  )

  useEffect(() => {
    initMonth()
  }, [initMonth])

  useEffect(() => {
    if (!isMonthInit) return
    const subscriber = initCategories()
    return subscriber
  }, [initCategories, isMonthInit])

  const total = useMemo(
    () => categories?.reduce((acc, cur) => acc + (cur.total ?? 0), 0),
    [categories]
  )

  return (
    <Store.Provider
      value={{
        monthId,
        setMonthId,
        month,
        setMonth,
        openCategoryModal,
        categories,
        setCategories,
        total
      }}
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
  const store = useContext(Store)
  const { monthId, setMonth, month, setCategories } = store
  const { user } = useAuth()

  const getCategoryExpendituresRef = useCallback(
    (categoryId: string) => {
      return firestore()
        .collection('users')
        .doc(user.uid)
        .collection('months')
        .doc(monthId)
        .collection('categories')
        .doc(categoryId)
        .collection('expenditures')
    },
    [monthId, user.uid]
  )

  const goToNextMonth = useCallback(() => {
    setCategories(undefined)

    const current = getDateByMonth(month)
    const next = addMonths(current, 1)
    setMonth(getCurrentMonth(next))
  }, [month, setCategories, setMonth])

  const goToPrevMonth = useCallback(() => {
    setCategories(undefined)

    const current = getDateByMonth(month)
    const prev = subMonths(current, 1)
    setMonth(getCurrentMonth(prev))
  }, [month, setCategories, setMonth])

  return { ...store, getCategoryExpendituresRef, goToNextMonth, goToPrevMonth }
}
