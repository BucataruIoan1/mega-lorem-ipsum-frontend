import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile.js'
import AddButton from '../../AddButton/AddButton.jsx'
import FilterButton from '../../FilterButton/FilterButton.jsx'
import Grid from '../../Grid/Grid.jsx'
import HeaderTable from '../../HeaderTable/HeaderTable.jsx'
import AddRecordModal from '../../AddRecordModal/AddRecordModal.jsx'
import BulkLoremModal from '../../BulkLoremModal/BulkLoremModal.jsx'
import DeleteRecordModal from '../../DeleteRecordModal/DeleteRecordModal.jsx'
import EditRecordModal from '../../EditRecordModal/EditRecordModal.jsx'
import SuccessNotify from '../../Shared/SuccessNotify/SuccessNotify.tsx'
import ErrorNotify from '../../Shared/ErrorNotify/ErrorNotify.tsx'
import { fetchRecordLookups } from '../../../api/lookupsApi.js'
import {
  ALL_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
  createRecord,
  deleteRecord,
  fetchRecordById,
  fetchRecords,
  generateLoremRecords,
  updateRecord,
} from '../../../api/recordsApi.js'
import './Table.css'

const EMPTY_LOOKUPS = {
  categories: [],
  statuses: [],
  priorities: [],
  owners: [],
}

const DEFAULT_SORT_BY = 'id'
const DEFAULT_SORT_DIR = 'asc'
const VALID_MODAL_TYPES = new Set(['add', 'edit', 'delete', 'bulk'])

function getPositiveNumber(value, fallbackValue) {
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue
}

