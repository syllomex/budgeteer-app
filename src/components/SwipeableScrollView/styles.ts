import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const size = rem(4)

export const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    width: size,
    height: size,
    top: '40%',
    zIndex: 10,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatingLeft: {
    left: 0
  },
  floatingRight: {
    right: 0
  }
})
