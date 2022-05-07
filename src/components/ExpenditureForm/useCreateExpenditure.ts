import { useState, useCallback } from 'react'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../contexts/auth'
import { useStore } from '../../contexts/store'

export const useCreateExpenditure = ({
  categoryId,
  onSuccess
}: {
  categoryId: string
  onSuccess(): void
}) => {
  const { user } = useAuth()
  const { monthId, getCategoriesRef } = useStore()

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async data => {
      try {
        if (!user) return
        if (!monthId) return
        if (!data.value) return

        setLoading(true)

        const categoryRef = getCategoriesRef().doc(categoryId)

        await categoryRef.collection('expenditures').add({
          ...data,
          typename: 'Expenditure',
          createdAt: new Date().toISOString()
        })

        const currentCategory = await categoryRef.get()
        const currentTotal = currentCategory?.data()?.total || 0

        await categoryRef.set(
          { total: currentTotal + data.value },
          { merge: true }
        )

        Toast.show({ type: 'success', text1: 'Gasto adicionado!' })
        onSuccess()
      } finally {
        setLoading(false)
      }
    },
    [categoryId, getCategoriesRef, monthId, onSuccess, user]
  )

  return { onSubmit, loading }
}
