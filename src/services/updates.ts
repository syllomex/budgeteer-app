/* global __DEV__ */

import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

export const useUpdates = () => {
  const [isDone, setDone] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (__DEV__) return setDone(true)

      const result = await Updates.checkForUpdateAsync()
      if (!result.isAvailable) return setDone(true)

      await Updates.fetchUpdateAsync()
      Updates.reloadAsync()
    })()
  }, [])

  return { isDone }
}
