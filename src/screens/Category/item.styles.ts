import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    backgroundColor: colors['background-light'],

    paddingHorizontal: rem(1.6),
    paddingVertical: rem(1.6)
  },
  checkBoxContainer: {
    marginLeft: rem(-0.6)
  },
  expenditureContainer: {
    flex: 1,
    paddingLeft: rem(0.6)
  },
  row: {
    flexDirection: 'row'
  }
})

export default styles
