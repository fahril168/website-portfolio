import React, { useState, useEffect } from 'react'
import HeroShapes from '../components/HeroShapes'
import { getPortfolioData, thumbUrl } from '../services/localDataService'

export default function WebsitePage() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWebsites() {
      setLoading(true)
      try {
        const data = await getPortfolioData()
        setWebsites(data.websites || [])
      } catch (err) {
        console.warn('Gagal mengambil data website lokal:', err.message)
        setWebsites([])
      } finally {
        setLoading(false)
      }
    }

    loadWebsites()
  }, [])

  return (
    <section className="design-section" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <div className="design-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroShapes />
        <div className="design-hero__content">
          <h1 className="hero-title">Website <span className="hero-title--accent">Portfolio</span></h1>
          <p className="hero-sub">Kumpulan website responsif dan dinamis yang telah saya kembangkan.</p>
        </div>
      </div>

      <div id="website-content" className="bd-grid" style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-wrap">
              <div className="spinner"></div>
              <span>Memuat karya website...</span>
            </div>
          </div>
        ) : websites.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Belum ada karya website.</p>
          </div>
        ) : (
          <div className="website-grid-new" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {websites.map((item) => {
              const imgSrc = thumbUrl(item.image_url)
              const title = item.title || 'Judul Website'
              const desc = item.description || item.desc || 'Proyek pengembangan website responsif dan modern.'
              const linkUrl = item.project_link || item.github_link || item.demo_link || '#'

              let techStacks = []
              if (item.tech_stack) {
                if (Array.isArray(item.tech_stack)) techStacks = item.tech_stack
                else if (typeof item.tech_stack === 'string') techStacks = item.tech_stack.split(/[,|;/]+/).map(s => s.trim()).filter(Boolean)
              }
              if (!techStacks.length) techStacks = ['HTML', 'CSS', 'JavaScript']

              return (
                <div key={item.id} className="website-card-new">
                  <div className="website-card-new__img-wrap">
                    <img src={imgSrc} alt={title} loading="lazy" />
                  </div>
                  <div className="website-card-new__content">
                    <h3 className="website-card-new__title">{title}</h3>
                    <div className="website-card-new__tags">
                      {techStacks.map((tech, idx) => (
                        <span key={idx} className="website-card-new__tag">
                          <i className='bx bx-code-alt'></i> {tech}
                        </span>
                      ))}
                    </div>
                    <p className="website-card-new__desc">{desc}</p>
                    <a href={linkUrl} target={linkUrl !== '#' ? '_blank' : '_self'} rel="noopener noreferrer" className="website-card-new__link">
                      Lihat Detail <i className='bx bx-right-arrow-alt'></i>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
