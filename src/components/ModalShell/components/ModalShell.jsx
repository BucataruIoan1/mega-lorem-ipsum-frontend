import { useId } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import CloseIcon from '../../Shared/CloseIcon/CloseIcon.tsx'
import useModalAccessibility from '../hooks/useModalAccessibility.js'
import './ModalShell.css'

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
  const prefersReducedMotion = useReducedMotion()

  const { dialogRef } = useModalAccessibility(
    open,
    onClose,
  )

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="modal-root">
          <motion.div
            className="modal-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
            }}
          />

          <div className="modal-positioner">
            <motion.section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={
                description ? descriptionId : undefined
              }
              className={`modal-shell modal-shell-${size} modal-shell-${tone} ${contentClassName}`.trim()}
              onClick={(event) => event.stopPropagation()}
              tabIndex={-1}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 18,
                      scale: 0.97,
                    }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 12,
                      scale: 0.98,
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="modal-shell-rail"
                aria-hidden="true"
              />

              <div className="modal-shell-header">
                <div className="modal-shell-heading">
                  <h2
                    id={titleId}
                    className="modal-shell-title"
                  >
                    {title}
                  </h2>

                  {eyebrow ? (
                    <p className="modal-shell-eyebrow">
                      {eyebrow}
                    </p>
                  ) : null}

                  {description ? (
                    <p
                      id={descriptionId}
                      className="modal-shell-description"
                    >
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

              <div className="modal-shell-body">
                {children}
              </div>

              {footer ? (
                <div className="modal-shell-footer">
                  {footer}
                </div>
              ) : null}
            </motion.section>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default ModalShell
