import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './ModalShell.css'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  )
}

function ModalShell({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  size = 'md',
  tone = 'primary',
  contentClassName = '',
}) {
  const descriptionId = useId()
  const titleId = useId()
  const dialogRef = useRef(null)
  const previousActiveElementRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const currentActiveElement = document.activeElement

    if (currentActiveElement instanceof HTMLElement && currentActiveElement !== document.body) {
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
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    const focusTimeoutId = window.setTimeout(() => {
      const focusableElements = getFocusableElements()
      const nextFocusTarget = focusableElements[0] ?? dialogRef.current
      nextFocusTarget?.focus()
    }, 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimeoutId)

      if (previousActiveElementRef.current?.isConnected) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="modal-root" role="presentation">
          <motion.div
            className="modal-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          />

          <div className="modal-positioner">
            <motion.section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descriptionId : undefined}
              className={`modal-shell modal-shell-${size} modal-shell-${tone} ${contentClassName}`.trim()}
              onClick={(event) => event.stopPropagation()}
              tabIndex={-1}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="modal-shell-rail" aria-hidden="true" />

              <div className="modal-shell-header">
                <div className="modal-shell-heading">
                  <h2 id={titleId} className="modal-shell-title">
                    {title}
                  </h2>

                  {eyebrow ? <p className="modal-shell-eyebrow">{eyebrow}</p> : null}

                  {description ? (
                    <p id={descriptionId} className="modal-shell-description">
                      {description}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="modal-shell-close"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="modal-shell-body">{children}</div>

              {footer ? <div className="modal-shell-footer">{footer}</div> : null}
            </motion.section>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default ModalShell
