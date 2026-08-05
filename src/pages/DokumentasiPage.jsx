import React, { useState, useEffect } from 'react'
import HeroShapes from '../components/HeroShapes'
import ModalPreview from '../components/ModalPreview'
import { sbFetch, thumbUrl } from '../config/supabase'

export default function DokumentasiPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalData, setModalData] = useState({ isOpen: false, src: '', title: '' })

  useEffect(() => {
    async function loadDocs() {
      setLoading(true)
      try {
        const data = await sbFetch('dokumentasi?select=*&order=created_at.desc')
        setDocs(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [])

  return (
    <section className="design-section" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <div className="design-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroShapes />
        <div className="design-hero__content">
          <h1 className="hero-title">Dokumentasi <span className="hero-title--accent">Kegiatan</span></h1>
          <p className="hero-sub">Kumpulan foto dan dokumentasi kegiatan yang pernah saya ikuti.</p>
        </div>
      </div>

      <div id="dokumentasi-content" className="bd-grid" style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-wrap">
              <div className="spinner"></div>
              <span>Memuat foto dokumentasi...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Gagal memuat: {error}</p>
          </div>
        ) : docs.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <i className='bx bx-camera' style={{ fontSize: '3rem' }}></i>
            <p>Belum ada foto dokumentasi.</p>
          </div>
        ) : (
          <div className="design-grid">
            {docs.map(item => (
              <button
                key={item.id}
                type="button"
                className="design-card img-loaded"
                onClick={() => setModalData({
                  isOpen: true,
                  src: thumbUrl(item.image_url, 'dokumentasi'),
                  title: item.title || 'Dokumentasi'
                })}
              >
                <img
                  className="thumb loaded"
                  src={thumbUrl(item.image_url, 'dokumentasi')}
                  alt={item.title || 'Dokumentasi'}
                />
                <div className="design-card__overlay">
                  <div className="design-card__zoom">
                    <i className='bx bx-zoom-in'></i>
                  </div>
                </div>
                <div className="design-card__label">
                  {item.title || 'Dokumentasi'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <ModalPreview
        isOpen={modalData.isOpen}
        src={modalData.src}
        title={modalData.title}
        onClose={() => setModalData({ isOpen: false, src: '', title: '' })}
      />
    </section>
  )
}
