import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Modal, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import { Color, colors, rem } from '../../config/styles'
import { SetState } from '../../utils'
import { Button } from '../Button'
import { Spacer } from '../Spacer'
import { T } from '../T'

type CommonConfirmOptions = {
  title: string
  description: string
}

type PresetConfirmOptions = {
  preset: 'delete'
  confirm?: never
  cancel?: never
  confirmText?: string
  cancelText?: string
}

type StylingConfirmOptions = {
  preset?: never
  confirm?: {
    color?: Color
    text?: string
  }
  cancel?: {
    text?: string
  }
  cancelText?: never
  confirmText?: never
}

type ConfirmOptions = CommonConfirmOptions &
  (PresetConfirmOptions | StylingConfirmOptions)

class Controller {
  private setOptions: SetState<ConfirmOptions | null> | null = null
  private setVisible: SetState<boolean> | null = null
  private resolver: ((confirmed: boolean) => void) | null = null

  register (
    setOptions: SetState<ConfirmOptions | null>,
    setVisible: SetState<boolean>
  ) {
    this.setOptions = setOptions
    this.setVisible = setVisible

    return () => {
      this.setOptions = null
      this.setVisible = null
    }
  }

  async confirm (options: ConfirmOptions) {
    if (this.resolver) {
      throw new Error(
        '[Confirm] There is already a confirmation dialog on the screen'
      )
    }

    if (!this.setOptions || !this.setVisible) {
      throw new Error(
        '[Confirm] Tried to call .confirm without registering functions.'
      )
    }

    this.setVisible(true)
    this.setOptions(options)

    return new Promise<boolean>(resolve => {
      this.resolver = resolve
    })
  }

  async resolve (confirmed: boolean) {
    if (!this.resolver) {
      throw new Error(
        '[Confirm] Tried to call .resolve without registering resolve function'
      )
    }

    this.resolver(confirmed)
    this.resolver = null
  }
}

const controller = new Controller()

const ConfirmComponent = ({
  description,
  title,
  cancel,
  confirm,
  confirmText,
  cancelText,
  preset,
  setVisible
}: ConfirmOptions & { setVisible: SetState<boolean> }) => {
  const animation = useSharedValue(0)

  const resolve = useCallback(
    async (confirmed: boolean) => {
      controller.resolve(confirmed)
      setVisible(false)
    },
    [setVisible]
  )

  const close = useCallback(
    (confirmed: boolean) => {
      animation.value = withSpring(0, { mass: 0.1 }, finished => {
        if (!finished) return
        runOnJS(resolve)(confirmed)
      })
    },
    [animation, resolve]
  )

  const backdropStyles = useAnimatedStyle(() => ({
    backgroundColor: colors.overlay,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: animation.value
  }))

  const containerStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(animation.value, [0, 1], [25, 0]) }],
    backgroundColor: colors['background-light'],
    opacity: animation.value
  }))

  useEffect(() => {
    animation.value = withSpring(1, { mass: 0.1 })
  }, [animation])

  const confirmLabel = useMemo(() => {
    if (confirmText) return confirmText
    if (confirm?.text) return confirm.text
    if (preset === 'delete') return 'Remover'
    return 'Confirmar'
  }, [confirm?.text, confirmText, preset])

  const cancelLabel = useMemo(() => {
    if (cancelText) return cancelText
    if (cancel?.text) return cancel.text
    return 'Cancelar'
  }, [cancel?.text, cancelText])

  return (
    <Modal transparent>
      <Animated.View style={backdropStyles} onTouchEnd={() => close(false)} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={[
            { padding: rem(1.6), borderRadius: rem(0.4) },
            containerStyles
          ]}
        >
          <T f="bold">{title}</T>
          <Spacer height={0.8} />
          <T>{description}</T>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              backgroundColor: colors['background-matte'],
              marginHorizontal: rem(-1.6),
              paddingHorizontal: rem(1.6),
              marginBottom: rem(-1.6),
              paddingVertical: rem(0.8),
              marginTop: rem(1)
            }}
          >
            <TouchableOpacity
              style={{ paddingVertical: rem(0.6) }}
              onPress={() => {
                close(false)
              }}
            >
              <T c="muted">{cancelLabel}</T>
            </TouchableOpacity>
            <Spacer width={1.6} />
            <Button
              onPress={() => close(true)}
              accentColor={confirm?.color || (preset === 'delete' && 'danger')}
              thin
            >
              {confirmLabel}
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

export const confirm = (options: ConfirmOptions) => {
  return controller.confirm(options)
}

export const ConfirmContext = createContext({})

export const ConfirmProvider: FunctionComponent = ({ children }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const unregister = controller.register(setOptions, setVisible)
    return unregister
  }, [])

  return (
    <ConfirmContext.Provider value={{}}>
      {children}
      {visible && options && (
        <ConfirmComponent {...options} setVisible={setVisible} />
      )}
    </ConfirmContext.Provider>
  )
}

export const Confirm = ConfirmProvider
