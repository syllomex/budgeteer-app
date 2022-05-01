import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  monthSelectorContainer: {
    alignItems: 'center'
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowContainer: {
    padding: rem(0.8)
  },
  monthSelectorTextContainer: {
    alignItems: 'center'
  }
})

export default styles
