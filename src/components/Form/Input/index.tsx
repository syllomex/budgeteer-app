import React from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native'
import { Control, Controller } from 'react-hook-form'
import { Label } from '../Label'
import formStyles from '../_styles'
import { colors } from '../../../config/styles'

interface InputProps extends Omit<TextInputProps, 'defaultValue'> {
  label?: string
  required?: boolean
  containerStyle?: StyleProp<ViewStyle>
  defaultValue?: string | number | null
}

export const Input: React.FunctionComponent<InputProps> = ({
  label,
  required,
  containerStyle,
  ...props
}) => {
  return (
    <View style={containerStyle}>
      {!!label && <Label required={required}>{label}</Label>}
      <View style={formStyles.container}>
        <TextInput
          {...props}
          style={formStyles.inputText}
          selectionColor={colors['primary-1']}
          defaultValue={props.defaultValue?.toString()}
        />
      </View>
    </View>
  )
}

interface ControlledInputProps extends InputProps {
  name: string
  control: Control<any>
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
          value={field.value?.toString()}
        />
      )}
    />
  )
}
