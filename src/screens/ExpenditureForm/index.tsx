import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Button } from '../../components/Button'
import { ControlledInput } from '../../components/Form/Input'

import { useAuth } from '../../contexts/auth'
import { useStore } from '../../contexts/store'

import { userStore } from '../../hooks'

export const ExpenditureForm: React.FunctionComponent = () => {
  const { user } = useAuth()
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const { monthId } = useStore()
  const { control, handleSubmit } = useForm()

  const onSubmit = useCallback(
    async formData => {
      await userStore(user.uid)
        .collection(
          `months/${monthId}/categories/${params.categoryId}/expenditures`
        )
        .add({
          date: formData.date ?? null,
          description: formData.description ?? null,
          value: parseFloat(formData.value),
          typename: 'Expenditure'
        })

      Toast.show({ type: 'success', text1: 'Gasto adicionado!' })

      goBack()
    },
    [goBack, monthId, params.categoryId, user.uid]
  )

  return (
    <View>
      <ControlledInput control={control} name="description" label="Descrição" />
      <ControlledInput control={control} name="value" label="Valor" />
      <ControlledInput control={control} name="date" label="Data" />

      <Button onPress={handleSubmit(onSubmit)}>Salvar</Button>
    </View>
  )
}
