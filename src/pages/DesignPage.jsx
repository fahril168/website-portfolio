import React, { useState, useEffect } from 'react'
import HeroShapes from '../components/HeroShapes'
import ModalPreview from '../components/ModalPreview'
import { getPortfolioData, thumbUrl } from '../services/localDataService'

export default function DesignPage() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [modalData, setModalData] = useState({ isOpen: false, src: '', title: '' })

  useEffect(() => {
    async function loadDesigns() {
      setLoading(true)
      try {
        const data = await getPortfolioData()
        setDesigns(data.designs || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDesigns()
  }, [])

  // Extract categories for filter bar
  const categoriesList = Array.from(new Set(designs.map(d => d.category || 'Lainnya')))

  const filteredDesigns = activeFilter === 'ALL'
    ? designs
    : designs.filter(d => (d.category || 'Lainnya') === activeFilter)

  // Group by category if ALL, or display single grid
  const groupedCategories = {}
  filteredDesigns.forEach(item => {
    const cat = item.category || 'Lainnya'
    if (!groupedCategories[cat]) groupedCategories[cat] = []
    groupedCategories[cat].push(item)
  })

  return (
    <section className="design-section" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <div className="design-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroShapes />
        <div className="design-hero__content">
          <h1 className="hero-title">Design <span className="hero-title--accent">Portfolio</span></h1>
          <p className="hero-sub">Kumpulan karya desain grafis, poster, dan UI/UX yang telah dibuat.</p>
        </div>
      </div>

      {categoriesList.length > 0 && (
        <div className="filter-bar" id="filter-bar" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', margin: '2rem 0' }}>
          <button
            className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            Semua ({designs.length})
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat} ({designs.filter(d => (d.category || 'Lainnya') === cat).length})
            </button>
          ))}
        </div>
      )}

      <div id="design-content" className="bd-grid">
        {loading ? (
          <div style={{ marginTop: '80px', textAlign: 'center' }}>
            <div className="loading-wrap">
              <div className="spinner"></div>
              <span>Memuat portfolio design...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Gagal memuat: {error}</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Belum ada karya design.</p>
          </div>
        ) : (
          Object.keys(groupedCategories).map(cat => (
            <div key={cat} className="year-section visible" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--first-color)' }}>{cat}</h2>
              <div className="design-grid">
                {groupedCategories[cat].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="design-card img-loaded"
                    onClick={() => setModalData({
                      isOpen: true,
                      src: thumbUrl(item.image_url),
                      title: item.title || 'Design'
                    })}
                  >
                    <img
                      className="thumb loaded"
                      src={thumbUrl(item.image_url)}
                      alt={item.title || 'Design'}
                    />
                    <div className="design-card__overlay">
                      <div className="design-card__zoom">
                        <i className='bx bx-zoom-in'></i>
                      </div>
                    </div>
                    <div className="design-card__label">
                      {item.title || 'Design'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
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
