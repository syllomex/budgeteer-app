import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import { Button } from '../../components/Button'
import { ControlledInput } from '../../components/Form/Input'

import { useAuth } from '../../contexts/auth'
import { useStore } from '../../contexts/store'

import styles from './styles'

export const CategoryForm: React.FunctionComponent = () => {
  const { user } = useAuth()
  const { control, handleSubmit } = useForm()
  const { goBack } = useNavigation()
  const { monthId } = useStore()

  const onSubmit = useCallback(
    async formData => {
      if (!monthId) return
      if (!formData.name) return

      await firestore()
        .collection(`users/${user.uid}/months/${monthId}/categories`)
        .add({ typename: 'Category', ...formData })

      Toast.show({ type: 'success', text1: 'Categoria adicionada!' })
      goBack()
    },
    [goBack, monthId, user.uid]
  )

  return (
    <View style={styles.container}>
      <ControlledInput
        control={control}
        name="name"
        label="Nome da categoria"
      />

      <Button onPress={handleSubmit(onSubmit)}>Salvar</Button>
    </View>
  )
}
