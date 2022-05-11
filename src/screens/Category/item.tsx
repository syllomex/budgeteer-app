import { Feather } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LoadingOverlay } from '../../components/Loading'
import { SlideMenu, SlideMenuHandles } from '../../components/SlideMenu'
import { T } from '../../components/T'
import { Expenditure } from '../../contexts/store'
import { useDeleteExpenditure } from '../../hooks/useDeleteExpenditure'
import { monetize, parseAndDisplay } from '../../utils'
import styles from './item.styles'

interface ItemProps {
  data: Expenditure
  categoryId: string
}

export const Item: React.FunctionComponent<ItemProps> = ({
  data,
  categoryId
}) => {
  const slideMenu = useRef<SlideMenuHandles>(null)

  const { execute: deleteExpenditure, loading } = useDeleteExpenditure({
    categoryId
  })

  return (
    <TouchableOpacity
      key={data.id}
      style={styles.container}
      onPress={() => slideMenu.current?.open()}
    >
      <LoadingOverlay visible={loading} />

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
            onPress: () => deleteExpenditure({ expenditureId: data.id }),
            color: 'danger',
            icon: props => <Feather name="trash" {...props} />
          }
        ]}
      />

      <View style={styles.row}>
        <T style={{ flex: 1 }} c="muted">
          {parseAndDisplay(data.date)}
        </T>
        <T f="medium" s={1.6} c="primary">
          {monetize(data.value)}
        </T>
      </View>
      <T f={data.description ? 'regular' : 'italic'}>
        {data.description ?? 'Sem descrição'}
      </T>
    </TouchableOpacity>
  )
}
