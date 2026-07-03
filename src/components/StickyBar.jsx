import { useEffect, useState } from 'react'
import { enrollmentDeadline } from '../data'

function getRemaining() {
  const diff = new Date(enrollmentDeadline).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function StickyBar() {
  const [remaining, setRemaining] = useState(getRemaining)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!remaining || dismissed) return null

  return (
    <div className="sticky-bar">
      <div className="container sticky-bar-inner">
        <div className="sticky-bar-timer">
          <span className="sticky-bar-label">До закриття запису на III потік:</span>
          <span className="sticky-bar-clock">
            {remaining.days > 0 && <>{remaining.days}д </>}
            {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
          </span>
        </div>
        <div className="sticky-bar-actions">
          <a href="#pricing" className="btn btn-gold">
            Записатись на III потік
          </a>
          <button
            className="sticky-bar-close"
            onClick={() => setDismissed(true)}
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
