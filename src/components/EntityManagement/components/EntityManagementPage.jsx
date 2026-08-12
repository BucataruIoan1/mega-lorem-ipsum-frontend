import { Link } from 'react-router-dom'
import { useIsMobile } from '../../../hooks/useIsMobile.js'
import DeleteIcon from '../../Shared/DeleteIcon/DeleteIcon.tsx'
import EditIcon from '../../Shared/EditIcon/EditIcon.tsx'
import PlusIcon from '../../Shared/PlusIcon/PlusIcon.tsx'
import SuccessNotify from '../../Shared/SuccessNotify/SuccessNotify.tsx'
import ErrorNotify from '../../Shared/ErrorNotify/ErrorNotify.tsx'
import ManagementNav from '../../ManagementNav/ManagementNav.jsx'
import EntityFormModal from './EntityFormModal.jsx'
import DeleteEntityModal from './DeleteEntityModal.jsx'
import useEntityManagement from '../hooks/useEntityManagement.js'
import './EntityManagementPage.css'

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

  const {
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
  } = useEntityManagement(entityKey, entityLabel)

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
              onClick={openAddModal}
            >
              <span
                className="management-primary-button-icon"
                aria-hidden="true"
              >
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
              <p>Preluam {entityLabel.toLowerCase()}ii.</p>
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

                      <th
                        scope="col"
                        className="management-actions-header"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="management-row"
                      >
                        <td className="management-cell">
                          {item.name}
                        </td>

                        <td className="management-cell management-cell-actions">
                          <div className="management-actions">
                            <button
                              type="button"
                              className="management-action-button"
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${entityLabel} ${item.name}`}
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              className="management-action-button"
                              onClick={() => openDeleteModal(item)}
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
                  <article
                    key={item.id}
                    className="management-mobile-card"
                  >
                    <div className="management-mobile-copy">
                      <span className="management-mobile-label">
                        {entityLabel} Name
                      </span>

                      <strong className="management-mobile-value">
                        {item.name}
                      </strong>
                    </div>

                    <div className="management-actions">
                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() => openEditModal(item)}
                        aria-label={`Edit ${entityLabel} ${item.name}`}
                      >
                        <EditIcon />
                      </button>

                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() => openDeleteModal(item)}
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

              <Link
                to="/records"
                className="management-back-link"
              >
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
        placeholder={`e.g. ${
          entityLabel === 'Owner'
            ? 'Ada Lovelace'
            : 'Technology'
        }`}
        description={createDescription}
        onClose={closeAllModals}
        onSubmit={handleCreate}
      />

      <EntityFormModal
        key={`${editItem?.id ?? 'empty'}-${
          editItem ? 'edit-open' : 'edit-closed'
        }`}
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
