import React, { FunctionComponent, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  OptionPresets,
  SlideMenu,
  SlideMenuHandles
} from '../../components/SlideMenu'
import { T } from '../../components/T'
import { useStore } from '../../contexts/store'
import { MonthlyIncomingFragment } from '../../graphql/generated/graphql'

import { monetize } from '../../utils'

export interface IncomingProps {
  data: MonthlyIncomingFragment
}

export const Incoming: FunctionComponent<IncomingProps> = ({ data }) => {
  const slideMenu = useRef<SlideMenuHandles>(null)

  const { monthlyIncomingForm } = useStore()

  return (
    <>
      <SlideMenu
        ref={slideMenu}
        title="Rendimento"
        options={[
          OptionPresets.edit({
            onPress: () =>
              monthlyIncomingForm.current?.open({ incomingId: data.id })
          })
        ]}
      />

      <TouchableOpacity onPress={() => slideMenu.current?.open()}>
        <T>
          {monetize(data.amount)}
          {'\n'}
          {data.description}
        </T>
      </TouchableOpacity>
    </>
  )
}
