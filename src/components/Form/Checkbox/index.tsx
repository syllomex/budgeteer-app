import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { TouchableOpacity } from 'react-native'

import { colors, rem } from '../../../config/styles'
import { T } from '../../T'
import styles from './styles'

interface CheckboxProps {
  label?: string
  onChange?: (value: boolean) => void | Promise<void>
  value?: boolean
}

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  label,
  onChange,
  value
}) => {
  const [checked, setChecked] = useState(value ?? false)

  useEffect(() => {
    if (typeof value === 'boolean') setChecked(value)
  }, [value])

  const handleCheck = useCallback(() => {
    const newValue = !checked
    setChecked(newValue)
    onChange?.(newValue)
  }, [checked, onChange])

  return (
    <TouchableOpacity onPress={handleCheck} style={styles.container}>
      <Ionicons
        name={checked ? 'checkmark-circle-outline' : 'ellipse-outline'}
        color={checked ? colors.primary : colors['border-line']}
        size={rem(2.4)}
      />
      {!!label && <T style={styles.text}>{label}</T>}
    </TouchableOpacity>
  )
}

interface ControlledCheckboxProps extends CheckboxProps {
  control: Control
  name: string
}

export const ControlledCheckbox: React.FunctionComponent<
  ControlledCheckboxProps
> = ({ control, name, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field }) => {
        return (
          <Checkbox
            {...props}
            onChange={value => {
              field.onChange(value)
              field.onBlur()
            }}
          />
        )
      }}
    />
  )
}
