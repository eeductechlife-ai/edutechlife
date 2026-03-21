import { useEffect, useState } from 'react'

// Simple premium carousel for the hero left side
const slides = [
  { src: '/images/edutech-carrusel-1.png', alt: 'Nuestra Esencia 1', caption: 'Nuestra Esencia' },
  { src: '/images/edutech-carrusel-2.png', alt: 'Nuestra Esencia 2', caption: 'Nuestra esencia' },
  { src: '/images/edutech-carrusel-3.png', alt: 'Nuestra Esencia 3', caption: 'El Factor' },
  { src: '/images/edutech-carrusel-4.png', alt: 'Nuestra Esencia 4', caption: 'Humano.' },
]

export default function PremiumHeroCarousel(){
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(()=>{
    if(paused) return
    const t = setInterval(()=> setIdx(i => (i+1)%slides.length), 5000)
    return ()=> clearInterval(t)
  }, [paused])

  return (
    <div className="premium-hero-carousel" aria-label="Carrusel de la Esencia">
      <div className="premium-hero-slide glass-card glass-petro" style={{ overflow:'hidden', borderRadius:'16px', height:'320px' }}>
        <img src={slides[idx].src} alt={slides[idx].alt} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div className="premium-caption" aria-hidden="true">{slides[idx].caption}</div>
      </div>
      <div className="premium-carousel-controls" aria-label="Controles de carrusel" style={{ position:'absolute', left:0, bottom:0, padding:16, display:'flex', gap:8 }}>
        {slides.map((_,i)=> (
          <button key={i} onClick={()=>setIdx(i)} style={{ width:8, height:8, borderRadius:4, border:'none', background:i===idx?'#4DA8C4':'rgba(255,255,255,0.5)' }} aria-label={`Ir a diapositiva ${i+1}`}></button>
        ))}
      </div>
    </div>
  )
}
