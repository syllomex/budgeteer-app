import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef
} from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Modalize } from 'react-native-modalize'

import { Button } from '../Button'
import { ControlledInput } from '../Form/Input'
import { Spacer } from '../Spacer'
import { ControlledDateTime } from '../Form/DateTime'
import { useCreateCategoryExpenditureMutation } from '../../graphql/generated/graphql'
import { useStore } from '../../contexts/store'
import { showMessage } from '../../utils'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
}

export interface ExpenditureFormHandles {
  open(): void
}

type FormData = {
  amount: number
  description?: string
  date?: string
}

const schema = yup.object().shape({
  amount: yup.number().required(),
  description: yup.string().nullable(),
  date: yup.date().nullable()
})

const ExpenditureFormComponent: React.ForwardRefRenderFunction<
  ExpenditureFormHandles,
  ExpenditureFormProps
> = ({ categoryId }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const { yearMonth } = useStore()
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const [createExpenditure, { loading }] = useCreateCategoryExpenditureMutation(
    {
      refetchQueries: ['GetCategory', 'GetMonthlySummary'],
      onCompleted () {
        showMessage({ message: 'Despesa adicionada!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível adicionar a despesa.',
          description: err.message,
          type: 'error'
        })
      }
    }
  )

  const onSubmit = useCallback(
    async (formData: FormData) => {
      await createExpenditure({
        variables: { data: { ...formData, categoryId, yearMonth }, yearMonth }
      })
    },
    [categoryId, createExpenditure, yearMonth]
  )

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
          name="amount"
          label="Valor"
          keyboardType="decimal-pad"
        />
        <Spacer height={1.8} />

        <ControlledDateTime
          control={control}
          name="date"
          label="Data"
          mode="datetime"
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
