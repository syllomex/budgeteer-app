import React, { useState } from 'react'
import { Switch as SwitchComponent, View } from 'react-native'
import { Control, Controller } from 'react-hook-form'
import { T } from '../../T'
import { colors, rem } from '../../../config/styles'

interface SwitchProps {
  defaultValue?: boolean
  onChange?: (value: boolean) => void
  label?: string
}

export const Switch = ({ defaultValue, onChange, label }: SwitchProps) => {
  const [value, setValue] = useState(defaultValue ?? false)

  return (
    <View style={{ flexDirection: 'row', paddingVertical: rem(1) }}>
      <View style={{ flex: 1 }}>{!!label && <T>{label}</T>}</View>

      <SwitchComponent
        onValueChange={value => {
          setValue(value)
          onChange?.(value)
        }}
        value={value}
        thumbColor={value ? colors.primary : colors['background-matte+2']}
        trackColor={{ true: colors['primary-1'], false: colors['background-matte+1'] }}
      />
    </View>
  )
}

interface ControlledSwitchProps extends SwitchProps {
  control: Control<any>
  name: string
}

export const ControlledSwitch = ({
  control,
  name,
  ...props
}: ControlledSwitchProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <Switch
          {...props}
          onChange={value => {
            props.onChange?.(value)
            field.onChange(value)
          }}
        />
      )}
    />
  )
}
