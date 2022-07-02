import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
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
import { showMessage } from '../../utils'
import { ControlledSwitch } from '../Form/Switch'
import { ControlledYearMonth } from '../Form/YearMonth'
import { T } from '../T'
import { rem } from '../../config/styles'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
  yearMonth: string
}

export interface ExpenditureFormHandles {
  open(props?: { categoryId?: string }): void
  close(): void
}

type FormData = {
  amount: number
  description?: string
  date?: string
  permanent: boolean
  permanentUntilYearMonth?: string
  numberOfInstallments?: number
}

const schema = yup.object().shape({
  amount: yup.number().required(),
  description: yup.string().nullable(),
  date: yup.date().nullable(),
  numberOfInstallments: yup.number().nullable()
})

const ExpenditureFormComponent: React.ForwardRefRenderFunction<
  ExpenditureFormHandles,
  ExpenditureFormProps
> = ({ categoryId: _categoryId, yearMonth }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const [categoryId, setCategoryId] = useState<string | null>(
    _categoryId ?? null
  )
  const [repeat, setRepeat] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormData>({
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
      if (!categoryId && !_categoryId) return

      await createExpenditure({
        variables: {
          data: {
            ...formData,
            categoryId: (categoryId ?? _categoryId) as string,
            yearMonth,
            permanentUntilYearMonth: formData.permanent
              ? formData.permanentUntilYearMonth
              : null
          },
          yearMonth
        }
      })
      setRepeat(false)
    },
    [_categoryId, categoryId, createExpenditure, yearMonth]
  )

  useImperativeHandle(ref, () => ({
    open: props => {
      modalRef.current?.open()
      if (props?.categoryId) setCategoryId(props.categoryId)
    },
    close: () => modalRef.current?.close()
  }))

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      scrollViewProps={{
        keyboardShouldPersistTaps: 'always',
        showsVerticalScrollIndicator: false
      }}
      withReactModal
      onClose={() => {
        setCategoryId(null)
        setRepeat(false)
      }}
    >
      <View style={styles.container}>
        <ControlledInput
          control={control}
          name="description"
          label="Descrição"
          autoFocus
        />

        <ControlledInput
          control={control}
          name="amount"
          label="Valor"
          keyboardType="decimal-pad"
          required
        />

        <ControlledDateTime
          control={control}
          name="date"
          label="Data"
          mode="datetime"
          clearEnabled
        />

        <ControlledSwitch
          control={control}
          name="permanent"
          label="Repetir"
          onChange={setRepeat}
        />

        {repeat && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ControlledYearMonth
              control={control}
              name="permanentUntilYearMonth"
              placeholder="Permanentemente"
              label="Até"
              containerStyle={{ flex: 1 }}
            />
            <T style={{ paddingHorizontal: rem(1) }}>ou</T>
            <ControlledInput
              control={control}
              name="numberOfInstallments"
              label="Quantidade de parcelas"
              keyboardType="decimal-pad"
              containerStyle={{ flex: 1 }}
            />
          </View>
        )}

        <Spacer height={1.4} />
        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
          Salvar
        </Button>
      </View>
    </Modalize>
  )
}

export const ExpenditureForm = forwardRef(ExpenditureFormComponent)
