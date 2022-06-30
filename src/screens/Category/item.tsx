import { Feather } from '@expo/vector-icons'
import React, { useCallback, useMemo, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LoadingOverlay } from '../../components/Loading'
import { SlideMenu, SlideMenuHandles } from '../../components/SlideMenu'
import { T } from '../../components/T'
import {
  GetCategoryQuery,
  useDeleteCategoryExpenditureMutation
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

export const Item: React.FunctionComponent<ItemProps> = ({ data }) => {
  const slideMenu = useRef<SlideMenuHandles>(null)

  const [deleteExpenditure, { loading: deleting }] =
    useDeleteCategoryExpenditureMutation({
      variables: { id: data.id },
      refetchQueries: ['GetCategory', 'GetMonthlySummary']
    })

  const handleDeleteExpenditure = useCallback(async () => {
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

  return (
    <TouchableOpacity
      key={data.id}
      style={styles.container}
      onPress={() => slideMenu.current?.open()}
    >
      <LoadingOverlay visible={deleting} />

      <SlideMenu
        ref={slideMenu}
        shouldAwait={false}
        options={[
          {
            label: 'Editar',
            onPress: () => {},
            icon: props => <Feather name="edit" {...props} />
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
        <T style={{ flex: 1 }} c="muted">
          {parseAndDisplay(data.date, { displayFormat: 'Pp' })}
        </T>
        <T f="medium" s={1.6} c="primary">
          {monetize(data.amount)}
        </T>
      </View>
      <T f={data.description ? 'regular' : 'italic'}>
        {data.description ?? 'Sem descrição'}
        {installments}
      </T>
    </TouchableOpacity>
  )
}
