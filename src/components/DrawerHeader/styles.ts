import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    padding: rem(0.8)
  },
  row: {
    flexDirection: 'row'
  },
  picture: {
    width: rem(6.4),
    height: rem(6.4),
    borderRadius: rem(3.2)
  },
  infoContainer: {
    paddingLeft: rem(0.8),
    flex: 1
  }
})

export default styles
