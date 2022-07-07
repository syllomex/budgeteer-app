import React, {
  ForwardRefRenderFunction,
  FunctionComponent,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback
} from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import Picker from 'react-native-month-year-picker'
import { dateToYearMonth, displayDate, yearMonthToDate } from '../../../utils'
import { ClearButton } from '../ClearButton'
import { Label } from '../Label'

import styles from '../_styles'

interface YearMonthPickerProps {
  defaultValue?: string | null
  onSelect?: (yearMonth: string | null) => void
}

export interface YearMonthPickerHandles {
  open(): void
}

export const YearMonthPickerComponent: ForwardRefRenderFunction<
  YearMonthPickerHandles,
  YearMonthPickerProps
> = ({ defaultValue, onSelect: _onSelect }, ref) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(
    yearMonthToDate(defaultValue) ?? new Date()
  )

  const onSelect = useRef(_onSelect)

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  if (!open) return null

  return (
    <Picker
      value={value}
      onChange={(ev, newDate) => {
        setOpen(false)
        if (ev === 'dateSetAction') {
          setValue(newDate)
          onSelect.current?.(dateToYearMonth(newDate))
        }
      }}
      locale="pt"
    />
  )
}

export const YearMonthPicker = forwardRef(YearMonthPickerComponent)

interface YearMonthProps extends YearMonthPickerProps {
  label?: string
  required?: boolean
  placeholder?: string
  containerStyle?: StyleProp<ViewStyle>
  clearEnabled?: boolean
}

export const YearMonth: FunctionComponent<YearMonthProps> = ({
  defaultValue,
  label,
  required,
  placeholder,
  onSelect,
  containerStyle,
  clearEnabled
}) => {
  const ref = useRef<YearMonthPickerHandles>(null)

  const [value, setValue] = useState<string | undefined | null>(defaultValue)

  const clear = useCallback(() => {
    onSelect?.(null)
    setValue(null)
  }, [onSelect])

  return (
    <View style={containerStyle}>
      {!!label && <Label required={required}>{label}</Label>}

      <TouchableOpacity
        onPress={() => ref.current?.open?.()}
        style={styles.container}
      >
        <View style={styles.inputTextContainer}>
          <TextInput
            style={[styles.inputText, !value && styles.placeholder]}
            editable={false}
            value={
              value
                ? displayDate(yearMonthToDate(value) as Date, "MMMM'/'yyyy")
                : placeholder ?? 'Selecionar mês/ano'
            }
          />
          {clearEnabled && !!value && <ClearButton onPress={clear} />}
        </View>
      </TouchableOpacity>

      <YearMonthPicker
        ref={ref}
        defaultValue={defaultValue}
        onSelect={yearMonth => {
          onSelect?.(yearMonth)
          setValue(yearMonth)
        }}
      />
    </View>
  )
}

interface ControlledYearMonthProps extends YearMonthProps {
  control: Control<any>
  name: string
}

export const ControlledYearMonth: FunctionComponent<
  ControlledYearMonthProps
> = ({ control, name, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <YearMonth
          {...props}
          onSelect={yearMonth => {
            field.onChange(yearMonth)
            props.onSelect?.(yearMonth)
          }}
        />
      )}
    />
  )
}
