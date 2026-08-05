import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import DesignPage from './pages/DesignPage'
import VideoPage from './pages/VideoPage'
import WebsitePage from './pages/WebsitePage'
import DokumentasiPage from './pages/DokumentasiPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import { WarpBackground } from './components/ui/warp-background'

export default function App() {
  const location = useLocation()
  const isAdminOrLogin = location.pathname === '/admin' || location.pathname === '/login'

  return (
    <WarpBackground>
      <div className="app-container">
        {!isAdminOrLogin && <Navbar visible={true} />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/website" element={<WebsitePage />} />
          <Route path="/dokumentasi" element={<DokumentasiPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {!isAdminOrLogin && <Footer />}
      </div>
    </WarpBackground>
  )
}
