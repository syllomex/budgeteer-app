import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    marginRight: rem(-1)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  iconContainer: {
    paddingTop: rem(1.3),
    paddingBottom: rem(1.1),
    paddingHorizontal: rem(1),
    alignItems: 'flex-end'
  }
})

export default styles
