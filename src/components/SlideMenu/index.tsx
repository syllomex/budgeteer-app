import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef
} from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Color, colors, rem } from '../../config/styles'
import { T } from '../T'
import styles from './styles'

export interface SlideMenuHandles {
  open(): void
  close(): void
}

const iconProps = {
  color: colors['text-neutral'],
  size: rem(1.6)
}

type PressFunction = () => void | Promise<void> | boolean | Promise<boolean>

type Option = {
  label: string
  onPress?: PressFunction
  color?: Color
  icon?: (props: typeof iconProps) => JSX.Element
}

export interface SlideMenuProps {
  options?: (Option | false)[]
}

const SlideMenuComponent: React.ForwardRefRenderFunction<
  SlideMenuHandles,
  SlideMenuProps
> = ({ options }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const handlePress = useCallback(async (onPress: PressFunction) => {
    const result = await onPress()
    if (result === false) return
    modalRef.current.close()
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: Option; index: number }) => {
      return (
        <TouchableOpacity
          key={index.toString()}
          style={styles.itemContainer}
          onPress={() => handlePress(item.onPress)}
        >
          {item.icon && (
            <View style={styles.itemIconContainer}>
              {item.icon({
                ...iconProps,
                color: item.color ? colors[item.color] : iconProps.color
              })}
            </View>
          )}
          <View style={styles.itemTextContainer}>
            <T c={item.color}>{item.label}</T>
          </View>
        </TouchableOpacity>
      )
    },
    [handlePress]
  )

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.open(),
    close: () => modalRef.current?.close()
  }))

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      flatListProps={{
        data: options,
        keyExtractor: (_item, index) => index.toString(),
        renderItem
      }}
      withReactModal
    />
  )
}

export const SlideMenu = forwardRef(SlideMenuComponent)
