import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors['background-light'] },
  itemContainer: {
    flexDirection: 'row',
    marginTop: rem(1.6)
  },
  description: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: rem(2)
  }
})

export default styles
