import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  getPortfolioData,
  addItem,
  deleteItem,
  updateStats,
  uploadImageFile,
  thumbUrl
} from '../services/localDataService'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('websites') // websites | designs | videos | dokumentasi | stats
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ projects: '15+', clients: '10+', happy: '99%', ongoing: '3' })
  const [msg, setMsg] = useState({ type: '', text: '' })

  // Upload States
  const fileInputRef = useRef(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tech_stack: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    video_url: '',
    project_link: '',
    github_link: '',
    year: new Date().getFullYear()
  })

  // Auth Guard
  useEffect(() => {
    const isAuth = sessionStorage.getItem('fahril_admin') === '1'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('fahril_admin')
    navigate('/login')
  }

  // Load Current Tab Data
  const loadTabData = async () => {
    setLoading(true)
    try {
      const data = await getPortfolioData()
      if (activeTab === 'stats') {
        setStats(data.stats || { projects: '15+', clients: '10+', happy: '99%', ongoing: '3' })
      } else {
        setItems(data[activeTab] || [])
      }
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal memuat data lokal: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMsg({ type: '', text: '' })
    setPreviewImage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    loadTabData()
  }, [activeTab])

  // Handle Local Image File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setMsg({ type: 'info', text: 'Mengunggah dan menyalin foto ke folder assets/img/...' })

    try {
      const result = await uploadImageFile(file)
      if (result.success && result.url) {
        if (activeTab === 'videos') {
          setFormData(prev => ({ ...prev, thumbnail_url: result.url }))
        } else {
          setFormData(prev => ({ ...prev, image_url: result.url }))
        }
        setPreviewImage(result.url)
        setMsg({ type: 'success', text: `✅ Foto "${result.filename}" berhasil disalin ke folder assets/img!` })
      }
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal mengupload foto: ${err.message}` })
    } finally {
      setUploadingImage(false)
    }
  }

  // Save Stats
  const handleSaveStats = async (e) => {
    e.preventDefault()
    setMsg({ type: 'info', text: 'Menyimpan statistik ke file JSON...' })

    try {
      await updateStats(stats)
      setMsg({ type: 'success', text: '✅ Statistik berhasil disimpan ke src/data/portfolioData.json!' })
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal menyimpan: ${err.message}` })
    }
  }

  // Create Item
  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!formData.title) {
      setMsg({ type: 'error', text: 'Judul wajib diisi.' })
      return
    }

    setMsg({ type: 'info', text: 'Menambahkan item ke JSON lokal...' })

    let payload = {}
    if (activeTab === 'websites') {
      payload = {
        title: formData.title,
        category: formData.category || 'Website',
        tech_stack: formData.tech_stack,
        description: formData.description,
        image_url: formData.image_url || 'assets/img/about.jpg',
        project_link: formData.project_link,
        github_link: formData.github_link
      }
    } else if (activeTab === 'designs') {
      payload = {
        title: formData.title,
        category: formData.category || 'Design',
        image_url: formData.image_url || 'assets/img/about.jpg'
      }
    } else if (activeTab === 'videos') {
      payload = {
        title: formData.title,
        category: formData.category || 'Video',
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url || 'assets/img/about.jpg',
        year: parseInt(formData.year) || new Date().getFullYear()
      }
    } else if (activeTab === 'dokumentasi') {
      payload = {
        title: formData.title,
        category: formData.category || 'Dokumentasi',
        image_url: formData.image_url || 'assets/img/about.jpg'
      }
    }

    try {
      await addItem(activeTab, payload)
      setMsg({ type: 'success', text: `✅ Karya "${formData.title}" berhasil ditambahkan ke portfolioData.json!` })
      
      // Reset Form
      setFormData({
        title: '',
        category: '',
        tech_stack: '',
        description: '',
        image_url: '',
        thumbnail_url: '',
        video_url: '',
        project_link: '',
        github_link: '',
        year: new Date().getFullYear()
      })
      setPreviewImage('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadTabData()
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal menambahkan: ${err.message}` })
    }
  }

  // Delete Item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Yakin ingin menghapus item ini dari data portofolio?')) return

    try {
      await deleteItem(activeTab, id)
      setMsg({ type: 'success', text: '✅ Item berhasil dihapus dari file JSON.' })
      loadTabData()
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal menghapus: ${err.message}` })
    }
  }

  return (
    <div style={{ background: '#f4f6fb', minHeight: '100vh', paddingTop: '5rem', paddingBottom: '3rem' }}>
      {/* HEADER */}
      <header className="l-header">
        <div className="nav bd-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className="nav__logo">
              <h2>Fahril Admin</h2>
            </Link>
            <span className="nav__badge" style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>
              Mode JSON Lokal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" target="_blank" style={{ fontSize: '0.85rem', color: 'var(--first-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <i className='bx bx-show'></i> Lihat Website
            </Link>
            <button onClick={handleLogout} className="nav__logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <i className='bx bx-log-out'></i> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="bd-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        {/* SIDEBAR */}
        <aside className="sidebar" style={{ background: '#fff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 4px 16px rgba(14,36,49,0.07)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.75rem', fontWeight: '700' }}>Kategori Portofolio</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <button
                className={`filter-btn ${activeTab === 'websites' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: '0.5rem' }}
                onClick={() => setActiveTab('websites')}
              >
                <i className='bx bx-globe'></i> Websites
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${activeTab === 'designs' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: '0.5rem' }}
                onClick={() => setActiveTab('designs')}
              >
                <i className='bx bx-palette'></i> Design Graphics
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${activeTab === 'videos' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: '0.5rem' }}
                onClick={() => setActiveTab('videos')}
              >
                <i className='bx bx-video'></i> Video Editing
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${activeTab === 'dokumentasi' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: '0.5rem' }}
                onClick={() => setActiveTab('dokumentasi')}
              >
                <i className='bx bx-camera'></i> Dokumentasi
              </button>
            </li>
            <li style={{ marginTop: '1rem' }}>
              <button
                className={`filter-btn ${activeTab === 'stats' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: '0.5rem' }}
                onClick={() => setActiveTab('stats')}
              >
                <i className='bx bx-stats'></i> Stat Counter
              </button>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(14,36,49,0.07)' }}>
          {msg.text && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.25rem',
              background: msg.type === 'error' ? '#fee2e2' : msg.type === 'success' ? '#dcfce7' : '#e0f2fe',
              color: msg.type === 'error' ? '#991b1b' : msg.type === 'success' ? '#166534' : '#075985',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className={`bx ${msg.type === 'error' ? 'bx-error-circle' : msg.type === 'success' ? 'bx-check-circle' : 'bx-info-circle'}`} style={{ fontSize: '1.2rem' }}></i>
              <span>{msg.text}</span>
            </div>
          )}

          {activeTab === 'stats' ? (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '700' }}>Pengaturan Statistik About Me</h2>
              <form onSubmit={handleSaveStats} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Jumlah Projects</label>
                  <input
                    type="text"
                    value={stats.projects}
                    onChange={(e) => setStats({ ...stats, projects: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Jumlah Clients</label>
                  <input
                    type="text"
                    value={stats.clients}
                    onChange={(e) => setStats({ ...stats, clients: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Persentase Happy Clients</label>
                  <input
                    type="text"
                    value={stats.happy}
                    onChange={(e) => setStats({ ...stats, happy: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Ongoing Projects</label>
                  <input
                    type="text"
                    value={stats.ongoing}
                    onChange={(e) => setStats({ ...stats, ongoing: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  <button type="submit" className="button">Simpan Statistik ke JSON</button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', textTransform: 'capitalize' }}>Kelola {activeTab}</h2>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Total: {items.length} karya</span>
              </div>

              {/* Form Tambah Item */}
              <form onSubmit={handleAddItem} style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px solid #e5e7eb' }}>
                <h3 style={{ gridColumn: 'span 2', fontSize: '1rem', fontWeight: '600', color: 'var(--first-color)' }}>
                  + Tambah Karya {activeTab}
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Judul Karya *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul karya..."
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    required
                  />
                </div>

                {activeTab === 'designs' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Kategori Desain</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Poster, UI/UX, Branding, Banner"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}

                {activeTab === 'websites' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Tech Stack (pisahkan koma)</label>
                    <input
                      type="text"
                      value={formData.tech_stack}
                      onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                      placeholder="React, Tailwind, Node.js"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}

                {activeTab === 'videos' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Kategori Video</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Cinematic, Event, Reels, Motion"
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>URL Video (YouTube / Link)</label>
                      <input
                        type="text"
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Tahun Karya</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'dokumentasi' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Kategori Dokumentasi</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Event, Seminar, Workshop"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}

                {/* IMAGE UPLOAD WIDGET */}
                <div style={{ gridColumn: 'span 2', background: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                    <i className='bx bx-cloud-upload'></i> Upload Foto dari Komputer (Otomatis Masuk ke folder assets/img/)
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {uploadingImage && <span style={{ fontSize: '0.85rem', color: 'var(--first-color)' }}>Sedang mengupload & menyalin file...</span>}
                  </div>

                  {previewImage && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={thumbUrl(previewImage)}
                        alt="Preview"
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
                        File siap digunakan: <code>{previewImage}</code>
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      Atau masukkan path gambar manual / URL online:
                    </label>
                    <input
                      type="text"
                      value={activeTab === 'videos' ? formData.thumbnail_url : formData.image_url}
                      onChange={(e) => {
                        const val = e.target.value
                        if (activeTab === 'videos') {
                          setFormData({ ...formData, thumbnail_url: val })
                        } else {
                          setFormData({ ...formData, image_url: val })
                        }
                      }}
                      placeholder="assets/img/nama-foto.jpg atau https://..."
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {activeTab === 'websites' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Project / Demo Link</label>
                      <input
                        type="text"
                        value={formData.project_link}
                        onChange={(e) => setFormData({ ...formData, project_link: e.target.value })}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>GitHub Repo Link</label>
                      <input
                        type="text"
                        value={formData.github_link}
                        onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                        placeholder="https://github.com/..."
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Deskripsi Proyek</label>
                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Penjelasan ringkas proyek..."
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
                      ></textarea>
                    </div>
                  </>
                )}

                <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                  <button type="submit" className="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className='bx bx-plus'></i> Simpan Karya ke JSON
                  </button>
                </div>
              </form>

              {/* Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Foto / Gambar</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Judul</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Kategori / Info</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data portofolio...</td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Belum ada data karya pada kategori ini.</td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <img
                              src={thumbUrl(item.image_url || item.thumbnail_url)}
                              alt={item.title}
                              style={{ width: '54px', height: '40px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{item.title}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                            {item.tech_stack || item.category || item.year || '-'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <i className='bx bx-trash'></i> Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
