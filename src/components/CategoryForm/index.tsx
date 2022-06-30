import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import { Button } from '../../components/Button'
import { ControlledInput } from '../../components/Form/Input'
import { useCreateCategoryMutation } from '../../graphql/generated/graphql'
import { showMessage } from '../../utils/message'
import { Spacer } from '../Spacer'

import styles from './styles'

interface CategoryFormProps {
  closeCategoryModal(): void
  yearMonth: string
}

export const CategoryForm: React.FunctionComponent<CategoryFormProps> = ({
  closeCategoryModal,
  yearMonth
}) => {
  const { control, handleSubmit } = useForm()

  const [createCategory, { loading: creating }] = useCreateCategoryMutation({
    onCompleted () {
      showMessage({ message: 'Categoria adicionada!' })
      closeCategoryModal()
    },
    onError (err) {
      showMessage({
        message: 'Não foi possível adicionar a categoria.',
        type: 'error',
        description: err.message
      })
    },
    refetchQueries: ['GetMonthlySummary']
  })

  const submit = useCallback(
    async formData => {
      if (!formData.name) return

      await createCategory({ variables: { data: formData, yearMonth } })
    },
    [createCategory, yearMonth]
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
      <Button loading={creating} onPress={handleSubmit(submit)}>
        Salvar
      </Button>
    </View>
  )
}
