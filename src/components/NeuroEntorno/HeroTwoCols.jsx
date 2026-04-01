import React from 'react'

// Simple two-column hero wrapper
const HeroTwoCols = ({ left, right }) => {
  return (
    <section className="hero-two-col" aria-label="Neuro Entorno Two Col Hero" style={{ width: '100%', padding: '0 1rem' }}>
      <div className="hero-two-col-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>{left}</div>
      <div className="hero-two-col-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>{right}</div>
    </section>
  )
}

export default HeroTwoCols
