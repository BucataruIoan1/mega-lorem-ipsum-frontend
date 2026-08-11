import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../../api/apiEndpoints.js'
import {
  createManagedEntity,
  deleteManagedEntity,
  fetchManagedEntities,
  updateManagedEntity,
} from '../../api/manageEntitiesApi.js'
import { useIsMobile } from '../Table/hooks/useIsMobile.js'
import SuccessNotify from '../Shared/SuccessNotify/SuccessNotify.tsx'
import ErrorNotify from '../Shared/ErrorNotify/ErrorNotify.tsx'
import ManagementNav from '../ManagementNav/ManagementNav.jsx'
import EntityFormModal from './EntityFormModal.jsx'
import DeleteEntityModal from './DeleteEntityModal.jsx'
import './EntityManagementPage.css'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20h4l10-10-4-4L4 16v4zm11-13l4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M8 20h8a1 1 0 001-1V7H7v12a1 1 0 001 1z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function EntityManagementPage({
  entityKey,
  entityLabel,
  pageTitle,
  pageDescription,
  createDescription,
  manageButtonLabel,
  emptyTitle,
  emptyDescription,
}) {
  const isMobile = useIsMobile()
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
        const response = await fetchManagedEntities(
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

  const handleCreate = async (name) => {
    setMutationPending(true)
    setMutationError('')

    try {
      await createManagedEntity(
        endpoint,
        name,
        `Nu am putut crea ${entityLabel.toLowerCase()}ul.`,
      )
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify(`${entityLabel} a fost adaugat cu succes.`)
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : `Nu am putut crea ${entityLabel.toLowerCase()}ul.`
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
      await updateManagedEntity(
        endpoint,
        editItem.id,
        name,
        `Nu am putut actualiza ${entityLabel.toLowerCase()}ul.`,
      )
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify(`${entityLabel} a fost actualizat cu succes.`)
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
      await deleteManagedEntity(
        endpoint,
        deleteItem.id,
        `Nu am putut sterge ${entityLabel.toLowerCase()}ul.`,
      )
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify(`${entityLabel} a fost sters cu succes.`)
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : `Nu am putut sterge ${entityLabel.toLowerCase()}ul.`
      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  return (
    <main className="management-page management-page-bg">
      <section className="management-shell">
        <div className="management-header">
          <ManagementNav showBackIcon />

          <div className="management-hero">
            <div className="management-heading">
              <h1 className="management-title">{pageTitle}</h1>
              <p className="management-subtitle">{pageDescription}</p>
            </div>

            <button
              type="button"
              className="management-primary-button"
              onClick={() => {
                setMutationError('')
                setIsAddOpen(true)
              }}
            >
              <span className="management-primary-button-icon" aria-hidden="true">
                <PlusIcon />
              </span>
              {manageButtonLabel}
            </button>
          </div>
        </div>

        <section className="management-list-shell">
          {isLoading ? (
            <section className="management-empty-state">
              <h2>Se incarca datele</h2>
              <p>Preluam {entityLabel.toLowerCase()}ii din backend.</p>
            </section>
          ) : errorMessage ? (
            <section className="management-empty-state">
              <h2>Nu am putut incarca datele</h2>
              <p>{errorMessage}</p>
            </section>
          ) : items.length > 0 ? (
            !isMobile ? (
              <div className="management-table-wrap">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th scope="col">{entityLabel} Name</th>
                      <th scope="col" className="management-actions-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="management-row">
                        <td className="management-cell">{item.name}</td>
                        <td className="management-cell management-cell-actions">
                          <div className="management-actions">
                            <button
                              type="button"
                              className="management-action-button"
                              onClick={() => {
                                setMutationError('')
                                setEditItem(item)
                              }}
                              aria-label={`Edit ${entityLabel} ${item.name}`}
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              className="management-action-button"
                              onClick={() => {
                                setMutationError('')
                                setDeleteItem(item)
                              }}
                              aria-label={`Delete ${entityLabel} ${item.name}`}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="management-mobile-list">
                {items.map((item) => (
                  <article key={item.id} className="management-mobile-card">
                    <div className="management-mobile-copy">
                      <span className="management-mobile-label">{entityLabel} Name</span>
                      <strong className="management-mobile-value">{item.name}</strong>
                    </div>

                    <div className="management-actions">
                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() => {
                          setMutationError('')
                          setEditItem(item)
                        }}
                        aria-label={`Edit ${entityLabel} ${item.name}`}
                      >
                        <EditIcon />
                      </button>

                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() => {
                          setMutationError('')
                          setDeleteItem(item)
                        }}
                        aria-label={`Delete ${entityLabel} ${item.name}`}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            <section className="management-empty-state">
              <h2>{emptyTitle}</h2>
              <p>{emptyDescription}</p>
              <Link to="/records" className="management-back-link">
                Inapoi la records
              </Link>
            </section>
          )}
        </section>
      </section>

      <EntityFormModal
        key={isAddOpen ? 'create-open' : 'create-closed'}
        open={isAddOpen}
        mode="create"
        entityLabel={entityLabel}
        pending={mutationPending}
        serverError={mutationError}
        initialValue=""
        placeholder={`e.g. ${entityLabel === 'Owner' ? 'Ada Lovelace' : 'Technology'}`}
        description={createDescription}
        onClose={closeAllModals}
        onSubmit={handleCreate}
      />

      <EntityFormModal
        key={`${editItem?.id ?? 'empty'}-${editItem ? 'edit-open' : 'edit-closed'}`}
        open={Boolean(editItem)}
        mode="edit"
        entityLabel={entityLabel}
        pending={mutationPending}
        serverError={mutationError}
        initialValue={editItem?.name ?? ''}
        placeholder={`Rename ${entityLabel.toLowerCase()}...`}
        description={createDescription}
        onClose={closeAllModals}
        onSubmit={handleUpdate}
      />

      <DeleteEntityModal
        open={Boolean(deleteItem)}
        entityLabel={entityLabel}
        item={deleteItem}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeAllModals}
        onConfirm={handleDelete}
      />

      <SuccessNotify
        message={successNotify.message}
        visible={successNotify.visible}
        onClose={closeSuccessNotify}
      />

      <ErrorNotify
        message={errorNotify.message}
        visible={errorNotify.visible}
        onClose={closeErrorNotify}
      />
    </main>
  )
}

export default EntityManagementPage
