import { StyleSheet } from 'react-native'
import { colors, rem } from '../../../config/styles'

const styles = StyleSheet.create({
  label: {
    fontFamily: 'medium',
    fontSize: rem(1.4),
    color: colors['text-neutral'],
    marginBottom: rem(0.8)
  }
})

export default styles
