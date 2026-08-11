import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ALL_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
} from '../services/tableService.js'
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  VALID_MODAL_TYPES,
  getPositiveNumber,
  getPageSizeValue,
} from '../utils/tableUtils.js'

function useTableParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('search') ?? ''

  const currentPage = getPositiveNumber(
    searchParams.get('page'),
    1,
  )

  const pageSize = getPageSizeValue(
    searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE,
  )

  const sortBy =
    searchParams.get('sortBy') ?? DEFAULT_SORT_BY

  const sortDir =
    searchParams.get('sortDir') === 'desc'
      ? 'desc'
      : DEFAULT_SORT_DIR

  const requestedModalType = searchParams.get('modal')

  const modalType = VALID_MODAL_TYPES.has(requestedModalType)
    ? requestedModalType
    : null

  const modalRecordId = getPositiveNumber(
    searchParams.get('recordId'),
    null,
  )

  const setTableParams = useCallback(
    (updates, options = {}) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams)

          Object.entries(updates).forEach(([key, value]) => {
            if (
              value === null ||
              value === undefined ||
              value === ''
            ) {
              nextParams.delete(key)
              return
            }

            nextParams.set(key, String(value))
          })

          return nextParams
        },
        options,
      )
    },
    [setSearchParams],
  )

  const handleSearchChange = useCallback(
    (value) => {
      setTableParams({
        search: value,
        page: 1,
      })
    },
    [setTableParams],
  )

  const handlePageChange = useCallback(
    (page) => {
      const nextPage = getPositiveNumber(page, 1)

      setTableParams({
        page: nextPage,
      })
    },
    [setTableParams],
  )

  const handlePageSizeChange = useCallback(
    (value) => {
      const nextPageSize =
        value === ALL_PAGE_SIZE
          ? ALL_PAGE_SIZE
          : getPageSizeValue(value)

      setTableParams({
        pageSize: nextPageSize,
        page: 1,
      })
    },
    [setTableParams],
  )

  const handleSortChange = useCallback(
    (columnKey) => {
      const nextSortDir =
        sortBy === columnKey && sortDir === 'asc'
          ? 'desc'
          : 'asc'

      setTableParams({
        sortBy: columnKey,
        sortDir: nextSortDir,
        page: 1,
      })
    },
    [setTableParams, sortBy, sortDir],
  )

  const openAddModal = useCallback(() => {
    setTableParams({
      modal: 'add',
      recordId: null,
    })
  }, [setTableParams])

  const openBulkModal = useCallback(() => {
    setTableParams({
      modal: 'bulk',
      recordId: null,
    })
  }, [setTableParams])

  const openEditModal = useCallback(
    (record) => {
      if (!record?.rawId) {
        return
      }

      setTableParams({
        modal: 'edit',
        recordId: record.rawId,
      })
    },
    [setTableParams],
  )

  const openDeleteModal = useCallback(
    (record) => {
      if (!record?.rawId) {
        return
      }

      setTableParams({
        modal: 'delete',
        recordId: record.rawId,
      })
    },
    [setTableParams],
  )

  const closeModal = useCallback(() => {
    setTableParams({
      modal: null,
      recordId: null,
    })
  }, [setTableParams])

  return {
    searchQuery,
    currentPage,
    pageSize,
    sortBy,
    sortDir,
    modalType,
    modalRecordId,
    setTableParams,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    openAddModal,
    openBulkModal,
    openEditModal,
    openDeleteModal,
    closeModal,
  }
}

export default useTableParams