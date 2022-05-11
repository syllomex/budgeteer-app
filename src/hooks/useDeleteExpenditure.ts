import { useState, useCallback } from 'react'
import Toast from 'react-native-toast-message'
import { useAuth } from '../contexts/auth'
import { useStore } from '../contexts/store'

export const useDeleteExpenditure = ({
  categoryId,
  onSuccess
}: {
  categoryId: string
  onSuccess?: () => void
}) => {
  const { user } = useAuth()
  const { monthId, getCategoriesRef } = useStore()

  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    async ({ expenditureId }: { expenditureId: string }) => {
      try {
        if (!user) return
        if (!monthId) return
        if (!expenditureId) return

        setLoading(true)

        const categoryRef = getCategoriesRef().doc(categoryId)

        const currentExpenditure = await categoryRef
          .collection('expenditures')
          .doc(expenditureId)
          .get()

        const currentValue = currentExpenditure.data().value ?? 0

        await categoryRef.collection('expenditures').doc(expenditureId).delete()

        const currentCategory = await categoryRef.get()
        const currentTotal = currentCategory?.data()?.total || 0

        await categoryRef.set(
          { total: Math.max(currentTotal - currentValue, 0) },
          { merge: true }
        )

        Toast.show({ type: 'success', text1: 'Gasto removido!' })
        onSuccess?.()
      } catch {
        setLoading(false)
      }
    },
    [categoryId, getCategoriesRef, monthId, onSuccess, user]
  )

  return { execute, loading }
}
