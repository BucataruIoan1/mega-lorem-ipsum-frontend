import { Link } from 'react-router-dom'
import AddButton from '../../AddButton/AddButton.jsx'
import FilterButton from '../../FilterButton/FilterButton.jsx'
import Grid from '../../Grid/components/Grid.jsx'
import HeaderTable from '../../HeaderTable/HeaderTable.jsx'
import AddRecordModal from '../../AddRecordModal/components/AddRecordModal.jsx'
import BulkLoremModal from '../../BulkLoremModal/components/BulkLoremModal.jsx'
import DeleteRecordModal from '../../DeleteRecordModal/DeleteRecordModal.jsx'
import EditRecordModal from '../../EditRecordModal/components/EditRecordModal.jsx'
import PeopleIcon from '../../Shared/PeopleIcon/PeopleIcon.tsx'
import SparklesIcon from '../../Shared/SparklesIcon/SparklesIcon.tsx'
import TagIcon from '../../Shared/TagIcon/TagIcon.tsx'
import SuccessNotify from '../../Shared/SuccessNotify/SuccessNotify.tsx'
import ErrorNotify from '../../Shared/ErrorNotify/ErrorNotify.tsx'
import { useIsMobile } from '../../../hooks/useIsMobile.js'

import useTable from '../hooks/useTable.js'
import TABLE_COLUMNS from './TableColumns.jsx'

import './Table.css'

function Table() {
  const {
    rows,
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    visibleStart,
    visibleEnd,

    sortBy,
    sortDir,

    searchQuery,
    isLoading,
    errorMessage,

    lookups,
    lookupsLoading,
    lookupsError,

    selectedRecord,
    selectedRecordLoading,

    modalType,

    mutationPending,
    mutationError,

    successNotify,
    errorNotify,

    openAddModal,
    openBulkModal,
    openEditModal,
    openDeleteModal,
    closeModal,

    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,

    handleCreateRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    handleBulkCreate,

    closeSuccessNotify,
    closeErrorNotify,
  } = useTable()

  const isMobile = useIsMobile()
  const isAddModalOpen = modalType === 'add'
  const isEditModalOpen = modalType === 'edit'
  const isDeleteModalOpen = modalType === 'delete'
  const isBulkModalOpen = modalType === 'bulk'

  return (
    <main className="table-page workbench-bg">
      <section className="table-shell">
        <div className="table-toolbar">
          <HeaderTable
            navigation={
              <div className="table-header-navigation">
                <Link
                  to="/owners"
                  className="table-header-link"
                >
                  <span
                    className="table-header-link-icon"
                    aria-hidden="true"
                  >
                    <PeopleIcon />
                  </span>

                  Manage Owners
                </Link>

                <Link
                  to="/categories"
                  className="table-header-link"
                >
                  <span
                    className="table-header-link-icon"
                    aria-hidden="true"
                  >
                    <TagIcon />
                  </span>

                  Manage Categories
                </Link>
              </div>
            }
          />

          <div className="table-toolbar-actions">
            <FilterButton
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <button
              type="button"
              className="table-bulk-button"
              onClick={openBulkModal}
            >
              <span
                className="table-add-icon"
                aria-hidden="true"
              >
                <SparklesIcon />
              </span>

              Add Lorem Bulk
            </button>

            <AddButton onClick={openAddModal} />
          </div>
        </div>

        {isLoading && rows.length === 0 ? (
          <section className="table-empty-state">
            <h2>Se incarca inregistrarile</h2>
            <p>
              Preluam pagina curenta cu search, sortare si
              paginare.
            </p>
          </section>
        ) : errorMessage ? (
          <section className="table-empty-state">
            <h2>Nu am putut incarca datele</h2>
            <p>{errorMessage}</p>
          </section>
        ) : rows.length > 0 ? (
          <Grid
            columns={TABLE_COLUMNS}
            rows={rows}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            startIndex={visibleStart}
            endIndex={visibleEnd}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            isMobile={isMobile}
            onEditRow={openEditModal}
            onDeleteRow={openDeleteModal}
          />
        ) : (
          <section className="table-empty-state">
            <h2>Nu exista inregistrari</h2>

            <p>
              Incearca un alt termen de cautare sau reseteaza
              sortarea si pagina curenta.
            </p>
          </section>
        )}
      </section>

      <AddRecordModal
        key={isAddModalOpen ? 'add-open' : 'add-closed'}
        open={isAddModalOpen}
        lookups={lookups}
        lookupsLoading={lookupsLoading}
        lookupsError={lookupsError}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeModal}
        onSubmit={handleCreateRecord}
      />

      <EditRecordModal
        key={`${selectedRecord?.rawId ?? 'empty'}-${
          isEditModalOpen ? 'open' : 'closed'
        }`}
        open={
          isEditModalOpen &&
          !selectedRecordLoading &&
          Boolean(selectedRecord)
        }
        record={selectedRecord}
        lookups={lookups}
        lookupsLoading={lookupsLoading}
        lookupsError={lookupsError}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeModal}
        onSubmit={handleUpdateRecord}
      />

      <DeleteRecordModal
        open={
          isDeleteModalOpen &&
          !selectedRecordLoading &&
          Boolean(selectedRecord)
        }
        record={selectedRecord}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeModal}
        onConfirm={handleDeleteRecord}
      />

      <BulkLoremModal
        key={isBulkModalOpen ? 'bulk-open' : 'bulk-closed'}
        open={isBulkModalOpen}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeModal}
        onSubmit={handleBulkCreate}
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

export default Table
