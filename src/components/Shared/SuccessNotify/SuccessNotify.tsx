import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import './SuccessNotify.css'

type SuccessNotifyProps = {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

function CheckIcon() {
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
      <path d="m5 12 4.2 4.2L19 7.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SuccessNotify({
  message,
  visible,
  onClose,
  duration = 2500,
}: SuccessNotifyProps) {
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
          className="success-notify"
          role="status"
          aria-live="polite"
        >
          <div className="success-notify-icon">
            <CheckIcon />
          </div>
          <span className="success-notify-message">{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SuccessNotify
