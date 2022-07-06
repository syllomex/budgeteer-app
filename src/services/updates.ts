/* global __DEV__ */

import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

export const useUpdates = () => {
  const [isDone, setDone] = useState(false)

  useEffect(() => {
    if (isDone) return

    const timeout = setTimeout(() => {
      setDone(true)
    }, 1000 * 30) // 30 seconds

    return () => clearTimeout(timeout)
  }, [isDone])

  useEffect(() => {
    ;(async () => {
      try {
        if (__DEV__) return setDone(true)

        const result = await Updates.checkForUpdateAsync()
        if (!result.isAvailable) return setDone(true)

        await Updates.fetchUpdateAsync()
        Updates.reloadAsync()
      } catch (err) {
        setDone(true)
      }
    })()
  }, [])

  return { isDone }
}
