import React from 'react'
import { TouchableOpacity } from 'react-native'
import { colors, rem } from '../../config/styles'

interface IconProps {
  color: string
  size: number
}

interface FloatingButtonProps {
  onPress?: () => void | Promise<void>
  icon?: (props: IconProps) => JSX.Element
}

export const FloatingButton: React.FunctionComponent<FloatingButtonProps> = ({
  onPress,
  icon
}) => {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: rem(2),
        right: rem(2),
        width: rem(4.8),
        height: rem(4.8),
        borderRadius: rem(1.2),
        backgroundColor: colors.primary,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPress={onPress}
    >
      {icon?.({ color: colors['text-in-primary'], size: rem(3.6) })}
    </TouchableOpacity>
  )
}
