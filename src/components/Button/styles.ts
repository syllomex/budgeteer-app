import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: rem(3),
    alignItems: 'center',
    justifyContent: 'center',
    padding: rem(1.6),
    paddingVertical: rem(1.2)
  },
  text: {
    color: colors['text-in-primary'],
    fontFamily: 'medium',
    fontSize: rem(1.4)
  }
})

export default styles
