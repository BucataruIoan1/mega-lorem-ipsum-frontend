import { useEffect, useRef } from 'react'

function useModalAccessibility(open, onClose) {
  const dialogRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const currentActiveElement = document.activeElement

    if (
      currentActiveElement instanceof HTMLElement &&
      currentActiveElement !== document.body
    ) {
      previousActiveElementRef.current = currentActiveElement
    } else {
      previousActiveElementRef.current = null
    }

    function getFocusableElements() {
      if (!dialogRef.current) {
        return []
      }

      return Array.from(
        dialogRef.current.querySelectorAll(
          [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
          ].join(', '),
        ),
      )
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements()

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement =
        focusableElements[focusableElements.length - 1]

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    const focusTimeoutId = window.setTimeout(() => {
      const focusableElements = getFocusableElements()

      const nextFocusTarget =
        focusableElements[0] ?? dialogRef.current

      nextFocusTarget?.focus()
    }, 0)

    return () => {
      document.body.style.overflow = previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      window.clearTimeout(focusTimeoutId)

      if (
        previousActiveElementRef.current?.isConnected
      ) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [open, onClose])

  return {
    dialogRef,
  }
}

export default useModalAccessibility