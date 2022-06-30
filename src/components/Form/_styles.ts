import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const formStyles = StyleSheet.create({
  container: {
    borderRadius: 6,
    padding: rem(0.8),
    borderWidth: rem(0.1),
    borderColor: colors['border-line'],
    backgroundColor: colors['background-light']
  },
  inputText: {
    fontFamily: 'regular',
    fontSize: rem(1.4),
    color: colors['text-neutral']
  },
  placeholder: {
    color: colors.placeholder
  }
})

export default formStyles
