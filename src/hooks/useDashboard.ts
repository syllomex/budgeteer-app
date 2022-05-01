import firestore from '@react-native-firebase/firestore'
import { addMonths, subMonths } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/auth'
import { useStore } from '../contexts/store'
import { getCurrentMonth, getDateByMonth } from '../utils/month'

export const userStore = (userId: string) =>
  firestore().collection('users').doc(userId)

export const useDashboard = () => {
  const { user } = useAuth()

  const { monthId, setMonthId, month, setMonth } = useStore()
  const [isMonthInit, setMonthInit] = useState(false)
  const [categories, setCategories] =
    useState<{ uid: string; name: string }[]>()

  useEffect(() => {
    setCategories(undefined)
  }, [month])

  const initMonth = useCallback(async () => {
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
  }, [month, setMonthId, user.uid])

  const initCategories = useCallback(() => {
    const subscriber = userStore(user.uid)
      .collection('months')
      .doc(monthId)
      .collection('categories')
      .onSnapshot(async snapshot => {
        const arr = []

        await Promise.all(
          snapshot.docs.map(async doc => {
            const data = {
              uid: doc.id,
              name: doc.data().name
            }

            arr.push(data)
          })
        )

        setCategories(arr)
      })

    return subscriber
  }, [monthId, user.uid])

  useEffect(() => {
    initMonth()
  }, [initMonth])

  useEffect(() => {
    if (!isMonthInit) return
    const subscriber = initCategories()
    return subscriber
  }, [initCategories, isMonthInit])

  const goToNextMonth = useCallback(() => {
    const current = getDateByMonth(month)
    const next = addMonths(current, 1)
    setMonth(getCurrentMonth(next))
  }, [month, setMonth])

  const goToPrevMonth = useCallback(() => {
    const current = getDateByMonth(month)
    const prev = subMonths(current, 1)
    setMonth(getCurrentMonth(prev))
  }, [month, setMonth])

  const getCategoryExpendituresRef = useCallback(
    (categoryId: string) => {
      return userStore(user.uid)
        .collection('months')
        .doc(monthId)
        .collection('categories')
        .doc(categoryId)
        .collection('expenditures')
    },
    [monthId, user.uid]
  )

  return {
    month,
    categories,
    goToNextMonth,
    goToPrevMonth,
    monthId,
    getCategoryExpendituresRef
  }
}
