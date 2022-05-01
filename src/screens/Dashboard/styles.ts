import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-light']
  },
  contentContainer: {
    padding: rem(2)
  },
  categoriesContainer: {
    paddingVertical: rem(2.4)
  },
  noDataContainer: {
    alignItems: 'center',
    paddingTop: rem(5.6)
  }
})

export default styles
