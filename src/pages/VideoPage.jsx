import React, { useState, useEffect } from 'react'
import HeroShapes from '../components/HeroShapes'
import { getPortfolioData, thumbUrl } from '../services/localDataService'

export default function VideoPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadVideos() {
      setLoading(true)
      try {
        const data = await getPortfolioData()
        setVideos(data.videos || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [])

  // Group videos by year
  const groupedYears = {}
  videos.forEach(item => {
    const y = item.year || 'Lainnya'
    if (!groupedYears[y]) groupedYears[y] = []
    groupedYears[y].push(item)
  })

  const sortedYears = Object.keys(groupedYears).sort((a, b) => b - a)

  return (
    <section className="design-section" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <div className="design-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroShapes />
        <div className="design-hero__content">
          <h1 className="hero-title">Video <span className="hero-title--accent">Portfolio</span></h1>
          <p className="hero-sub">Kumpulan hasil editing video, cinematic, reels, dan motion visual yang telah dibuat.</p>
        </div>
      </div>

      <div id="video-content" className="bd-grid" style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-wrap">
              <div className="spinner"></div>
              <span>Memuat karya video...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Gagal memuat: {error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <i className='bx bx-video' style={{ fontSize: '3rem' }}></i>
            <p>Belum ada karya video.</p>
          </div>
        ) : (
          sortedYears.map(year => (
            <div key={year} className="year-section visible" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--first-color)' }}>{year}</h2>
              <div className="design-grid">
                {groupedYears[year].map(item => (
                  <a
                    key={item.id}
                    href={item.video_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-card img-loaded"
                  >
                    <img
                      className="thumb loaded"
                      src={thumbUrl(item.thumbnail_url || 'assets/img/work2.jpg')}
                      alt={item.title || 'Video'}
                    />
                    <div className="design-card__overlay">
                      <div className="design-card__zoom">
                        <i className='bx bx-play'></i>
                      </div>
                    </div>
                    <div className="design-card__label">
                      {item.title || 'Video'}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
