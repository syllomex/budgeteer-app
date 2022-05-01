import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import { T } from '../../components/T'
import { monetize } from '../../utils'
import { useDashboard } from '../../hooks'
import styles from './category.styles'

interface CategoryProps {
  data: {
    uid: string
    name: string
  }
}

export const Category: React.FunctionComponent<CategoryProps> = ({ data }) => {
  const { getCategoryExpendituresRef } = useDashboard()

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const subscriber = getCategoryExpendituresRef(data.uid).onSnapshot(
      snapshot => {
        setTotal(
          snapshot.docs.reduce((acc, doc) => {
            return acc + (doc.data().value ?? 0)
          }, 0)
        )
      }
    )

    return subscriber
  }, [data.uid, getCategoryExpendituresRef])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <T style={{ flex: 1 }}>{data.name}</T>
        <T>{monetize(total)}</T>
      </View>
    </View>
  )
}
