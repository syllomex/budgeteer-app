import React, { useCallback, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Feather, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { T } from '../../components/T'
import { monetize, PropType, showMessage, Unpacked } from '../../utils'
import { colors, rem } from '../../config/styles'
import { useStore } from '../../contexts/store'
import { RootStackRouteList } from '../../routes/types'
import {
  GetMonthlySummaryQuery,
  useDeleteCategoryMutation
} from '../../graphql/generated/graphql'
import { SlideMenu, SlideMenuHandles } from '../../components/SlideMenu'
import { LoadingOverlay } from '../../components/Loading'
import { confirm } from '../../components/Confirm'
import styles from './category.styles'

interface CategoryProps {
  data: Unpacked<PropType<GetMonthlySummaryQuery, 'categories'>>
}

export const Category: React.FunctionComponent<CategoryProps> = ({ data }) => {
  const slideMenu = useRef<SlideMenuHandles>(null)

  const { navigate } = useNavigation<RootStackRouteList>()
  const { openExpenditureModal, openCategoryModal } = useStore()

  const [deleteCategory, { loading }] = useDeleteCategoryMutation({
    variables: { id: data.id },
    refetchQueries: ['GetMonthlySummary'],
    onCompleted () {
      showMessage({ message: 'Categoria removida!' })
    },
    onError (err) {
      showMessage({
        message: 'Não foi possível remover a categoria.',
        description: err.message,
        type: 'error'
      })
    }
  })

  const handlePress = () => {
    navigate('Category', {
      category: {
        id: data.id,
        name: data.name
      }
    })
  }

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: 'Remover categoria',
      description: 'Tem certeza de que deseja remover essa categoria?',
      preset: 'delete'
    })
    if (!confirmed) return false
    await deleteCategory()
    return true
  }, [deleteCategory])

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={() => slideMenu.current?.open()}
      delayLongPress={100}
      style={styles.container}
    >
      <LoadingOverlay visible={loading} />

      <SlideMenu
        ref={slideMenu}
        title={data.name}
        shouldAwait={false}
        options={[
          {
            label: 'Adicionar despesa',
            icon: props => <Ionicons name="cart-outline" {...props} />,
            onPress: () => openExpenditureModal?.({ categoryId: data.id })
          },
          {
            label: 'Editar',
            icon: props => <Feather name="edit" {...props} />,
            onPress: () => openCategoryModal({ categoryId: data.id })
          },
          {
            label: 'Remover',
            color: 'danger',
            icon: props => <Feather name="trash" {...props} />,
            onPress: handleDelete
          }
        ]}
      />

      <View style={styles.row}>
        <View style={styles.innerRow}>
          <T style={{ flex: 1 }}>{data.name}</T>
          <T>{monetize(data.totalExpenses ?? 0)}</T>
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => slideMenu.current?.open()}
        >
          <Ionicons name="ellipsis-vertical" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export const NewCategoryButton: React.FunctionComponent<{
  center?: boolean
  textColor?: keyof typeof colors
}> = ({ center, textColor }) => {
  const { openCategoryModal } = useStore()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => openCategoryModal()}
        style={[styles.row, center && { justifyContent: 'center' }]}
      >
        <T c={textColor ?? 'muted'}>Nova categoria</T>
        <Ionicons
          name="add-outline"
          color={textColor ? colors[textColor] : colors.muted}
          size={rem(1.4)}
        />
      </TouchableOpacity>
    </View>
  )
}
