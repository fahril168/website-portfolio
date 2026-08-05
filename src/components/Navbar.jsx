import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleNavClick = (sectionId) => {
    closeMenu()
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } })
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    if (location.pathname !== '/') return

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollY = window.scrollY

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 100
        const sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  return (
    <header className="l-header">
      <nav className="nav bd-grid">
        <div>
          <Link to="/" className="nav__logo" onClick={closeMenu}>
            <h2>Fahril</h2>
          </Link>
        </div>

        <div className={`nav__menu ${menuOpen ? 'show' : ''}`} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <button
                type="button"
                className={`nav__link ${location.pathname === '/' && activeSection === 'home' ? 'active-link' : ''}`}
                onClick={() => handleNavClick('home')}
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                Home
              </button>
            </li>
            <li className="nav__item">
              <button
                type="button"
                className={`nav__link ${location.pathname === '/' && activeSection === 'about' ? 'active-link' : ''}`}
                onClick={() => handleNavClick('about')}
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                About
              </button>
            </li>
            <li className="nav__item">
              <button
                type="button"
                className={`nav__link ${location.pathname === '/' && activeSection === 'work' ? 'active-link' : ''}`}
                onClick={() => handleNavClick('work')}
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                Work
              </button>
            </li>
            <li className="nav__item">
              <button
                type="button"
                className={`nav__link ${location.pathname === '/' && activeSection === 'contact' ? 'active-link' : ''}`}
                onClick={() => handleNavClick('contact')}
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <i className={menuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
        </div>
      </nav>
    </header>
  )
}
