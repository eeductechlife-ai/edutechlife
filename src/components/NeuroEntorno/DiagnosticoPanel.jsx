import React from 'react'

const card = (colorFrom, colorTo, label) => ({
  background: `linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)`,
  color: '#fff',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  textAlign: 'center',
  minWidth: '100px',
  boxShadow: '0 4px 15px rgba(0,0,0,.15)'
})

export default function DiagnosticoPanel(){
  return (
    <div className="diagnostico-panel glass-card" style={{ padding: '0 1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #004B63 0%, #0B2A3A 100%)', color: 'white', padding: '6px 16px', borderRadius: '999px', display:'inline-block', fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.08em', marginBottom:'0.75rem' }}>
        DIAGNÓSTICO COGNITIVO
      </div>
      <h3 style={{ color: '#004B63', margin: '0 0 0.75rem 0', fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem' }}>ESTILO DE APRENDIZAJE VAK</h3>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div style={card('#4DA8C4','#66CCCC','VISUAL')}><div style={{ fontSize:'1.25rem', marginBottom:'0.25rem' }} className="">👁</div>VISUAL</div>
        <div style={card('#66CCCC','#4DA8C4','AUDITIVO')}><div style={{ fontSize:'1.25rem', marginBottom:'0.25rem' }} className="">👂</div>AUDITIVO</div>
        <div style={card('#004B63','#4DA8C4','KINESTÉSICO')}><div style={{ fontSize:'1.25rem', marginBottom:'0.25rem' }} className="">🤚</div>KINESTÉSICO</div>
      </div>
      <button onClick={()=>{}} style={{ width:'100%', padding:'0.9rem 1.5rem', borderRadius:'999px', border:'none', background:'linear-gradient(135deg, #4DA8C4, #66CCCC)', color:'#fff', fontWeight:700, cursor:'pointer' }}>Comenzar Evaluación</button>
      <div style={{ textAlign:'center', color:'#6b7280', marginTop:'0.75rem' }}>3 minutos · 10 preguntas · 100% personalizado</div>
    </div>
  )
}
