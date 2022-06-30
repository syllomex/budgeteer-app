import React, { useEffect, useMemo, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { TextInput, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'

import styles from '../_styles'

import { Label } from '../Label'
import { displayDate, parseDate } from '../../../utils'

interface FormattedReturnProps {
  onChange?: (date: string) => any | Promise<any>
  returnFormat: string
}

interface RawReturnProps {
  onChange?: (date: Date) => any | Promise<any>
  returnFormat?: never
}

type ReturnProps = FormattedReturnProps | RawReturnProps

type DateTimeProps = ReturnProps & {
  label?: string
  defaultValue?: Date | string
  value?: Date | string
  mode?: 'date' | 'time' | 'datetime'
}

const formatReturnValue = (value: string | Date, returnFormat?: string) => {
  return (
    returnFormat ? displayDate(value as Date, returnFormat) : value
  ) as Date & string
}

const parseValue = (value: string | Date) => {
  if (typeof value === 'string') {
    const parsed = parseDate(value)
    return parsed ?? new Date()
  }
  return value
}

export const DateTime: React.FunctionComponent<DateTimeProps> = ({
  onChange,
  label,
  defaultValue,
  returnFormat,
  value,
  mode = 'date'
}) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(
    defaultValue ? parseValue(defaultValue) : null
  )

  useEffect(() => {
    if (value) setDate(parseValue(value))
  }, [value])

  const displayFormat = useMemo(() => {
    if (mode === 'date') return undefined
    if (mode === 'time') return 'p'
    return 'Pp'
  }, [mode])

  return (
    <>
      {!!label && <Label>{label}</Label>}

      <TouchableOpacity style={styles.container} onPress={() => setOpen(true)}>
        <TextInput
          style={[styles.inputText, !date && styles.placeholder]}
          editable={false}
          value={date ? displayDate(date, displayFormat) : 'Selecionar data'}
        />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date ?? new Date()}
        mode={mode}
        title={null}
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false)
          setDate(date)

          onChange?.(formatReturnValue(date, returnFormat))
        }}
      />
    </>
  )
}

type ControlledDateTimeProps = DateTimeProps & {
  control: Control
  name: string
}

export const ControlledDateTime: React.FunctionComponent<
  ControlledDateTimeProps
> = ({ control, name, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        props.defaultValue
          ? formatReturnValue(
            props.defaultValue ?? new Date(),
            props.returnFormat
          )
          : null
      }
      render={({ field }) => (
        <DateTime
          {...props}
          value={field.value}
          onChange={date => {
            field.onChange(date)
            field.onBlur()
            props.onChange?.(date)
          }}
        />
      )}
    />
  )
}
