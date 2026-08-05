import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const navigate = useNavigate()

  const ADMIN_USER = 'admin'
  const ADMIN_PASS = 'fahril123'

  const handleLogin = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username || !password) {
      setErrorMsg('⚠ Username dan password wajib diisi.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem('fahril_admin', '1')
        navigate('/admin')
      } else {
        setIsLoading(false)
        setErrorMsg('Username atau password salah.')
        setShake(true)
        setTimeout(() => setShake(false), 400)
      }
    }, 800)
  }

  return (
    <div className="login-page" style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className={`login-wrapper ${shake ? 'shake' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '900px', width: '100%', background: '#fff', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(14, 36, 49, 0.12)' }}>
        
        {/* LEFT PANEL */}
        <div className="login-left" style={{ background: 'var(--second-color)', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
          <div className="login-brand" style={{ fontSize: '2.2rem', fontWeight: '700' }}>
            Fahril<span style={{ color: 'var(--first-color)' }}>.</span>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Admin Portal</h2>
          <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
            Masuk untuk mengelola seluruh karya portofolio, statistik client, dan proyek di Supabase database.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--second-color)' }}>Selamat Datang</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Masukkan kredensial admin Anda untuk melanjutkan</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <i className='bx bx-user' style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <i className='bx bx-lock-alt' style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'}></i>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <i className='bx bx-error-circle'></i> {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="button"
              style={{ width: '100%', padding: '0.85rem', cursor: 'pointer' }}
            >
              {isLoading ? 'Memeriksa...' : 'Masuk '}
              {!isLoading && <i className='bx bx-log-in' style={{ marginLeft: '4px' }}></i>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
            Kembali ke <Link to="/" style={{ color: 'var(--first-color)', fontWeight: '600' }}>halaman portfolio</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
