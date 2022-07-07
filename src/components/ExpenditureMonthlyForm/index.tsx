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
import {
  useGetCategoryExpenditureQuery,
  useUpdateCategoryExpenditureInMonthMutation
} from '../../graphql/generated/graphql'
import { showMessage } from '../../utils'
import { colors } from '../../config/styles'
import { LoadingIndicator } from '../Loading'
import styles from './styles'

interface ExpenditureFormProps {
  categoryId?: string
  yearMonth: string
}

export interface MonthlyExpenditureFormHandles {
  open(props?: { expenditureId?: string }): void
  close(): void
}

type FormData = {
  amount: number
}

const schema = yup.object().shape({
  amount: yup.number().required()
})

const MonthlyExpenditureMonthlyFormComponent: React.ForwardRefRenderFunction<
  MonthlyExpenditureFormHandles,
  ExpenditureFormProps
> = ({ yearMonth }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const [expenditureId, setExpenditureId] = useState<string>()

  const [visible, setVisible] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const { data } = useGetCategoryExpenditureQuery({
    variables: { id: expenditureId as string, yearMonth },
    skip: !expenditureId
  })

  const [updateExpenditureInMonth, { loading }] =
    useUpdateCategoryExpenditureInMonthMutation({
      refetchQueries: ['GetCategory', 'GetMonthlySummary'],
      onCompleted () {
        showMessage({ message: 'Despesa atualizada!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível atualizar a despesa.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const onSubmit = useCallback(
    async (formData: FormData) => {
      if (!expenditureId) return

      await updateExpenditureInMonth({
        variables: { yearMonth, data: formData, id: expenditureId }
      })
    },
    [expenditureId, updateExpenditureInMonth, yearMonth]
  )

  useImperativeHandle(ref, () => ({
    open: options => {
      modalRef.current?.open()
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
      withReactModal
      onClose={() => {
        setVisible(false)
      }}
    >
      <View style={styles.container}>
        {(expenditureId && !data) || !visible ? (
          <LoadingIndicator />
        ) : (
          <>
            <ControlledInput
              control={control}
              name="amount"
              label="Valor"
              keyboardType="decimal-pad"
              required
              defaultValue={
                data?.categoryExpenditure.monthly?.amount ??
                data?.categoryExpenditure.amount
              }
            />

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

export const MonthlyExpenditureForm = forwardRef(
  MonthlyExpenditureMonthlyFormComponent
)
