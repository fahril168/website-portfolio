import React, { useEffect, useState } from 'react'

export default function ModalPreview({ isOpen, src, title, onClose }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    setLoading(true)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="design-modal is-active" aria-hidden="false">
      <div className="design-modal__overlay" onClick={onClose}></div>
      <div className="design-modal__content" role="dialog" aria-modal="true" aria-label="Media preview">
        {loading && (
          <div className="design-modal__loader">
            <div className="spinner"></div>
          </div>
        )}
        <button type="button" className="design-modal__close" onClick={onClose} aria-label="Close preview">
          <i className="bx bx-x"></i>
        </button>
        <img
          className="design-modal__img"
          src={src}
          alt={title || 'Preview'}
          style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        <div className="design-modal__bar">{title}</div>
      </div>
    </div>
  )
}
