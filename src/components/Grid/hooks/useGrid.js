function useGrid({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePreviousPage = () => {
    if (!canGoPrevious) {
      return
    }

    onPageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (!canGoNext) {
      return
    }

    onPageChange(currentPage + 1)
  }

  return {
    canGoPrevious,
    canGoNext,
    handlePreviousPage,
    handleNextPage,
  }
}

export default useGrid