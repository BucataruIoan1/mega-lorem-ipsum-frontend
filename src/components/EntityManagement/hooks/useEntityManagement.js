import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../../api/apiEndpoints.js'
import {
  getEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from '../services/entityManagementService.js'

function useEntityManagement(entityKey, entityLabel) {
  const endpoint = API_ENDPOINTS[entityKey]

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)

  const [mutationPending, setMutationPending] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [successNotify, setSuccessNotify] = useState({
    visible: false,
    message: '',
  })

  const [errorNotify, setErrorNotify] = useState({
    visible: false,
    message: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getEntities(
          endpoint,
          `Nu am putut incarca ${entityLabel.toLowerCase()}ii.`,
          controller.signal,
        )

        setItems(response)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setItems([])
        setErrorMessage(error.message)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadItems()

    return () => controller.abort()
  }, [endpoint, entityLabel, refreshKey])

  const closeSuccessNotify = () => {
    setSuccessNotify((currentState) => ({
      ...currentState,
      visible: false,
    }))
  }

  const closeErrorNotify = () => {
    setErrorNotify((currentState) => ({
      ...currentState,
      visible: false,
    }))
  }

  const showSuccessNotify = (message) => {
    closeErrorNotify()

    setSuccessNotify({
      visible: true,
      message,
    })
  }

  const showErrorNotify = (message) => {
    closeSuccessNotify()

    setErrorNotify({
      visible: true,
      message,
    })
  }

  const closeAllModals = () => {
    setIsAddOpen(false)
    setEditItem(null)
    setDeleteItem(null)
    setMutationError('')
  }

  const openAddModal = () => {
    setMutationError('')
    setIsAddOpen(true)
  }

  const openEditModal = (item) => {
    setMutationError('')
    setEditItem(item)
  }

  const openDeleteModal = (item) => {
    setMutationError('')
    setDeleteItem(item)
  }

  const refreshItems = () => {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  const handleCreate = async (name) => {
    setMutationPending(true)
    setMutationError('')

    try {
      await createEntity(
        endpoint,
        name,
        `Nu am putut crea ${entityLabel.toLowerCase()}ul.`,
      )

      closeAllModals()
      refreshItems()

      showSuccessNotify(
        `${entityLabel} a fost adaugat cu succes.`,
      )
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : `Nu am putut crea ${entityLabel.toLowerCase()}ul.`

      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  const handleUpdate = async (name) => {
    if (!editItem?.id) {
      return
    }

    setMutationPending(true)
    setMutationError('')

    try {
      await updateEntity(
        endpoint,
        editItem.id,
        name,
        `Nu am putut actualiza ${entityLabel.toLowerCase()}ul.`,
      )

      closeAllModals()
      refreshItems()

      showSuccessNotify(
        `${entityLabel} a fost actualizat cu succes.`,
      )
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : `Nu am putut actualiza ${entityLabel.toLowerCase()}ul.`

      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem?.id) {
      return
    }

    setMutationPending(true)
    setMutationError('')

    try {
      await deleteEntity(
        endpoint,
        deleteItem.id,
        `Nu am putut sterge ${entityLabel.toLowerCase()}ul.`,
      )

      closeAllModals()
      refreshItems()

      showSuccessNotify(
        `${entityLabel} a fost sters cu succes.`,
      )
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : `Nu am putut sterge ${entityLabel.toLowerCase()}ul.`

      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  return {
    items,
    isLoading,
    errorMessage,

    isAddOpen,
    editItem,
    deleteItem,

    mutationPending,
    mutationError,

    successNotify,
    errorNotify,

    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,

    handleCreate,
    handleUpdate,
    handleDelete,

    closeSuccessNotify,
    closeErrorNotify,
  }
}

export default useEntityManagement