function getPageSizeValue(value) {
  if (value === ALL_PAGE_SIZE) {
    return ALL_PAGE_SIZE
  }

  const parsedValue = Number(value)
  return [10, 20, 50].includes(parsedValue) ? parsedValue : DEFAULT_PAGE_SIZE
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m20.59 13.41-7.18 7.18a2 2 0 0 1-2.82 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82ZM7.5 7.5h.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Zm7 10 1 2.5L22.5 16 20 17l-1 2.5L18 17l-2.5-1 2.5-1 .9-2Zm-14 2 1.1 2.9L9 19l-2.9 1.1L5 23l-1.1-2.9L1 19l2.9-1.1L5 15Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function Table() {
  const isMobile = useIsMobile()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterValue, setFilterValue] = useState(() => searchParams.get('search') ?? '')
  const [rows, setRows] = useState([])
  const [resolvedPage, setResolvedPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [fetchedRecordState, setFetchedRecordState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [lookups, setLookups] = useState(EMPTY_LOOKUPS)
  const [lookupsLoading, setLookupsLoading] = useState(true)
  const [lookupsError, setLookupsError] = useState('')
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

  const columns = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        sortValue: (row) => row.rawId ?? 0,
        render: (row) => <span className="grid-id-text">{row.id}</span>,
      },
      {
        key: 'content',
        label: 'Content Segment',
        sortable: true,
        sortValue: (row) => row.content,
        render: (row) => (
          <div className="grid-content">
            <strong className="grid-content-title">{row.content}</strong>
            {row.description ? (
              <span className="grid-content-description">{row.description}</span>
            ) : null}
          </div>
        ),
      },
      {
        key: 'category',
        label: 'Category',
        sortable: true,
        sortValue: (row) => row.category,
        render: (row) => (
          <span className="grid-badge grid-badge-category">{row.category}</span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        sortValue: (row) => row.status,
        render: (row) => {
          const normalizedStatus = String(row.status).trim().toLowerCase()
          const statusClassName =
            normalizedStatus === 'inactive'
              ? 'grid-badge-status-inactive'
              : 'grid-badge-status-active'

          return (
            <span className={`grid-badge grid-badge-status ${statusClassName}`}>
              <span className="grid-badge-dot" aria-hidden="true" />
              {row.status}
            </span>
          )
        },
      },
      {
        key: 'owner',
        label: 'Owner',
        sortable: true,
        sortValue: (row) => row.owner,
        render: (row) => {
          const [firstName, ...lastNameParts] = row.owner.split(' ')
          return (
            <span className="grid-owner">
              <span>{firstName}</span>
              <span>{lastNameParts.join(' ')}</span>
            </span>
          )
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        sortable: true,
        sortValue: (row) => row.priority,
        render: (row) => (
          <span
            className={`grid-badge ${`grid-badge-priority-${String(row.priority)
              .toLowerCase()
              .replace(/\s+/g, '-')}`}`}
          >
            {row.priority}
          </span>
        ),
      },
      {
        key: 'lastModified',
        label: 'Last Modified',
        sortable: true,
        sortValue: (row) => row.lastModified,
        render: (row) => <span className="grid-last-modified">{row.lastModified}</span>,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: () => null,
      },
    ],
    [],
  )

  const sortableColumnKeys = useMemo(
    () => new Set(columns.filter((column) => column.sortable).map((column) => column.key)),
    [columns],
  )

  const searchQuery = searchParams.get('search') ?? ''
  const currentPage = getPositiveNumber(searchParams.get('page'), 1)
  const pageSize = getPageSizeValue(searchParams.get('pageSize'))
  const requestedSortBy = searchParams.get('sortBy')
  const sortBy = sortableColumnKeys.has(requestedSortBy) ? requestedSortBy : DEFAULT_SORT_BY
  const sortDir = searchParams.get('sortDir') === 'desc' ? 'desc' : DEFAULT_SORT_DIR
  const modalType = VALID_MODAL_TYPES.has(searchParams.get('modal'))
    ? searchParams.get('modal')
    : null
  const modalRecordId = getPositiveNumber(searchParams.get('recordId'), null)

  const setTableParams = useCallback(
    (updates, options = {}) => {
      const nextParams = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined) {
          return
        }

        if (value === null || value === '') {
          nextParams.delete(key)
          return
        }

        nextParams.set(key, String(value))
      })

      setSearchParams(nextParams, { replace: options.replace ?? false })
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    if (filterValue === searchQuery) {
      return
    }

    const debounceId = window.setTimeout(() => {
      setTableParams({ search: filterValue || null, page: 1 }, { replace: true })
    }, 250)

    return () => window.clearTimeout(debounceId)
  }, [filterValue, searchQuery, setTableParams])

  useEffect(() => {
    const controller = new AbortController()

    async function loadLookups() {
      setLookupsLoading(true)
      setLookupsError('')

      try {
        const response = await fetchRecordLookups(controller.signal)
        setLookups(response)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setLookups(EMPTY_LOOKUPS)
        setLookupsError(error.message)
      } finally {
        if (!controller.signal.aborted) {
          setLookupsLoading(false)
        }
      }
    }

    loadLookups()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecords() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetchRecords({
          page: currentPage,
          pageSize,
          search: searchQuery,
          sortBy,
          sortDir,
          signal: controller.signal,
        })

        setRows(response.rows)
        setResolvedPage(response.currentPage)
        setTotalPages(response.totalPages)
        setTotalRecords(response.totalRecords)

        if (response.currentPage !== currentPage) {
          setTableParams({ page: response.currentPage }, { replace: true })
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setRows([])
        setResolvedPage(1)
        setTotalPages(1)
        setTotalRecords(0)
        setErrorMessage(error.message)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadRecords()

    return () => controller.abort()
  }, [currentPage, pageSize, refreshKey, searchQuery, setTableParams, sortBy, sortDir])

  useEffect(() => {
    if (!modalRecordId || !['edit', 'delete'].includes(modalType)) {
      return undefined
    }

    const controller = new AbortController()

    async function loadRecord() {
      try {
        const response = await fetchRecordById(modalRecordId, controller.signal)
        setFetchedRecordState({
          recordId: modalRecordId,
          record: response,
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setMutationError(error.message)
        setErrorNotify({
          visible: true,
          message: error.message,
        })
        setTableParams({ modal: null, recordId: null }, { replace: true })
      }
    }

    loadRecord()

    return () => controller.abort()
  }, [modalRecordId, modalType, refreshKey, setTableParams])

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const numericPageSize =
    pageSize === ALL_PAGE_SIZE ? Math.max(rows.length, totalRecords, 1) : pageSize
  const visibleStart = totalRecords === 0 ? 0 : (resolvedPage - 1) * numericPageSize + 1
  const visibleEnd = totalRecords === 0 ? 0 : visibleStart + rows.length - 1

  const selectedRecord =
    modalRecordId !== null
      ? fetchedRecordState?.recordId === modalRecordId
        ? fetchedRecordState.record
        : rows.find((row) => row.rawId === modalRecordId) ?? null
      : null

  const isAddModalOpen = modalType === 'add'
  const isBulkModalOpen = modalType === 'bulk'
  const isEditModalOpen = modalType === 'edit' && Boolean(selectedRecord)
  const isDeleteModalOpen = modalType === 'delete' && Boolean(selectedRecord)

  useEffect(() => {
    if (currentPage === safeCurrentPage) {
      return
    }

    setTableParams({ page: safeCurrentPage }, { replace: true })
  }, [currentPage, safeCurrentPage, setTableParams])

  const closeAllModals = useCallback(() => {
    setMutationError('')
    setTableParams({ modal: null, recordId: null })
  }, [setTableParams])

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

  const openAddModal = () => {
    setMutationError('')
    setTableParams({ modal: 'add', recordId: null })
  }

  const openBulkModal = () => {
    setMutationError('')
    setTableParams({ modal: 'bulk', recordId: null })
  }

  const openEditModal = (row) => {
    setMutationError('')
    setTableParams({ modal: 'edit', recordId: row.rawId })
  }

  const openDeleteModal = (row) => {
    setMutationError('')
    setTableParams({ modal: 'delete', recordId: row.rawId })
  }

  const handlePageChange = (nextPage) => {
    setTableParams({ page: Math.min(Math.max(nextPage, 1), totalPages) })
  }

  const handlePageSizeChange = (nextPageSize) => {
    setTableParams({
      pageSize: nextPageSize,
      page: 1,
    })
  }

  const handleSortChange = (columnKey) => {
    const nextSortDir =
      sortBy === columnKey ? (sortDir === 'asc' ? 'desc' : 'asc') : DEFAULT_SORT_DIR

    setTableParams({
      sortBy: columnKey === DEFAULT_SORT_BY ? null : columnKey,
      sortDir: nextSortDir === DEFAULT_SORT_DIR ? null : nextSortDir,
      page: 1,
    })
  }

  const handleCreateRecord = async (form) => {
    setMutationPending(true)
    setMutationError('')

    try {
      await createRecord(form)
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify('Inregistrarea a fost adaugata cu succes.')
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'Nu am putut crea inregistrarea.'
      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  const handleUpdateRecord = async (form) => {
    if (!selectedRecord?.rawId) {
      return
    }

    setMutationPending(true)
    setMutationError('')

    try {
      await updateRecord(selectedRecord.rawId, form)
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify('Inregistrarea a fost actualizata cu succes.')
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : 'Nu am putut actualiza inregistrarea.'
      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  const handleDeleteRecord = async () => {
    if (!selectedRecord?.rawId) {
      return
    }

    setMutationPending(true)
    setMutationError('')

    try {
      await deleteRecord(selectedRecord.rawId)
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify('Inregistrarea a fost stearsa cu succes.')
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : 'Nu am putut sterge inregistrarea.'
      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  const handleBulkCreate = async (count) => {
    setMutationPending(true)
    setMutationError('')

    try {
      const response = await generateLoremRecords(count)
      closeAllModals()
      setRefreshKey((currentKey) => currentKey + 1)
      showSuccessNotify(response?.message ?? `Am generat ${count} inregistrari lorem.`)
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : 'Nu am putut genera inregistrarile lorem.'
      setMutationError(nextMessage)
      showErrorNotify(nextMessage)
    } finally {
      setMutationPending(false)
    }
  }

  return (
    <main className="table-page workbench-bg">
      <section className="table-shell">
        <div className="table-toolbar">
          <HeaderTable
            navigation={
              <div className="table-header-navigation">
                <Link to="/owners" className="table-header-link">
                  <span className="table-header-link-icon" aria-hidden="true">
                    <PeopleIcon />
                  </span>
                  Manage Owners
                </Link>

                <Link to="/categories" className="table-header-link">
                  <span className="table-header-link-icon" aria-hidden="true">
                    <TagIcon />
                  </span>
                  Manage Categories
                </Link>
              </div>
            }
          />

          <div className="table-toolbar-actions">
            <FilterButton value={filterValue} onChange={setFilterValue} />
            <button type="button" className="table-bulk-button" onClick={openBulkModal}>
              <span className="table-add-icon" aria-hidden="true">
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
            <p>Preluam pagina curenta din backend cu search, sortare si paginare sincronizate.</p>
          </section>
        ) : errorMessage ? (
          <section className="table-empty-state">
            <h2>Nu am putut incarca datele</h2>
            <p>{errorMessage}</p>
          </section>
        ) : rows.length > 0 ? (
          <Grid
            columns={columns}
            rows={rows}
            currentPage={resolvedPage}
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
            <p>Incearca un alt termen de cautare sau reseteaza sortarea si pagina curenta.</p>
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
        onClose={closeAllModals}
        onSubmit={handleCreateRecord}
      />

      <EditRecordModal
        key={`${selectedRecord?.rawId ?? 'empty'}-${isEditModalOpen ? 'open' : 'closed'}`}
        open={isEditModalOpen}
        record={selectedRecord}
        lookups={lookups}
        lookupsLoading={lookupsLoading}
        lookupsError={lookupsError}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeAllModals}
        onSubmit={handleUpdateRecord}
      />

      <DeleteRecordModal
        open={isDeleteModalOpen}
        record={selectedRecord}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeAllModals}
        onConfirm={handleDeleteRecord}
      />

      <BulkLoremModal
        key={isBulkModalOpen ? 'bulk-open' : 'bulk-closed'}
        open={isBulkModalOpen}
        pending={mutationPending}
        serverError={mutationError}
        onClose={closeAllModals}
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
