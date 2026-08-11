import { useState } from 'react'

const BULK_OPTIONS = [10, 20, 50, 100, 200]
const DEFAULT_BULK_COUNT = 20

function useBulkLoremModal(onSubmit) {
  const [selectedCount, setSelectedCount] = useState(DEFAULT_BULK_COUNT)
  const [formError, setFormError] = useState('')

  const handleCountChange = (count) => {
    setSelectedCount(count)
    setFormError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!BULK_OPTIONS.includes(selectedCount)) {
      setFormError(
        'Alege una dintre valorile permise: 10, 20, 50, 100 sau 200.',
      )
      return
    }

    onSubmit(selectedCount)
  }

  return {
    selectedCount,
    formError,
    bulkOptions: BULK_OPTIONS,
    handleCountChange,
    handleSubmit,
  }
}

export default useBulkLoremModal