import Toast from 'react-native-toast-message'

export const showMessage = ({
  message,
  type,
  description
}: {
  message: string
  type?: 'success' | 'error'
  description?: string
}) => {
  Toast.show({ text1: message, type: type ?? 'success', text2: description })
}
