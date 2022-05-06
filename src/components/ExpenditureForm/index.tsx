import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { format } from 'date-fns'
import { Button } from '../Button'
import { ControlledInput } from '../Form/Input'
import { Spacer } from '../Spacer'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
  onSubmit: (data: any) => Promise<void>
}

const schema = yup.object().shape({
  value: yup.number().required(),
  description: yup.string().nullable(),
  date: yup.string().required()
})

export const ExpenditureForm: React.FunctionComponent<ExpenditureFormProps> = ({
  onSubmit,
  categoryId
}) => {
  const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) })

  const [loading, setLoading] = useState(false)

  const submit = useCallback(
    async formData => {
      try {
        setLoading(true)
        await onSubmit({ ...formData, categoryId })
      } finally {
        setLoading(false)
      }
    },
    [categoryId, onSubmit]
  )

  return (
    <View style={styles.container}>
      <ControlledInput control={control} name="description" label="Descrição" />
      <Spacer height={1.8} />

      <ControlledInput
        control={control}
        name="value"
        label="Valor"
        keyboardType="decimal-pad"
      />
      <Spacer height={1.8} />

      <ControlledInput
        control={control}
        name="date"
        label="Data"
        defaultValue={format(new Date(), 'yyyy-MM-dd')}
      />

      <Spacer height={3} />
      <Button loading={loading} onPress={handleSubmit(submit)}>
        Salvar
      </Button>
    </View>
  )
}
