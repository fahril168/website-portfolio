import React, { useState, useEffect } from 'react'
import HeroShapes from '../components/HeroShapes'
import { sbFetch, thumbUrl } from '../config/supabase'

export default function WebsitePage() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWebsites() {
      setLoading(true)
      let data = []
      try {
        data = await sbFetch('websites?select=*&order=created_at.desc')
      } catch (err) {
        console.warn('Gagal mengambil data website dari Supabase:', err.message)
      }

      if (!data || data.length === 0) {
        data = [
          {
            id: 1,
            title: "Pembangunan Gedung Dinas PUPR Kota Kendari",
            tech_stack: "HTML, CSS, JavaScript, PHP",
            description: "Proyek pembangunan gedung kantor Dinas Pekerjaan Umum dan Penataan Ruang Kota Kendari bertaraf nasional.",
            image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
            project_link: "https://example.com"
          },
          {
            id: 2,
            title: "Peningkatan Jalan Provinsi Ruas Konawe-Konawe Utara",
            tech_stack: "Laravel, Vue.js, Tailwind CSS",
            description: "Proyek peningkatan jalan provinsi sepanjang 12,5 km yang menghubungkan Kabupaten Konawe.",
            image_url: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80",
            project_link: "https://example.com"
          },
          {
            id: 3,
            title: "Pembangunan Jembatan Sungai Konaweha",
            tech_stack: "React, Next.js, Supabase",
            description: "Pembangunan jembatan beton bertulang sepanjang 120 meter yang menghubungkan dua kecamatan.",
            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            project_link: "https://example.com"
          }
        ]
      }

      setWebsites(data)
      setLoading(false)
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
              const imgSrc = item.image_url ? thumbUrl(item.image_url, 'designs') : 'assets/img/about.jpg'
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
