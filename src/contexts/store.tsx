import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState
} from 'react'
import { getCurrentMonth } from '../utils/month'
import { SetState } from '../utils/types'

const Store = createContext(
  {} as {
    monthId?: string
    setMonthId?: SetState<string>
    month: string
    setMonth: SetState<string>
  }
)

export const StoreProvider: FunctionComponent = ({ children }) => {
  const [monthId, setMonthId] = useState<string>()
  const [month, setMonth] = useState(getCurrentMonth())

  return (
    <Store.Provider value={{ monthId, setMonthId, month, setMonth }}>
      {children}
    </Store.Provider>
  )
}

export const useStore = () => {
  return useContext(Store)
}
