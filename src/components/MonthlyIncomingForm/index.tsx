import React, {
  forwardRef,
  useCallback,
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

import { NetworkStatus } from '@apollo/client'
import { Button } from '../Button'
import { ControlledInput } from '../Form/Input'
import { Spacer } from '../Spacer'
import {
  useCreateMonthlyIncomingMutation,
  useGetMonthlyIncomingQuery,
  useUpdateMonthlyIncomingMutation
} from '../../graphql/generated/graphql'
import { showMessage } from '../../utils'
import { colors } from '../../config/styles'
import { LoadingIndicator } from '../Loading'
import { T } from '../T'
import { ControlledYearMonth } from '../Form/YearMonth'
import { Switch } from '../Form/Switch'
import styles from './styles'

export interface MonthlyIncomingFormHandles {
  open(props?: { incomingId?: string }): void
  close(): void
}

type FormData = {
  amount: number
  startYearMonth: string
  endYearMonth?: string
  description?: string
}

const schema = yup.object().shape({
  amount: yup.number().required(),
  startYearMonth: yup.string().required()
})

const MonthlyIncomingFormComponent: React.ForwardRefRenderFunction<
  MonthlyIncomingFormHandles,
  { yearMonth: string }
> = ({ yearMonth }, ref) => {
  const modalRef = useRef<Modalize>(null)

  const [incomingId, setIncomingId] = useState<string>()
  const [visible, setVisible] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const { data, networkStatus } = useGetMonthlyIncomingQuery({
    variables: { id: incomingId as string },
    skip: !incomingId,
    fetchPolicy: 'network-only',
    onCompleted (result) {
      if (
        result.monthlyIncoming.endYearMonth !==
        result.monthlyIncoming.startYearMonth
      ) {
        setRepeat(true)
      }
    }
  })

  const [updateIncoming, { loading: updating }] =
    useUpdateMonthlyIncomingMutation({
      refetchQueries: ['GetMonthlySummary', 'GetAvailableBudget'],
      onCompleted () {
        showMessage({ message: 'Renda atualizada!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível atualizar o rendimento.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const [createIncoming, { loading: creating }] =
    useCreateMonthlyIncomingMutation({
      refetchQueries: [
        'GetMonthlySummary',
        'GetAvailableBudget',
        'GetMonthlyIncomings'
      ],
      onCompleted () {
        showMessage({ message: 'Rendimento adicionado!' })
        modalRef.current?.close()
        reset()
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível adicionar o rendimento.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const loading = useMemo(() => creating || updating, [creating, updating])

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const data = {
        ...formData,
        endYearMonth: repeat ? formData.endYearMonth : yearMonth
      }

      if (incomingId) {
        await updateIncoming({
          variables: { data, id: incomingId }
        })
      } else {
        await createIncoming({
          variables: { data }
        })
      }
    },
    [createIncoming, incomingId, repeat, updateIncoming, yearMonth]
  )

  useImperativeHandle(ref, () => ({
    open: options => {
      modalRef.current?.open()
      if (options?.incomingId) setIncomingId(options.incomingId)

      setVisible(true)
    },
    close: () => modalRef.current?.close()
  }))

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        showsVerticalScrollIndicator: false
      }}
      overlayStyle={{ backgroundColor: colors.overlay }}
      onClose={() => {
        setVisible(false)
        setRepeat(false)
        setIncomingId(undefined)
        reset()
      }}
    >
      <View style={styles.container}>
        {(incomingId && !data) ||
        !visible ||
        networkStatus === NetworkStatus.setVariables ? (
          <LoadingIndicator />
            ) : (
          <>
            <T f="bold" s={1.8}>
              Adicionar rendimento
            </T>
            <Spacer height={1.6} />

            <ControlledInput
              control={control}
              name="description"
              label="Descrição"
              placeholder="Ex: Salário"
              defaultValue={data?.monthlyIncoming.description}
            />

            <ControlledInput
              control={control}
              name="amount"
              label="Valor"
              keyboardType="decimal-pad"
              required
              defaultValue={data?.monthlyIncoming.amount}
            />

            <Switch label="Renda fixa" onChange={setRepeat} value={repeat} />

            {!repeat && (
              <ControlledYearMonth
                control={control}
                name="startYearMonth"
                label="Mês"
                defaultValue={data?.monthlyIncoming.startYearMonth ?? yearMonth}
                required
              />
            )}

            {repeat && (
              <>
                <ControlledYearMonth
                  control={control}
                  name="startYearMonth"
                  label="Mês inicial"
                  defaultValue={
                    data?.monthlyIncoming.startYearMonth ?? yearMonth
                  }
                  required
                />

                <ControlledYearMonth
                  control={control}
                  name="endYearMonth"
                  label="Mês final"
                  clearEnabled
                  defaultValue={data?.monthlyIncoming.endYearMonth}
                />
              </>
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

export const MonthlyIncomingForm = forwardRef(MonthlyIncomingFormComponent)
