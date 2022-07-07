import React, { FunctionComponent } from 'react'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { T } from '../T'
import { colors, rem } from '../../config/styles'
import { styles } from './styles'

const CustomStackHeader: FunctionComponent<NativeStackHeaderProps> = ({
  navigation,
  options
}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerLeftContainer}
        onPress={navigation.goBack}
      >
        <MaterialIcons
          name="arrow-back"
          size={rem(2.4)}
          color={colors['text-neutral']}
        />
      </TouchableOpacity>
      <View style={styles.headerCenterContainer}>
        <T font="semiBold" color="text-neutral" numberOfLines={1} size={1.6}>
          {options.title}
        </T>
      </View>
      <View style={styles.headerRightContainer} />
    </SafeAreaView>
  )
}

export const renderCustomStackHeader = (props: NativeStackHeaderProps) => {
  return <CustomStackHeader {...props} />
}
