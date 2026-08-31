import React, { useEffect, useRef } from 'react'

export function WarpBackground({
  children,
  className = '',
  gridSize = 60,
  ...props
}) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const cellStatesRef = useRef({})
  const animFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const isMobileCheck = () => {
      return (
        window.innerWidth <= 768 ||
        (typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(hover: none), (max-width: 768px)').matches)
      )
    }

    let isMobile = isMobileCheck()

    // Draw clean static grid (used on mobile for maximum smoothness and zero lag/bugs)
    const drawStaticGrid = () => {
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Static Light Gray grid lines
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(width, y + 0.5)
        ctx.stroke()
      }
    }

    // Interactive render loop with mouse cell hover effect (for desktop)
    const renderInteractive = () => {
      if (isMobile) return

      ctx.clearRect(0, 0, width, height)

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      const scrollY = window.scrollY || 0
      const scrollX = window.scrollX || 0

      const offsetY = scrollY % gridSize
      const offsetX = scrollX % gridSize

      const cols = Math.ceil(width / gridSize) + 2
      const rows = Math.ceil(height / gridSize) + 2

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Identify exact single cell under mouse in page coordinates
      const pageMx = mx + scrollX
      const pageMy = my + scrollY
      const hoverCol = Math.floor(pageMx / gridSize)
      const hoverRow = Math.floor(pageMy / gridSize)

      // Starting grid row index in page space
      const startRow = Math.floor(scrollY / gridSize) - 1
      const startCol = Math.floor(scrollX / gridSize) - 1

      // Update cell states
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const row = startRow + r
          const col = startCol + c
          const key = `${col}_${row}`
          const isTargetCell = col === hoverCol && row === hoverRow
          const targetAlpha = isTargetCell ? 0.25 : 0

          const prev = cellStatesRef.current[key] || 0
          cellStatesRef.current[key] = prev + (targetAlpha - prev) * 0.15
        }
      }

      // Draw single hovered grid cell relative to scroll offset
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const row = startRow + r
          const col = startCol + c
          const key = `${col}_${row}`
          const alpha = cellStatesRef.current[key] || 0

          if (alpha > 0.005) {
            const vx = col * gridSize - scrollX
            const vy = row * gridSize - scrollY

            // Darkened cell fill
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`
            ctx.fillRect(vx + 0.5, vy + 0.5, gridSize - 1, gridSize - 1)

            // Subtle border outline for the hovered cell
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 1.2})`
            ctx.lineWidth = 1
            ctx.strokeRect(vx + 0.5, vy + 0.5, gridSize - 1, gridSize - 1)
          }
        }
      }

      // Draw Light Gray grid lines offset by scrollY / scrollX
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      // Vertical lines moving with scrollX
      for (let x = -offsetX; x <= width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, height)
        ctx.stroke()
      }

      // Horizontal lines moving with scrollY
      for (let y = -offsetY; y <= height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(width, y + 0.5)
        ctx.stroke()
      }

      animFrameRef.current = requestAnimationFrame(renderInteractive)
    }

    const startMode = () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }

      isMobile = isMobileCheck()

      if (isMobile) {
        drawStaticGrid()
      } else {
        animFrameRef.current = requestAnimationFrame(renderInteractive)
      }
    }

    startMode()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      startMode()
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e) => {
      if (isMobile) return
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleMouseLeave = () => {
      if (isMobile) return
      mouseRef.current = { x: -1000, y: -1000 }
    }
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [gridSize])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#ffffff',
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
