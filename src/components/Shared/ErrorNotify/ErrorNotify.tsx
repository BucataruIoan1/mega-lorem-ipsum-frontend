import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import './ErrorNotify.css'

type ErrorNotifyProps = {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

function AlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 9v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ErrorNotify({
  message,
  visible,
  onClose,
  duration = 3200,
}: ErrorNotifyProps) {
  useEffect(() => {
    if (!visible) {
      return undefined
    }

    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="error-notify"
          role="alert"
          aria-live="assertive"
        >
          <div className="error-notify-icon">
            <AlertIcon />
          </div>
          <span className="error-notify-message">{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default ErrorNotify
