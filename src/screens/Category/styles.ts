import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-light']
  },
  contentContainer: {
    paddingHorizontal: rem(2),
    paddingTop: rem(3)
  }
})

export default styles
