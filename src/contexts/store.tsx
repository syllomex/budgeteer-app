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
import { PropType, SetState } from '../utils/types'
import {
  GetMonthlySummaryQuery,
  useGetMonthlySummaryQuery
} from '../graphql/generated/graphql'
import {
  ExpenditureForm,
  ExpenditureFormHandles
} from '../components/ExpenditureForm'
import { colors } from '../config/styles'
import {
  MonthlyExpenditureForm,
  MonthlyExpenditureFormHandles
} from '../components/ExpenditureMonthlyForm'
import {
  MonthlyIncomingForm,
  MonthlyIncomingFormHandles
} from '../components/MonthlyIncomingForm'
import { useAuth } from './auth'

const Store = createContext(
  {} as {
    month: string
    setMonth: SetState<string>
    openCategoryModal(args?: { categoryId?: string }): void
    closeCategoryModal(): void
    openExpenditureModal?: PropType<ExpenditureFormHandles, 'open'>
    closeExpenditureModal?: PropType<ExpenditureFormHandles, 'close'>
    openExpenditureMonthlyModal?: PropType<
      MonthlyExpenditureFormHandles,
      'open'
    >
    closeExpenditureMonthlyModal?: PropType<
      MonthlyExpenditureFormHandles,
      'close'
    >
    monthlyIncomingForm: React.RefObject<MonthlyIncomingFormHandles>
    data: GetMonthlySummaryQuery | undefined
    refetch(): Promise<GetMonthlySummaryQuery>
    refreshing: boolean
    fetching: boolean
  }
)

export const StoreProvider: FunctionComponent = ({ children }) => {
  const categoryModalRef = useRef<Modalize>(null)
  const expenditureFormRef = useRef<ExpenditureFormHandles>(null)
  const monthlyExpenditureFormRef = useRef<ExpenditureFormHandles>(null)
  const monthlyIncomingForm = useRef<MonthlyIncomingFormHandles>(null)

  const [month, setMonth] = useState(getCurrentMonth())
  const [editingCategoryId, setEditingCategoryId] = useState<string>()

  const { user, refreshToken } = useAuth()
  const { data, refetch, networkStatus } = useGetMonthlySummaryQuery({
    skip: !refreshToken,
    variables: { yearMonth: month },
    fetchPolicy: 'cache-and-network'
  })

  const openCategoryModal = useCallback((args?: { categoryId?: string }) => {
    setEditingCategoryId(args?.categoryId)
    categoryModalRef.current?.open()
  }, [])

  const closeCategoryModal = useCallback(() => {
    setEditingCategoryId(undefined)
    categoryModalRef.current?.close()
  }, [])

  const openExpenditureModal = useCallback(props => {
    expenditureFormRef.current?.open(props)
  }, [])

  const closeExpenditureModal = useCallback(() => {
    expenditureFormRef.current?.close()
  }, [])

  const openExpenditureMonthlyModal = useCallback(props => {
    monthlyExpenditureFormRef.current?.open(props)
  }, [])

  const closeExpenditureMonthlyModal = useCallback(() => {
    monthlyExpenditureFormRef.current?.close()
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
        openExpenditureModal,
        closeExpenditureModal,
        openExpenditureMonthlyModal,
        closeExpenditureMonthlyModal,
        monthlyIncomingForm,
        data,
        refetch: async () => {
          return (await refetch()).data
        },
        refreshing: networkStatus === NetworkStatus.refetch,
        fetching: !!data && networkStatus === NetworkStatus.setVariables
      }}
    >
      {children}

      <Modalize
        ref={categoryModalRef}
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
        overlayStyle={{ backgroundColor: colors.overlay }}
      >
        <CategoryForm
          yearMonth={month}
          closeCategoryModal={closeCategoryModal}
          categoryId={editingCategoryId}
        />
      </Modalize>

      <ExpenditureForm ref={expenditureFormRef} yearMonth={month} />
      <MonthlyExpenditureForm
        ref={monthlyExpenditureFormRef}
        yearMonth={month}
      />
      <MonthlyIncomingForm ref={monthlyIncomingForm} yearMonth={month} />
    </Store.Provider>
  )
}

export const useStore = () => {
  const store = useContext(Store)
  const { setMonth, month } = store

  const goToNextMonth = useCallback(() => {
    setMonth(cur => {
      const current = getDateByMonth(cur)
      const next = addMonths(current, 1)
      return getCurrentMonth(next)
    })
  }, [setMonth])

  const goToPrevMonth = useCallback(() => {
    setMonth(cur => {
      const current = getDateByMonth(cur)
      const prev = subMonths(current, 1)
      return getCurrentMonth(prev)
    })
  }, [setMonth])

  return { ...store, goToNextMonth, goToPrevMonth, yearMonth: month }
}

export type Expenditure = {
  id: string
  date?: string
  description?: string
  value: number
  createdAt: string
}
