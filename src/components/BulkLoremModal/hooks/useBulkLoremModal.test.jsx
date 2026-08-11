import { act, renderHook } from '@testing-library/react'
import useBulkLoremModal from './useBulkLoremModal.js'

describe('useBulkLoremModal', () => {
  it('starts with the default count and submits it', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useBulkLoremModal(onSubmit),
    )

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      })
    })

    expect(result.current.selectedCount).toBe(20)
    expect(onSubmit).toHaveBeenCalledWith(20)
    expect(result.current.formError).toBe('')
  })

  it('updates the selected count and clears previous form errors', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useBulkLoremModal(onSubmit),
    )

    act(() => {
      result.current.handleCountChange(999)
    })

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      })
    })

    expect(result.current.formError).toContain(
      'Alege una dintre valorile permise',
    )
    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      result.current.handleCountChange(100)
    })

    expect(result.current.selectedCount).toBe(100)
    expect(result.current.formError).toBe('')
  })
})
