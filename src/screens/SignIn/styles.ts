import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-light'],
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center'
  },
  logoImage: {
    marginBottom: rem(0.8)
  },
  buttonContainer: {
    padding: rem(0.8),
    borderWidth: 1,
    borderColor: colors['border-line'],
    borderRadius: rem(0.4),
    backgroundColor: colors['background-light'],
    flexDirection: 'row',
    alignItems: 'center'
  },
  googleIcon: {
    width: rem(2.4),
    height: rem(2.4),
    borderRadius: rem(1.2)
  },
  buttonImage: {
    width: rem(3.6),
    height: rem(3.6),
    borderRadius: rem(1.8),
    marginRight: rem(0.8)
  },
  revokeContainer: {
    marginTop: rem(1.6)
  },
  footer: {
    justifyContent: 'flex-end',
    paddingBottom: rem(1.6),
    flex: 0.8
  }
})

export default styles
