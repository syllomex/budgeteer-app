import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Modalize } from 'react-native-modalize'

import { addMonths, subMonths } from 'date-fns'
import { NetworkStatus } from '@apollo/client'
import { CategoryForm } from '../components/CategoryForm'
import { getCurrentMonth, getDateByMonth } from '../utils'
import { SetState } from '../utils/types'
import {
  GetMonthlySummaryQuery,
  useGetMonthlySummaryQuery
} from '../graphql/generated/graphql'
import { useAuth } from './auth'

const Store = createContext(
  {} as {
    month: string
    setMonth: SetState<string>
    openCategoryModal(): void
    closeCategoryModal(): void
    data: GetMonthlySummaryQuery | undefined
    refetch(): Promise<GetMonthlySummaryQuery>
    refreshing: boolean
    fetching: boolean
  }
)

export const StoreProvider: FunctionComponent = ({ children }) => {
  const categoryModalRef = useRef<Modalize>(null)

  const [month, setMonth] = useState(getCurrentMonth())

  const { user, idToken } = useAuth()
  const { data, refetch, networkStatus } = useGetMonthlySummaryQuery({
    skip: !idToken,
    variables: { yearMonth: month },
    fetchPolicy: 'cache-and-network'
  })

  const openCategoryModal = useCallback(() => {
    categoryModalRef.current?.open()
  }, [])

  const closeCategoryModal = useCallback(() => {
    categoryModalRef.current?.close()
  }, [])

  useEffect(() => {
    if (!user) setMonth(getCurrentMonth())
  }, [user])

  return (
    <Store.Provider
      value={{
        month,
        setMonth,
        openCategoryModal,
        closeCategoryModal,
        data,
        refetch: async () => {
          return (await refetch()).data
        },
        refreshing:
          networkStatus === NetworkStatus.refetch,
        fetching: !!data && networkStatus === NetworkStatus.setVariables
      }}
    >
      {children}

      <Modalize
        ref={categoryModalRef}
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
      >
        <CategoryForm
          yearMonth={month}
          closeCategoryModal={closeCategoryModal}
        />
      </Modalize>
    </Store.Provider>
  )
}

export const useStore = () => {
  const store = useContext(Store)
  const { setMonth, month } = store

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

  return { ...store, goToNextMonth, goToPrevMonth, yearMonth: month }
}

export type Expenditure = {
  id: string
  date?: string
  description?: string
  value: number
  createdAt: string
}
