import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
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
import {
  useCreateCategoryExpenditureMutation,
  useGetCategoryExpenditureQuery,
  useUpdateCategoryExpenditureMutation
} from '../../graphql/generated/graphql'
import { getCurrentClosestDateTime, parseDate, showMessage } from '../../utils'
import { ControlledSwitch } from '../Form/Switch'
import { ControlledYearMonth } from '../Form/YearMonth'
import { T } from '../T'
import { colors, rem } from '../../config/styles'
import { LoadingIndicator } from '../Loading'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
  yearMonth: string
}

export interface ExpenditureFormHandles {
  open(props?: { categoryId?: string; expenditureId?: string }): void
  close(): void
}

type FormData = {
  amount: number
  description?: string
  date?: string
  permanent: boolean
  permanentUntilYearMonth?: string
  numberOfInstallments?: number
  paid?: boolean
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

  const [expenditureId, setExpenditureId] = useState<string>()

  const [categoryId, setCategoryId] = useState<string | null>(
    _categoryId ?? null
  )
  const [visible, setVisible] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const { data } = useGetCategoryExpenditureQuery({
    variables: { id: expenditureId as string, yearMonth },
    skip: !expenditureId,
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (data?.categoryExpenditure) setRepeat(true)
  }, [data])

  const [createExpenditure, { loading: creating }] =
    useCreateCategoryExpenditureMutation({
      refetchQueries: [
        'GetCategory',
        'GetMonthlySummary',
        'GetAvailableBudget'
      ],
      onCompleted () {
        showMessage({ message: 'Despesa adicionada!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'N??o foi poss??vel adicionar a despesa.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const [updateExpenditure, { loading: updating }] =
    useUpdateCategoryExpenditureMutation({
      refetchQueries: [
        'GetCategory',
        'GetMonthlySummary',
        'GetAvailableBudget'
      ],
      onCompleted () {
        showMessage({ message: 'Despesa atualizada!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'N??o foi poss??vel atualizar a despesa.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const loading = useMemo(() => creating || updating, [creating, updating])

  const onSubmit = useCallback(
    async (formData: FormData) => {
      if (!categoryId && !_categoryId) return

      const data = {
        ...formData,
        categoryId: (categoryId ?? _categoryId) as string,
        permanentUntilYearMonth: formData.permanent
          ? formData.permanentUntilYearMonth
          : null
      }

      if (expenditureId) {
        await updateExpenditure({
          variables: { id: expenditureId, data, yearMonth }
        })
      } else {
        await createExpenditure({
          variables: {
            data: { ...data, yearMonth },
            yearMonth
          }
        })
      }

      setExpenditureId(undefined)
      setRepeat(false)
    },
    [
      _categoryId,
      categoryId,
      createExpenditure,
      expenditureId,
      updateExpenditure,
      yearMonth
    ]
  )

  useImperativeHandle(ref, () => ({
    open: options => {
      modalRef.current?.open()
      if (options?.categoryId) setCategoryId(options.categoryId)
      if (options?.expenditureId) setExpenditureId(options.expenditureId)

      setVisible(true)
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
      overlayStyle={{ backgroundColor: colors.overlay }}
      onClose={() => {
        setVisible(false)
        setCategoryId(null)
        setRepeat(false)
        setExpenditureId(undefined)
      }}
    >
      <View style={styles.container}>
        {(expenditureId && !data) || !visible ? (
          <LoadingIndicator />
        ) : (
          <>
            <ControlledInput
              control={control}
              name="description"
              label="Descri????o"
              autoFocus
              defaultValue={data?.categoryExpenditure.description}
            />

            <ControlledInput
              control={control}
              name="amount"
              label="Valor"
              keyboardType="decimal-pad"
              required
              defaultValue={data?.categoryExpenditure.amount}
            />

            <ControlledDateTime
              control={control}
              name="date"
              label="Data"
              mode="datetime"
              clearEnabled
              defaultValue={
                parseDate(data?.categoryExpenditure.date) ||
                getCurrentClosestDateTime()
              }
            />

            <ControlledSwitch control={control} name="paid" label="Pago" />

            <ControlledSwitch
              control={control}
              name="permanent"
              label="Repetir"
              onChange={setRepeat}
              defaultValue={!!data?.categoryExpenditure.permanent}
            />

            {repeat && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ControlledYearMonth
                  control={control}
                  name="permanentUntilYearMonth"
                  placeholder="Permanentemente"
                  label="At??"
                  containerStyle={{ flex: 1 }}
                  defaultValue={
                    data?.categoryExpenditure.permanentUntilYearMonth
                  }
                />
                <T style={{ paddingHorizontal: rem(1) }}>ou</T>
                <ControlledInput
                  control={control}
                  name="numberOfInstallments"
                  label="Quantidade de parcelas"
                  keyboardType="decimal-pad"
                  containerStyle={{ flex: 1 }}
                  defaultValue={data?.categoryExpenditure.numberOfInstallments}
                />
              </View>
            )}

            <Spacer height={1.4} />
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              Salvar
            </Button>
          </>
        )}
      </View>
    </Modalize>
  )
}

export const ExpenditureForm = forwardRef(ExpenditureFormComponent)
