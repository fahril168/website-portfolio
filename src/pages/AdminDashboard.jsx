import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sbFetch, supabase, thumbUrl } from '../config/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('websites') // websites | designs | videos | dokumentasi | stats
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ projects: '15+', clients: '10+', happy: '99%', ongoing: '3' })
  const [msg, setMsg] = useState({ type: '', text: '' })

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

  // Fetch Current Data Tab
  const loadTabData = async () => {
    setLoading(true)
    setMsg({ type: '', text: '' })

    try {
      if (activeTab === 'stats') {
        const res = await sbFetch('portfolio_stats?select=*')
        if (res && res.length > 0) {
          setStats({
            projects: res[0].projects || '15+',
            clients: res[0].clients || '10+',
            happy: res[0].happy || '99%',
            ongoing: res[0].ongoing || '3'
          })
        }
      } else {
        let order = 'created_at.desc'
        if (activeTab === 'videos') order = 'year.desc,created_at.desc'
        const res = await sbFetch(`${activeTab}?select=*&order=${order}`)
        setItems(res || [])
      }
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal memuat data: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTabData()
  }, [activeTab])

  // Save Stats
  const handleSaveStats = async (e) => {
    e.preventDefault()
    setMsg({ type: 'info', text: 'Menyimpan statistik...' })

    try {
      const { error } = await supabase
        .from('portfolio_stats')
        .upsert([{ id: 1, ...stats }])

      if (error) throw error
      setMsg({ type: 'success', text: 'Statistik berhasil diperbarui!' })
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

    setMsg({ type: 'info', text: 'Menambahkan item...' })

    let payload = {}
    if (activeTab === 'websites') {
      payload = {
        title: formData.title,
        tech_stack: formData.tech_stack,
        description: formData.description,
        image_url: formData.image_url,
        project_link: formData.project_link,
        github_link: formData.github_link
      }
    } else if (activeTab === 'designs') {
      payload = {
        title: formData.title,
        category: formData.category || 'Desain',
        image_url: formData.image_url
      }
    } else if (activeTab === 'videos') {
      payload = {
        title: formData.title,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url,
        year: parseInt(formData.year) || new Date().getFullYear()
      }
    } else if (activeTab === 'dokumentasi') {
      payload = {
        title: formData.title,
        image_url: formData.image_url
      }
    }

    try {
      const { error } = await supabase.from(activeTab).insert([payload])
      if (error) throw error

      setMsg({ type: 'success', text: 'Item baru berhasil ditambahkan!' })
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
      loadTabData()
    } catch (err) {
      setMsg({ type: 'error', text: `Gagal menambahkan: ${err.message}` })
    }
  }

  // Delete Item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return

    try {
      const { error } = await supabase.from(activeTab).delete().eq('id', id)
      if (error) throw error
      setMsg({ type: 'success', text: 'Item berhasil dihapus.' })
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
            <span className="nav__badge">Dashboard</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Halo, Admin</span>
            <button onClick={handleLogout} className="nav__logout">
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
              marginBottom: '1rem',
              background: msg.type === 'error' ? '#fee2e2' : msg.type === 'success' ? '#dcfce7' : '#e0f2fe',
              color: msg.type === 'error' ? '#991b1b' : msg.type === 'success' ? '#166534' : '#075985',
              fontSize: '0.9rem'
            }}>
              {msg.text}
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
                  <button type="submit" className="button">Simpan Statistik</button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700', textTransform: 'capitalize' }}>Kelola {activeTab}</h2>

              {/* Form Tambah Item */}
              <form onSubmit={handleAddItem} style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <h3 style={{ gridColumn: 'span 2', fontSize: '1rem', fontWeight: '600' }}>+ Tambah Karya {activeTab}</h3>

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
                      placeholder="e.g. Poster, UI/UX, Branding"
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
                      placeholder="React, Supabase, Tailwind"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}

                {activeTab === 'videos' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>URL Video (YouTube / Drive)</label>
                      <input
                        type="text"
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://..."
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

                {(activeTab === 'websites' || activeTab === 'designs' || activeTab === 'dokumentasi') && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>URL Gambar / Thumbnail</label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://... atau nama file"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}

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
                  <button type="submit" className="button">+ Tambahkan ke Database</button>
                </div>
              </form>

              {/* Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Gambar / Thumbnail</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Judul</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Info / Stack</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td>
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
                              src={thumbUrl(item.image_url || item.thumbnail_url, activeTab) || 'assets/img/work1.jpg'}
                              alt={item.title}
                              style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '0.25rem' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{item.title}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                            {item.tech_stack || item.category || item.year || '-'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                            >
                              Hapus
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
