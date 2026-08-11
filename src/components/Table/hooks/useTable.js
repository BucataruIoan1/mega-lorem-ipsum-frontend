import { useCallback, useEffect, useRef, useState } from "react";
import useTableParams from "./useTableParams.js";
import {
  getRecordLookups,
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  generateLoremRecords,
  ALL_PAGE_SIZE,
} from "../services/tableService.js";

const EMPTY_LOOKUPS = {
  categories: [],
  statuses: [],
  priorities: [],
  owners: [],
};

function useTable() {
  const {
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
    closeModal: closeModalParams,
  } = useTableParams();

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [lookups, setLookups] = useState(EMPTY_LOOKUPS);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [lookupsError, setLookupsError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordLoading, setSelectedRecordLoading] = useState(false);
  const [mutationPending, setMutationPending] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const lookupsRequestIdRef = useRef(0);
  const recordsRequestIdRef = useRef(0);
  const selectedRecordRequestIdRef = useRef(0);
  const [successNotify, setSuccessNotify] = useState({
    visible: false,
    message: "",
  });

  const [errorNotify, setErrorNotify] = useState({
    visible: false,
    message: "",
  });

  const closeSuccessNotify = useCallback(() => {
    setSuccessNotify((currentState) => ({
      ...currentState,
      visible: false,
    }));
  }, []);

  const closeErrorNotify = useCallback(() => {
    setErrorNotify((currentState) => ({
      ...currentState,
      visible: false,
    }));
  }, []);

  const showSuccessNotify = useCallback((message) => {
    setErrorNotify((currentState) => ({
      ...currentState,
      visible: false,
    }));

    setSuccessNotify({
      visible: true,
      message,
    });
  }, []);

  const showErrorNotify = useCallback((message) => {
    setSuccessNotify((currentState) => ({
      ...currentState,
      visible: false,
    }));

    setErrorNotify({
      visible: true,
      message,
    });
  }, []);

  const refreshRecords = useCallback(() => {
    setRefreshKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    let isActive = true;
    const requestId = lookupsRequestIdRef.current + 1;
    lookupsRequestIdRef.current = requestId;

    async function loadLookups() {
      setLookupsLoading(true);
      setLookupsError("");

      try {
        const response = await getRecordLookups();

        if (
          !isActive ||
          requestId !== lookupsRequestIdRef.current
        ) {
          return;
        }

        setLookups(response);
      } catch (error) {
        if (
          !isActive ||
          requestId !== lookupsRequestIdRef.current
        ) {
          return;
        }

        setLookups(EMPTY_LOOKUPS);

        setLookupsError(
          error instanceof Error
            ? error.message
            : "Nu am putut incarca listele.",
        );
      } finally {
        if (
          isActive &&
          requestId === lookupsRequestIdRef.current
        ) {
          setLookupsLoading(false);
        }
      }
    }

    loadLookups();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const requestId = recordsRequestIdRef.current + 1;
    recordsRequestIdRef.current = requestId;

    async function loadRecords() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getRecords({
          page: currentPage,
          pageSize,
          search: searchQuery,
          sortBy,
          sortDir,
        });

        if (
          !isActive ||
          requestId !== recordsRequestIdRef.current
        ) {
          return;
        }

        setRows(response.rows);
        setTotalPages(response.totalPages);
        setTotalRecords(response.totalRecords);

        if (
          response.currentPage !== currentPage &&
          isActive &&
          requestId === recordsRequestIdRef.current
        ) {
          setTableParams(
            {
              page: response.currentPage,
            },
            {
              replace: true,
            },
          );
        }
      } catch (error) {
        if (
          !isActive ||
          requestId !== recordsRequestIdRef.current
        ) {
          return;
        }

        setRows([]);
        setTotalPages(1);
        setTotalRecords(0);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nu am putut incarca inregistrarile.",
        );
      } finally {
        if (
          isActive &&
          requestId === recordsRequestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      isActive = false;
    };
  }, [
    currentPage,
    pageSize,
    searchQuery,
    sortBy,
    sortDir,
    refreshKey,
    setTableParams,
  ]);

  useEffect(() => {
    if (!modalRecordId || (modalType !== "edit" && modalType !== "delete")) {
      return undefined;
    }

    let isActive = true;
    const requestId = selectedRecordRequestIdRef.current + 1;
    selectedRecordRequestIdRef.current = requestId;

    async function loadSelectedRecord() {
      setSelectedRecordLoading(true);
      setMutationError("");

      try {
        const response = await getRecordById(modalRecordId);

        if (
          !isActive ||
          requestId !== selectedRecordRequestIdRef.current
        ) {
          return;
        }

        setSelectedRecord(response);
      } catch (error) {
        if (
          !isActive ||
          requestId !== selectedRecordRequestIdRef.current
        ) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Nu am putut incarca inregistrarea.";

        setSelectedRecord(null);
        setMutationError(message);
        showErrorNotify(message);
      } finally {
        if (
          isActive &&
          requestId === selectedRecordRequestIdRef.current
        ) {
          setSelectedRecordLoading(false);
        }
      }
    }

    loadSelectedRecord();

    return () => {
      isActive = false;
    };
  }, [modalRecordId, modalType, showErrorNotify]);

  const handleOpenAddModal = useCallback(() => {
    setMutationError("");
    setSelectedRecordLoading(false);
    openAddModal();
  }, [openAddModal]);

  const handleOpenBulkModal = useCallback(() => {
    setMutationError("");
    setSelectedRecordLoading(false);
    openBulkModal();
  }, [openBulkModal]);

  const handleOpenEditModal = useCallback(
    (record) => {
      setMutationError("");
      setSelectedRecord(null);
      openEditModal(record);
    },
    [openEditModal],
  );

  const handleOpenDeleteModal = useCallback(
    (record) => {
      setMutationError("");
      setSelectedRecord(null);
      openDeleteModal(record);
    },
    [openDeleteModal],
  );

  const handleCloseModal = useCallback(() => {
    if (mutationPending) {
      return;
    }

    setMutationError("");
    setSelectedRecord(null);
    setSelectedRecordLoading(false);
    closeModalParams();
  }, [closeModalParams, mutationPending]);

  const handleCreateRecord = useCallback(
    async (form) => {
      setMutationPending(true);
      setMutationError("");

      try {
        await createRecord(form);

        setSelectedRecord(null);
        closeModalParams();
        refreshRecords();
        showSuccessNotify("Inregistrarea a fost adaugata cu succes.");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nu am putut crea inregistrarea.";

        setMutationError(message);
        showErrorNotify(message);
      } finally {
        setMutationPending(false);
      }
    },
    [closeModalParams, refreshRecords, showErrorNotify, showSuccessNotify],
  );

  const handleUpdateRecord = useCallback(
    async (form) => {
      if (!modalRecordId) {
        return;
      }

      setMutationPending(true);
      setMutationError("");

      try {
        await updateRecord(modalRecordId, form);

        setSelectedRecord(null);
        closeModalParams();
        refreshRecords();

        showSuccessNotify("Inregistrarea a fost actualizata cu succes.");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nu am putut actualiza inregistrarea.";

        setMutationError(message);
        showErrorNotify(message);
      } finally {
        setMutationPending(false);
      }
    },
    [
      modalRecordId,
      closeModalParams,
      refreshRecords,
      showErrorNotify,
      showSuccessNotify,
    ],
  );

  const handleDeleteRecord = useCallback(async () => {
    if (!modalRecordId) {
      return;
    }

    setMutationPending(true);
    setMutationError("");

    try {
      await deleteRecord(modalRecordId);

      setSelectedRecord(null);

      if (rows.length === 1 && currentPage > 1 && pageSize !== ALL_PAGE_SIZE) {
        setTableParams({
          modal: null,
          recordId: null,
          page: currentPage - 1,
        });
      } else {
        closeModalParams();
        refreshRecords();
      }

      showSuccessNotify("Inregistrarea a fost stearsa cu succes.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nu am putut sterge inregistrarea.";

      setMutationError(message);
      showErrorNotify(message);
    } finally {
      setMutationPending(false);
    }
  }, [
    modalRecordId,
    rows.length,
    currentPage,
    pageSize,
    closeModalParams,
    setTableParams,
    refreshRecords,
    showErrorNotify,
    showSuccessNotify,
  ]);

  const handleBulkCreate = useCallback(
    async (count) => {
      setMutationPending(true);
      setMutationError("");

      try {
        await generateLoremRecords(count);

        setTableParams({
          modal: null,
          recordId: null,
          page: 1,
        });

        setSelectedRecord(null);
        refreshRecords();

        showSuccessNotify(`${count} inregistrari au fost generate cu succes.`);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nu am putut genera inregistrarile.";

        setMutationError(message);
        showErrorNotify(message);
      } finally {
        setMutationPending(false);
      }
    },
    [
      setTableParams,
      refreshRecords,
      showErrorNotify,
      showSuccessNotify,
    ],
  );

  const visibleStart =
    totalRecords === 0
      ? 0
      : pageSize === ALL_PAGE_SIZE
        ? 1
        : (currentPage - 1) * Number(pageSize) + 1;

  const visibleEnd =
    totalRecords === 0
      ? 0
      : pageSize === ALL_PAGE_SIZE
        ? totalRecords
        : Math.min(currentPage * Number(pageSize), totalRecords);

  return {
    rows,
    totalPages,
    totalRecords,
    isLoading,
    errorMessage,
    lookups,
    lookupsLoading,
    lookupsError,
    selectedRecord,
    selectedRecordLoading,
    mutationPending,
    mutationError,
    successNotify,
    errorNotify,
    searchQuery,
    currentPage,
    pageSize,
    sortBy,
    sortDir,
    modalType,
    modalRecordId,
    visibleStart,
    visibleEnd,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    openAddModal: handleOpenAddModal,
    openBulkModal: handleOpenBulkModal,
    openEditModal: handleOpenEditModal,
    openDeleteModal: handleOpenDeleteModal,
    closeModal: handleCloseModal,
    handleCreateRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    handleBulkCreate,
    closeSuccessNotify,
    closeErrorNotify,
  };
}

export default useTable;
