import { StyleSheet } from 'react-native'
import { rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    paddingVertical: rem(0.8)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default styles
