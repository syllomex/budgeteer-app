import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import { Button } from '../../components/Button'
import { ControlledInput } from '../../components/Form/Input'
import { Spacer } from '../Spacer'

import styles from './styles'

interface CategoryFormProps {
  onSubmit(data): void | Promise<void>
}

export const CategoryForm: React.FunctionComponent<CategoryFormProps> = ({
  onSubmit
}) => {
  const { control, handleSubmit } = useForm()

  const [loading, setLoading] = useState(false)

  const submit = useCallback(
    async formData => {
      if (!formData.name) return

      setLoading(true)
      await onSubmit(formData)
      setLoading(false)
    },
    [onSubmit]
  )

  return (
    <View style={styles.container}>
      <ControlledInput
        control={control}
        name="name"
        label="Nome da categoria"
        autoFocus
        onSubmitEditing={handleSubmit(submit)}
      />

      <Spacer height={3} />
      <Button loading={loading} onPress={handleSubmit(submit)}>
        Salvar
      </Button>
    </View>
  )
}
