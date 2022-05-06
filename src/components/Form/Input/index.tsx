import React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { Control, Controller } from 'react-hook-form'
import { Label } from '../Label'
import formStyles from '../_styles'
import { colors } from '../../../config/styles'

interface InputProps extends TextInputProps {
  label?: string
  required?: boolean
}

export const Input: React.FunctionComponent<InputProps> = ({
  label,
  required,
  ...props
}) => {
  return (
    <View>
      {!!label && <Label required={required}>{label}</Label>}
      <View style={formStyles.container}>
        <TextInput
          {...props}
          style={formStyles.inputText}
          selectionColor={colors['primary-1']}
        />
      </View>
    </View>
  )
}

interface ControlledInputProps extends InputProps {
  name: string
  control: Control
}

export const ControlledInput: React.FunctionComponent<ControlledInputProps> = ({
  control,
  name,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <Input
          {...props}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
        />
      )}
    />
  )
}