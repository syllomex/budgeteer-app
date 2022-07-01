import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  monthSelectorContainer: {
    alignItems: 'center'
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rem(2.4)
  },
  arrowContainer: {
    padding: rem(0.8)
  },
  monthSelectorTextContainer: {
    alignItems: 'center',
    flex: 1
  }
})

export default styles
