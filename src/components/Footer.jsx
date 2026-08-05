import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* ROW ATAS: Brand + Nav kolom-kolom */}
        <div className="footer__top">

          {/* Kolom 1: Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">Fahril<span>.</span></Link>
            <p className="footer__tagline">
              Mahasiswa Teknik Informatika yang berfokus pada videografi, desain grafis, dan pengembangan web.
            </p>
            <div className="footer__socials">
              <a href="https://www.instagram.com/m.fahrill/" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-instagram'></i>
              </a>
              <a href="https://www.linkedin.com/in/muh-fahril-812b11209/" className="footer__social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-linkedin'></i>
              </a>
              <a href="https://github.com/fahril168" className="footer__social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-github'></i>
              </a>
              <a href="https://wa.me/6282271591208" className="footer__social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-whatsapp'></i>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigasi</h4>
            <ul className="footer__nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Work</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Portfolio */}
          <div className="footer__col">
            <h4 className="footer__col-title">Portfolio</h4>
            <ul className="footer__nav">
              <li><Link to="/design">Design Graphics</Link></li>
              <li><Link to="/video">Video Editing</Link></li>
              <li><Link to="/website">Websites</Link></li>
              <li><Link to="/dokumentasi">Dokumentasi</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div className="footer__col">
            <h4 className="footer__col-title">Kontak</h4>
            <ul className="footer__contact-list">
              <li>
                <i className='bx bxs-envelope'></i>
                <a href="mailto:muh.fahril.uho@gmail.com">muh.fahril.uho@gmail.com</a>
              </li>
              <li>
                <i className='bx bxl-whatsapp'></i>
                <a href="https://wa.me/6282271591208">+62 822-7159-1208</a>
              </li>
              <li>
                <i className='bx bxs-map'></i>
                <span>Kendari, Sulawesi Tenggara</span>
              </li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="footer__divider"></div>

        {/* ROW BAWAH: copyright + back to top */}
        <div className="footer__bottom">
          <p className="footer__copy">&copy; 2026 Muh. Fahril. All rights reserved.</p>
          <a href="#top" onClick={scrollToTop} className="footer__totop" aria-label="Kembali ke atas">
            <i className='bx bx-chevron-up'></i>
          </a>
        </div>

      </div>
    </footer>
  )
}
