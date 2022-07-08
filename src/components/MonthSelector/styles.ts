import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

const styles = StyleSheet.create({
  monthSelectorContainer: {
    alignItems: 'center',
    marginTop: rem(2)
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
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  monthInfoContainer: {
    borderBottomWidth: 1,
    paddingTop: rem(1),
    paddingBottom: rem(2),
    borderColor: colors['background-matte'],
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  monthInfoColumn: {
    flex: 1,
    alignItems: 'center'
  }
})

export default styles
