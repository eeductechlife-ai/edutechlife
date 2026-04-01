import React from 'react'

export default function VAKInfoPanel(){
  return (
    <div className="vak-info-panel" style={{ padding: '1rem', color: '#fff' }}>
      <h3 style={{ color: '#004B63', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Qué es el método VAK?</h3>
      <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#e5e7eb' }}>
        VAK es un modelo neuropsicológico que identifica cómo procesa información cada persona: Visual (imágenes), Auditivo (sonidos) o Kinestésico (experiencias). Conocer tu estilo te permite estudiar de forma más eficiente.
      </p>
      <div style={{ display:'flex', gap:'1rem', justifyContent:'center', marginTop:'0.75rem' }}>
        <div style={{ width:'60px', height:'60px', display:'grid', placeItems:'center', borderRadius: '12px', background:'#fff', color:'#4DA8C4' }}>
          <i className="fa-solid fa-eye" />
        </div>
        <div style={{ width:'60px', height:'60px', display:'grid', placeItems:'center', borderRadius: '12px', background:'#fff', color:'#66CCCC' }}>
          <i className="fa-solid fa-ear-listen" />
        </div>
        <div style={{ width:'60px', height:'60px', display:'grid', placeItems:'center', borderRadius: '12px', background:'#fff', color:'#004B63' }}>
          <i className="fa-solid fa-hand" />
        </div>
      </div>
    </div>
  )
}
