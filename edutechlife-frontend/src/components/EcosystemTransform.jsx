import React from 'react';

const Card = ({ title, subtitle, color, description }) => (
  <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6">
    <div className="flex items-center mb-3">
      <div className="w-9 h-9 rounded-full" style={{ background: color, display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
        ✨
      </div>
      <h3 className="ml-3 text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-sm text-gray-600">{subtitle}</div>
    <p className="mt-2 text-sm text-gray-700">{description}</p>
  </div>
);

const EcosystemTransform = () => {
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800" style={{ letterSpacing: '-0.02em' }}>
          Ecosistema de Transformación
        </h2>
        <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
          Docentes con maestría en educación que dominan IA y metodologías de vanguardia para transformar Colombia.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="NEURO-ENTORNO EDUCATIVO"
            subtitle="Acompañamiento integral basado en VAK y STEAM"
            color="#4DA8C4"
            description="Docentes con enfoque en neurociencia educativa para potenciar el aprendizaje."
          />
          <Card
            title="PROYECTOS DE IMPACTO NACIONAL"
            subtitle="Escalando aprendizajes a gran escala"
            color="#66CCCC"
            description="Proyectos con alcance nacional que empujan la innovación educativa."
          />
          <Card
            title="CONSULTORÍA B2B Y AUTOMATIZACIÓN"
            subtitle="Soluciones a medida para organizaciones"
            color="#FF6B9D"
            description="Transformación de procesos educativos con IA y automatización."
          />
        </div>
      </div>
    </section>
  );
};

export default EcosystemTransform;
