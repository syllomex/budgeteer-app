import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { format } from 'date-fns'
import { Modalize } from 'react-native-modalize'
import { useCreateExpenditure } from '../../hooks/useCreateExpenditure'
import { Button } from '../Button'
import { ControlledInput } from '../Form/Input'
import { Spacer } from '../Spacer'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
}

export interface ExpenditureFormHandles {
  open(): void
}

const schema = yup.object().shape({
  value: yup.number().required(),
  description: yup.string().nullable(),
  date: yup.string().required()
})

const ExpenditureFormComponent: React.ForwardRefRenderFunction<
  ExpenditureFormHandles,
  ExpenditureFormProps
> = ({ categoryId }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const { onSubmit, loading } = useCreateExpenditure({
    categoryId,
    onSuccess: () => {
      reset()
      modalRef.current?.close()
    }
  })

  useImperativeHandle(ref, () => ({ open: () => modalRef.current?.open() }))

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
      withReactModal
    >
      <View style={styles.container}>
        <ControlledInput
          control={control}
          name="description"
          label="Descrição"
          autoFocus
        />
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
        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
          Salvar
        </Button>
      </View>
    </Modalize>
  )
}

export const ExpenditureForm = forwardRef(ExpenditureFormComponent)
