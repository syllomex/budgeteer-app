import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: colors['background-light'],

    paddingHorizontal: rem(1.6),
    paddingVertical: rem(1),
    marginBottom: rem(1.6),
    borderRadius: rem(0.4)
  },
  row: {
    flexDirection: 'row'
  }
})

export default styles
