import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-light']
  },
  contentContainer: {},
  categoriesContainer: {
    paddingVertical: rem(2.4)
  }
})

export default styles
