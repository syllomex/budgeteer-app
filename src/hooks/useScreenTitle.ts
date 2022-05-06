import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

export const useScreenTitle = (title?: string) => {
  const { setOptions } = useNavigation()

  useEffect(() => {
    if (title === undefined) return
    setOptions({ title })
  }, [setOptions, title])
}
