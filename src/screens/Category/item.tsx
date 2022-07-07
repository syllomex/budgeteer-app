import { Feather } from '@expo/vector-icons'
import React, { useCallback, useMemo, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { confirm } from '../../components/Confirm'
import { Checkbox } from '../../components/Form/Checkbox'
import { LoadingIndicator, LoadingOverlay } from '../../components/Loading'
import { SlideMenu, SlideMenuHandles } from '../../components/SlideMenu'
import { T } from '../../components/T'
import { useStore } from '../../contexts/store'
import {
  GetCategoryQuery,
  useDeleteCategoryExpenditureMutation,
  useUpdateCategoryExpenditureInMonthMutation
} from '../../graphql/generated/graphql'
import {
  monetize,
  parseAndDisplay,
  PropType,
  showMessage,
  Unpacked
} from '../../utils'
import styles from './item.styles'

type Expenditure = Unpacked<
  PropType<PropType<GetCategoryQuery, 'category'>, 'expenditures'>
>

interface ItemProps {
  data: Expenditure
  categoryId: string
}

export const Item: React.FunctionComponent<ItemProps> = ({
  data,
  categoryId
}) => {
  const { openExpenditureModal, openExpenditureMonthlyModal, yearMonth } =
    useStore()

  const slideMenu = useRef<SlideMenuHandles>(null)

  const [updateMonthlyExpenditure, { loading: updating }] =
    useUpdateCategoryExpenditureInMonthMutation({
      refetchQueries: [
        'GetCategory',
        'GetMonthlySummary',
        'GetAvailableBudget'
      ],
      onCompleted () {
        showMessage({ message: 'Despesa atualizada!' })
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível atualizar a despesa.',
          description: err.message,
          type: 'error'
        })
      }
    })

  const [deleteExpenditure, { loading: deleting }] =
    useDeleteCategoryExpenditureMutation({
      variables: { id: data.id },
      refetchQueries: ['GetCategory', 'GetMonthlySummary', 'GetAvailableBudget']
    })

  const handleUpdateExpenditure = useCallback(async () => {
    openExpenditureModal?.({
      categoryId,
      expenditureId: data.id
    })
  }, [categoryId, data.id, openExpenditureModal])

  const handleUpdateInMonth = useCallback(async () => {
    openExpenditureMonthlyModal?.({ expenditureId: data.id })
  }, [data.id, openExpenditureMonthlyModal])

  const handleDeleteExpenditure = useCallback(async () => {
    const confirmed = await confirm({
      title: 'Remover despesa',
      description: 'Tem certeza de que deseja remover essa despesa?',
      preset: 'delete'
    })
    if (!confirmed) return false
    const result = await deleteExpenditure()
    const success = !!result.data
    if (success) showMessage({ message: 'Despesa removida!' })
    return success
  }, [deleteExpenditure])

  const installments = useMemo(() => {
    if (typeof data.numberOfInstallments !== 'number') {
      return null
    }

    return ` ${data.currentInstallment ?? 0}/${data.numberOfInstallments}`
  }, [data.currentInstallment, data.numberOfInstallments])

  const isPaid = useMemo(() => {
    return !!data.monthly?.paid
  }, [data.monthly?.paid])

  const handleTogglePaid = useCallback(async () => {
    await updateMonthlyExpenditure({
      variables: { id: data.id, yearMonth, data: { paid: !isPaid } }
    })
  }, [data.id, isPaid, updateMonthlyExpenditure, yearMonth])

  return (
    <TouchableOpacity
      key={data.id}
      style={styles.container}
      onPress={() => slideMenu.current?.open()}
    >
      <LoadingOverlay visible={deleting} />

      <View style={styles.checkBoxContainer}>
        {updating ? (
          <LoadingIndicator size="small" />
        ) : (
          <Checkbox onChange={handleTogglePaid} value={isPaid} />
        )}
      </View>
      <View style={styles.expenditureContainer}>
        <SlideMenu
          ref={slideMenu}
          shouldAwait={false}
          options={[
            {
              label: 'Editar',
              onPress: handleUpdateExpenditure,
              icon: props => <Feather name="edit" {...props} />
            },
            {
              label: 'Editar valor no mês atual',
              onPress: handleUpdateInMonth,
              icon: props => <Feather name="calendar" {...props} />
            },
            {
              label: 'Remover',
              onPress: handleDeleteExpenditure,
              color: 'danger',
              icon: props => <Feather name="trash" {...props} />
            }
          ]}
        />

        <View style={styles.row}>
          <T style={{ flex: 1 }} f={data.description ? 'regular' : 'italic'}>
            {data.description ? data.description : 'Sem descrição'}
            {installments}
          </T>
          <T f="medium" s={1.6} c="primary">
            {monetize(data.monthly?.amount ?? data.amount)}
          </T>
        </View>
        <T c="muted" size={1.2}>
          {parseAndDisplay(data.date, { displayFormat: 'Pp' })}
        </T>
      </View>
    </TouchableOpacity>
  )
}
