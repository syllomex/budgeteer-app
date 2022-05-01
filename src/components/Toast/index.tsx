import React from 'react'
import RNToast, { SuccessToast, ToastConfig } from 'react-native-toast-message'
import { colors } from '../../config/styles'

const toastConfig: ToastConfig = {
  success: params => (
    <SuccessToast
      {...params}
      style={{ borderLeftColor: colors.primary }}
      text1Style={{
        fontSize: 14,
        fontFamily: 'medium',
        color: colors['text-neutral']
      }}
    />
  )
}

export const Toast = () => {
  return <RNToast config={toastConfig} />
}
