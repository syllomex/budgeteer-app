import { MaterialIcons } from '@expo/vector-icons'
import React, { FunctionComponent, useRef } from 'react'
import { Dimensions, ScrollViewProps } from 'react-native'
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import { colors, rem } from '../../config/styles'
import { styles } from './styles'

export interface SwipeableScrollViewProps extends ScrollViewProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const minValue = 0
const maxValue = Dimensions.get('window').width * 0.4

const iconProps = {
  size: rem(2.8),
  color: colors['text-in-primary']
}

export const SwipeableScrollView: FunctionComponent<
  SwipeableScrollViewProps
> = ({ onSwipeLeft, onSwipeRight, ...props }) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null)

  const progress = useSharedValue(0)
  const direction = useSharedValue<'left' | 'right' | null>(null)

  const gestureEvent = useAnimatedGestureHandler(
    {
      onActive (event) {
        progress.value = event.translationX
        if (progress.value > 0) direction.value = 'left'
        else if (progress.value < 0) direction.value = 'right'
      },
      onEnd (ev) {
        progress.value = withSpring(0, {}, finished => {
          if (finished) direction.value = null
        })

        if ((ev.translationX > 120 || ev.velocityX > 1000) && onSwipeLeft) {
          runOnJS(onSwipeLeft)()
        } else if (
          (ev.translationX < -120 || ev.velocityX < -1000) &&
          onSwipeRight
        ) {
          runOnJS(onSwipeRight)()
        }
      }
    },
    [onSwipeLeft, onSwipeRight]
  )

  const animatedLeftStyle = useAnimatedStyle(() => ({
    opacity:
      direction.value === 'left'
        ? interpolate(progress.value, [minValue, maxValue], [0, 1])
        : 0,
    transform: [
      { scale: interpolate(progress.value, [minValue, maxValue], [0.6, 2]) },
      { translateX: interpolate(progress.value, [minValue, maxValue], [0, 10]) }
    ]
  }))

  const animatedRightStyle = useAnimatedStyle(() => ({
    opacity:
      direction.value === 'right'
        ? interpolate(progress.value, [minValue, -maxValue], [0, 1])
        : 0,
    transform: [
      { scale: interpolate(progress.value, [minValue, -maxValue], [0.6, 2]) },
      {
        translateX: interpolate(progress.value, [minValue, -maxValue], [0, -10])
      }
    ]
  }))

  return (
    <>
      <Animated.View
        style={[
          styles.floatingContainer,
          styles.floatingLeft,
          animatedLeftStyle
        ]}
      >
        <MaterialIcons name="arrow-back" {...iconProps} />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatingContainer,
          styles.floatingRight,
          animatedRightStyle
        ]}
      >
        <MaterialIcons name="arrow-forward" {...iconProps} />
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureEvent} waitFor={scrollViewRef}>
        <Animated.View style={{ flex: 1 }}>
          <ScrollView {...props} />
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}
