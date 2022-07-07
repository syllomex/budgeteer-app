import { StyleSheet } from 'react-native'
import { colors, rem } from '../../config/styles'

export const styles = StyleSheet.create({
  headerContainer: {
    height: rem(8.4),
    backgroundColor: colors['background-light'],
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors['background-matte']
  },
  headerLeftContainer: {
    paddingHorizontal: rem(1)
  },
  headerRightContainer: {
    paddingHorizontal: rem(1)
  },
  headerCenterContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center'
  }
})
