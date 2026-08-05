import React from 'react'

export default function HeroShapes({ className = "hero-shapes" }) {
  return (
    <div className={className}>
      <div className="shape shape-circle-1"></div>
      <div className="shape shape-circle-2"></div>
      <div className="shape shape-triangle"></div>
    </div>
  )
}
