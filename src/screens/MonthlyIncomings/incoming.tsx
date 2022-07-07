import React, { FunctionComponent, useCallback, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { LoadingOverlay } from '../../components/Loading'
import {
  OptionPresets,
  SlideMenu,
  SlideMenuHandles
} from '../../components/SlideMenu'
import { T } from '../../components/T'
import { useStore } from '../../contexts/store'
import {
  MonthlyIncomingFragment,
  useDeleteMonthlyIncomingMutation
} from '../../graphql/generated/graphql'

import { monetize, showMessage } from '../../utils'
import styles from './styles'

export interface IncomingProps {
  data: MonthlyIncomingFragment
}

export const Incoming: FunctionComponent<IncomingProps> = ({ data }) => {
  const slideMenu = useRef<SlideMenuHandles>(null)

  const { monthlyIncomingForm } = useStore()

  const [deleteIncoming, { loading: deleting }] =
    useDeleteMonthlyIncomingMutation({
      variables: { id: data.id },
      refetchQueries: [
        'GetMonthlySummary',
        'GetAvailableBudget',
        'GetMonthlyIncomings'
      ],
      onCompleted () {
        showMessage({ message: 'Rendimento removido!' })
      },
      onError (err) {
        showMessage({
          message: 'Não foi possível remover o rendimento.',
          type: 'error',
          description: err.message
        })
      }
    })

  const handleUpdate = useCallback(() => {
    monthlyIncomingForm.current?.open({ incomingId: data.id })
  }, [data.id, monthlyIncomingForm])

  const handleDelete = useCallback(async () => {
    await deleteIncoming()
  }, [deleteIncoming])

  return (
    <>
      <LoadingOverlay visible={deleting} />

      <SlideMenu
        ref={slideMenu}
        title="Rendimento"
        shouldAwait={false}
        options={[
          OptionPresets.edit({ onPress: handleUpdate }),
          OptionPresets.delete({ onPress: handleDelete })
        ]}
      />

      <TouchableOpacity
        onPress={() => slideMenu.current?.open()}
        style={styles.itemContainer}
      >
        <T
          style={styles.description}
          font={data.description ? 'regular' : 'italic'}
        >
          {data.description ? data.description : 'Sem descrição'}
        </T>
        <T>{monetize(data.amount)}</T>
      </TouchableOpacity>
    </>
  )
}
