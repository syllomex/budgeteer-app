import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'
import { colors, rem } from '../../config/styles'

export const useLoadingText = ({
  enabled,
  text
}: {
  enabled: boolean
  text: string
}) => {
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      setCount(current => {
        const next = (current += 1)
        return next === 4 ? 1 : next
      })
    }, 300)

    return () => clearInterval(interval)
  }, [enabled])

  return `${text}${new Array(count).fill('.').join('')}`
}

export const LoadingIndicator = ({
  size = 'large',
  spaced
}: {
  size?: 'large' | 'small'
  spaced?: boolean
}) => {
  return (
    <ActivityIndicator
      size={size}
      color={colors.primary}
      style={[spaced && { marginVertical: rem(3) }]}
    />
  )
}

export const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  if (!visible) return null
  return (
    <Modal transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LoadingIndicator />
      </View>
    </Modal>
  )
}
