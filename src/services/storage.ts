import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { SetState } from '../utils'

type Storage<T> = [
  T | null | undefined,
  SetState<T | null | undefined>,
  { initialized: boolean }
]

export const useStorage = <T = any>(key: string): Storage<T> => {
  const { getItem, setItem } = useAsyncStorage(key)

  const [initialized, setInitialized] = useState(false)
  const [data, setData] = useState<T | null>()

  // Initialize
  useEffect(() => {
    if (initialized) return

    const initialize = async () => {
      const item = await getItem()
      setData(item ? JSON.parse(item) : null)

      setInitialized(true)
    }

    initialize()
  }, [getItem, initialized])

  // Save data every time it changes
  useEffect(() => {
    if (!initialized) return
    setItem(JSON.stringify(data))
  }, [data, initialized, setItem])

  return [data, setData, { initialized }]
}
