import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import HeroShapes from '../components/HeroShapes'
import ModalPreview from '../components/ModalPreview'
import { WarpBackground } from '../components/ui/warp-background'
import { getPortfolioData, thumbUrl } from '../services/localDataService'

function Tilt3DImage({ src, alt, className = 'home__img', maxWidth = '300px' }) {
  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 22 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 22 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX
      const mouseY = e.clientY

      const xPct = (mouseX - centerX) / (window.innerWidth / 2)
      const yPct = (mouseY - centerY) / (window.innerHeight / 2)

      const clampedX = Math.max(-0.5, Math.min(0.5, xPct * 0.5))
      const clampedY = Math.max(-0.5, Math.min(0.5, yPct * 0.5))

      x.set(clampedX)
      y.set(clampedY)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [x, y])

  return (
    <motion.div
      ref={containerRef}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
        perspective: 1200,
        display: 'inline-block',
        width: '100%',
        maxWidth: maxWidth,
        justifySelf: 'center',
      }}
      className={className}
    >
      <motion.div
        style={{
          transform: 'translateZ(26px)',
          borderRadius: '1.5rem',
          padding: '6px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(59, 130, 246, 0.45), rgba(255, 255, 255, 0.8))',
          boxShadow: '0 25px 50px -10px rgba(15, 23, 42, 0.2), 0 12px 28px -6px rgba(37, 99, 235, 0.22)',
          width: '100%',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            borderRadius: '1.25rem',
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const location = useLocation()
  const [modalData, setModalData] = useState({ isOpen: false, src: '', title: '' })
  
  // Work Section States
  const [activeCategory, setActiveCategory] = useState('website')
  const [workData, setWorkData] = useState([])
  const [loadingWork, setLoadingWork] = useState(false)
  const sliderRef = useRef(null)

  // Stats State
  const [stats, setStats] = useState({
    projects: '15+',
    clients: '10+',
    happy: '99%',
    ongoing: '3'
  })

  // Handle scroll navigation if passed from another route
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location])

  // Fetch Stats from Local JSON
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getPortfolioData()
        if (data && data.stats) {
          setStats(data.stats)
        }
      } catch (err) {
        console.warn('Gagal memuat statistik lokal:', err.message)
      }
    }
    loadStats()
  }, [])

  // Fetch Featured Work by Category from Local JSON
  useEffect(() => {
    async function fetchWork() {
      setLoadingWork(true)
      const categoryMap = {
        website: 'websites',
        design: 'designs',
        video: 'videos',
        dokumentasi: 'dokumentasi'
      }

      const table = categoryMap[activeCategory] || 'websites'

      try {
        const fullData = await getPortfolioData()
        const data = (fullData && fullData[table]) ? fullData[table].slice(0, 6) : []
        setWorkData(data)
      } catch (err) {
        console.warn('Gagal memuat karya lokal:', err.message)
        setWorkData([])
      } finally {
        setLoadingWork(false)
      }
    }

    fetchWork()
  }, [activeCategory])

  const getFallbackData = (cat) => {
    if (cat === 'website') {
      return [
        { id: 1, title: "Pembangunan Gedung PUPR", tech_stack: "HTML, CSS, JS", description: "Proyek pengembangan gedung dinas PUPR.", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", project_link: "https://example.com" },
        { id: 2, title: "Ruas Konawe-Konawe Utara", tech_stack: "Laravel, Vue.js", description: "Sistem pemantauan jalan provinsi.", image_url: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&q=80", project_link: "https://example.com" },
        { id: 3, title: "Jembatan Sungai Konaweha", tech_stack: "React, Supabase", description: "Portal monitoring konstruksi jembatan.", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", project_link: "https://example.com" }
      ]
    } else if (cat === 'design') {
      return [
        { id: 1, title: "Poster Event Tech", category: "Poster", image_url: "assets/img/work1.jpg" },
        { id: 2, title: "Branding Design Logo", category: "Branding", image_url: "assets/img/work3.jpg" }
      ]
    } else if (cat === 'video') {
      return [
        { id: 1, title: "Company Profile Video", thumbnail_url: "assets/img/work2.jpg", video_url: "https://youtube.com" }
      ]
    } else {
      return [
        { id: 1, title: "Dokumentasi Seminar", image_url: "assets/img/about.jpg" }
      ]
    }
  }

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return
    const cardWidth = 320
    const gap = 32
    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap)
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handleCardClick = (item) => {
    const imgRaw = item.image_url || item.thumbnail_url
    let bucket = 'designs'
    if (activeCategory === 'video') bucket = 'videos'
    if (activeCategory === 'dokumentasi') bucket = 'dokumentasi'

    const demoLink = item.project_link || item.video_url || item.demo_link
    if ((activeCategory === 'website' || activeCategory === 'video') && demoLink) {
      window.open(demoLink, '_blank')
    } else if (imgRaw) {
      setModalData({
        isOpen: true,
        src: thumbUrl(imgRaw, bucket),
        title: item.title || 'Preview Karya'
      })
    }
  }

  const getSeeAllLink = () => {
    switch (activeCategory) {
      case 'design': return '/design'
      case 'video': return '/video'
      case 'website': return '/website'
      case 'dokumentasi': return '/dokumentasi'
      default: return '/website'
    }
  }

  return (
    <main className="l-main">
      {/* ===== HOME ===== */}
      <section className="home bd-grid" id="home">
        <HeroShapes />

        <div className="home__data">
          <h1 className="home__title">
            Muh. <span className="home__title-color">Fahril</span>
            <span className="typing"></span>
          </h1>
          <p className="home__p">Seorang mahasiswa yang hobi bermain game</p>

          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }} className="button">About Me</a>

          <div className="home__social">
            <a href="https://www.instagram.com/m.fahrill/" className="home__social-icon" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-instagram'></i>
            </a>
            <a href="https://www.linkedin.com/in/muh-fahril-812b11209/" className="home__social-icon" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-linkedin'></i>
            </a>
            <a href="https://github.com/fahril168" className="home__social-icon" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-github'></i>
            </a>
          </div>
        </div>

        <Tilt3DImage src="assets/img/fahril.png" alt="Muh. Fahril" className="home__img" maxWidth="360px" />
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about section" id="about" style={{ position: 'relative' }}>
        <HeroShapes className="about-shapes" />
        <h2 className="section-title" style={{ position: 'relative', zIndex: 1 }}>About</h2>

        <div className="about__container bd-grid">
          <Tilt3DImage src="assets/img/about.jpg" alt="About Fahril" className="about__img" maxWidth="380px" />

          <div>
            <h1 className="about__subtitle">Muh. Fahril</h1>
            <p className="about__text">
              Seorang mahasiswa Teknik Informatika yang memiliki minat dalam bidang videografi, fotografi, desain grafis, dan motion graphics. Saya juga berfokus pada pengembangan web, khususnya teknologi front-end. Saya fokus membangun website yang responsif, menarik, dan mudah digunakan, sambil terus meningkatkan keterampilan saya dalam HTML, CSS, JavaScript, dan manajemen database.
            </p>

            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">{stats.projects}</span>
                <span className="about__stat-title">Projects</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">{stats.clients}</span>
                <span className="about__stat-title">Clients</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">{stats.happy}</span>
                <span className="about__stat-title">Happy Clients</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">{stats.ongoing}</span>
                <span className="about__stat-title">Ongoing Projects</span>
              </div>
            </div>

            <a href="assets/cv/cv-fahril.pdf" target="_blank" rel="noopener noreferrer" className="button">Open CV</a>
          </div>
        </div>
      </section>

      {/* ===== WORK (KARYA UNGGULAN) ===== */}
      <section className="work section" id="work" style={{ position: 'relative' }}>
        <HeroShapes className="work-shapes" />
        <h2 className="section-title" style={{ position: 'relative', zIndex: 1 }}>Work</h2>

        <div className="portfolio-header bd-grid" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="portfolio-filter">
            <button className={`filter-btn ${activeCategory === 'website' ? 'active' : ''}`} onClick={() => setActiveCategory('website')}>WEBSITE</button>
            <button className={`filter-btn ${activeCategory === 'design' ? 'active' : ''}`} onClick={() => setActiveCategory('design')}>DESIGN</button>
            <button className={`filter-btn ${activeCategory === 'video' ? 'active' : ''}`} onClick={() => setActiveCategory('video')}>VIDEO</button>
            <button className={`filter-btn ${activeCategory === 'dokumentasi' ? 'active' : ''}`} onClick={() => setActiveCategory('dokumentasi')}>DOKUMENTASI</button>
          </div>
        </div>

        <div className="portfolio-slider-wrapper bd-grid" style={{ position: 'relative' }}>
          <button className="slider-nav slider-nav--prev" onClick={() => scrollSlider('left')} aria-label="Previous">
            <i className='bx bx-chevron-left'></i>
          </button>

          <div className="portfolio-grid" ref={sliderRef} id="portfolio-grid">
            {loadingWork ? (
              <div className="loading-wrap" style={{ width: '100%', textAlign: 'center', padding: '2rem 0' }}>
                <div className="spinner"></div>
                <span>Memuat karya...</span>
              </div>
            ) : workData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', width: '100%', color: '#6b7280' }}>
                <p>Belum ada data untuk kategori ini.</p>
              </div>
            ) : (
              workData.map((item, idx) => {
                const title = item.title || 'Portfolio Item'
                const desc = item.description || (activeCategory === 'video' ? 'Karya video kreatif.' : 'Deskripsi portofolio.')
                const imgRaw = item.image_url || item.thumbnail_url
                let bucket = 'designs'
                if (activeCategory === 'video') bucket = 'videos'
                if (activeCategory === 'dokumentasi') bucket = 'dokumentasi'

                const img = imgRaw ? thumbUrl(imgRaw, bucket) : 'assets/img/work1.jpg'
                const badgeText = (item.category || activeCategory).toUpperCase()

                let techStacks = []
                if (item.tech_stack) {
                  if (Array.isArray(item.tech_stack)) techStacks = item.tech_stack
                  else if (typeof item.tech_stack === 'string') techStacks = item.tech_stack.split(/[,|;/]+/).map(s => s.trim()).filter(Boolean)
                } else if (activeCategory === 'website') {
                  techStacks = ['HTML', 'CSS', 'JavaScript']
                }

                const demoLink = item.project_link || item.video_url || item.image_url

                return (
                  <div key={item.id || idx} className="portfolio-card" onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                    <div className="portfolio-card__img">
                      <img src={img} alt={title} />
                      <span className="portfolio-card__tag-overlay">{badgeText}</span>
                    </div>
                    <div className="portfolio-card__body">
                      <h3 className="portfolio-card__title">{title}</h3>
                      <p className="portfolio-card__desc">{desc}</p>
                      <div className="portfolio-card__tags">
                        {techStacks.length > 0 ? (
                          techStacks.map((tech, tIdx) => (
                            <span key={tIdx} className="tech-badge">
                              <i className='bx bx-code-alt'></i> {tech}
                            </span>
                          ))
                        ) : (
                          <span>{badgeText}</span>
                        )}
                      </div>
                      <div className="portfolio-card__footer">
                        {item.github_link && (
                          <a href={item.github_link} target="_blank" rel="noopener noreferrer" className="portfolio-card__link" onClick={(e) => e.stopPropagation()}>
                            <i className='bx bxl-github'></i> Code
                          </a>
                        )}
                        {demoLink ? (
                          <a href={demoLink} target="_blank" rel="noopener noreferrer" className="portfolio-card__link" onClick={(e) => e.stopPropagation()}>
                            <i className='bx bx-link-external'></i> View
                          </a>
                        ) : (
                          <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>No Links</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <button className="slider-nav slider-nav--next" onClick={() => scrollSlider('right')} aria-label="Next">
            <i className='bx bx-chevron-right'></i>
          </button>
        </div>

        <div className="portfolio-more bd-grid">
          <Link to={getSeeAllLink()} className="button">
            Lihat Semua Portofolio <i className='bx bx-right-arrow-alt'></i>
          </Link>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="contact section" id="contact" style={{ position: 'relative' }}>
        <HeroShapes className="contact-shapes" />
        <h2 className="section-title" style={{ position: 'relative', zIndex: 1 }}>Contact</h2>

        <div className="contact__container bd-grid">
          <div className="contact__card">
            <div className="contact__icon">
              <i className='bx bxl-whatsapp'></i>
            </div>
            <h3>Chat Now</h3>
            <p>Hubungi saya melalui WhatsApp untuk diskusi lebih lanjut atau pertanyaan apapun.</p>
            <a href="https://wa.me/6282271591208" target="_blank" rel="noopener noreferrer" className="button">Start Chat</a>
          </div>

          <div className="contact__card">
            <div className="contact__icon">
              <i className='bx bxs-envelope'></i>
            </div>
            <h3>Email</h3>
            <p>Kirimkan email untuk kebutuhan proyek atau pertanyaan umum.</p>
            <a href="mailto:muh.fahril.uho@gmail.com" className="button">Send Email</a>
          </div>

          <div className="contact__card">
            <div className="contact__icon">
              <i className='bx bxs-phone'></i>
            </div>
            <h3>Call or Text</h3>
            <p>Hubungi saya langsung untuk diskusi lebih cepat atau emergency.</p>
            <span className="contact__button--disabled">+62 822 7159 1208</span>
          </div>
        </div>
      </section>

      {/* Modal Preview */}
      <ModalPreview
        isOpen={modalData.isOpen}
        src={modalData.src}
        title={modalData.title}
        onClose={() => setModalData({ isOpen: false, src: '', title: '' })}
      />
    </main>
  )
}
