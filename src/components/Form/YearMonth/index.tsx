import React, {
  ForwardRefRenderFunction,
  FunctionComponent,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react'
import { Control, Controller } from 'react-hook-form'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Picker from 'react-native-month-year-picker'
import { dateToYearMonth, displayDate, yearMonthToDate } from '../../../utils'
import { Label } from '../Label'

import styles from '../_styles'

interface YearMonthPickerProps {
  defaultValue?: string
  onSelect?: (yearMonth: string) => void
}

interface YearMonthPickerHandles {
  open(): void
}

export const YearMonthPickerComponent: ForwardRefRenderFunction<
  YearMonthPickerHandles,
  YearMonthPickerProps
> = ({ defaultValue, onSelect }, ref) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(
    yearMonthToDate(defaultValue) ?? new Date()
  )

  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }))

  if (!open) return null

  return (
    <Picker
      value={value}
      onChange={(ev, newDate) => {
        setOpen(false)
        if (ev === 'dateSetAction') {
          setValue(newDate)
          onSelect?.(dateToYearMonth(newDate))
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
}

export const YearMonth: FunctionComponent<YearMonthProps> = ({
  defaultValue,
  label,
  required,
  onSelect
}) => {
  const ref = useRef<YearMonthPickerHandles>(null)

  const [value, setValue] = useState<string | undefined>(defaultValue)

  return (
    <View>
      {!!label && <Label required={required}>{label}</Label>}

      <TouchableOpacity
        onPress={() => ref.current?.open?.()}
        style={styles.container}
      >
        <TextInput
          style={styles.inputText}
          editable={false}
          value={
            value
              ? displayDate(yearMonthToDate(value) as Date, "MMMM'/'yyyy")
              : 'Selecionar mês/ano'
          }
        />
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
  control: Control
  name: string
}

export const ControlledYearMonth: FunctionComponent<
  ControlledYearMonthProps
> = ({ control, name, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
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
