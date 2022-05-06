import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: rem(2),
    paddingVertical: rem(1.6),
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIconContainer: {
    marginRight: rem(0.8)
  },
  itemTextContainer: {
    flex: 1
  }
})

export default styles
