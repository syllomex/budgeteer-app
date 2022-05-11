import React from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'
import { colors } from '../../config/styles'

export const LoadingIndicator = () => {
  return <ActivityIndicator size="large" color={colors.primary} />
}

export const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  if (!visible) return null
  return (
    <Modal transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LoadingIndicator />
      </View>
    </Modal>
  )
}
