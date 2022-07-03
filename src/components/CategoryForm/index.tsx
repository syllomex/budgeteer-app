import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import { Button } from '../../components/Button'
import { ControlledInput } from '../../components/Form/Input'
import {
  useCreateCategoryMutation,
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation
} from '../../graphql/generated/graphql'
import { showMessage } from '../../utils/message'
import { ControlledSwitch } from '../Form/Switch'
import { ControlledYearMonth } from '../Form/YearMonth'
import { LoadingIndicator } from '../Loading'
import { Spacer } from '../Spacer'

import styles from './styles'

interface CategoryFormProps {
  closeCategoryModal(): void
  yearMonth: string
  categoryId?: string
}

export const CategoryForm: React.FunctionComponent<CategoryFormProps> = ({
  closeCategoryModal,
  yearMonth,
  categoryId
}) => {
  const { control, handleSubmit } = useForm()

  const [repeat, setRepeat] = useState(false)

  const { data } = useGetCategoryDetailsQuery({
    variables: { id: categoryId as string },
    skip: !categoryId,
    onCompleted (data) {
      setRepeat(data.category.permanent)
    }
  })

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

  const [updateCategory, { loading: updating }] = useUpdateCategoryMutation({
    onCompleted () {
      showMessage({ message: 'Categoria atualizada!' })
      closeCategoryModal()
    },
    onError (err) {
      showMessage({
        message: 'Não foi possível atualizar a categoria.',
        type: 'error',
        description: err.message
      })
    }
  })

  const loading = useMemo(() => creating || updating, [creating, updating])

  const submit = useCallback(
    async formData => {
      if (!formData.name) return

      if (!categoryId) {
        await createCategory({
          variables: {
            data: {
              name: formData.name,
              permanent: formData.permanent,
              permanentUntilYearMonth: formData.permanent
                ? formData.permanentUntilYearMonth
                : null,
              yearMonth
            },
            yearMonth
          }
        })
      } else {
        await updateCategory({
          variables: {
            id: categoryId,
            data: {
              name: formData.name,
              permanent: formData.permanent,
              permanentUntilYearMonth: formData.permanent
                ? formData.permanentUntilYearMonth
                : null
            },
            yearMonth
          }
        })
      }
      setRepeat(false)
    },
    [categoryId, createCategory, updateCategory, yearMonth]
  )

  if (categoryId && !data) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ControlledInput
        control={control}
        name="name"
        label="Nome da categoria"
        autoFocus
        onSubmitEditing={handleSubmit(submit)}
        required
        defaultValue={data?.category.name}
      />

      <ControlledSwitch
        control={control}
        name="permanent"
        label="Repetir"
        onChange={setRepeat}
        defaultValue={data?.category.permanent}
      />

      {repeat && (
        <ControlledYearMonth
          control={control}
          name="permanentUntilYearMonth"
          placeholder="Permanentemente"
          label="Até"
          defaultValue={data?.category.permanentUntilYearMonth}
        />
      )}

      <Spacer height={1.4} />
      <Button loading={loading} onPress={handleSubmit(submit)}>
        Salvar
      </Button>
    </View>
  )
}
