import { Icon } from '../../../utils/iconMapping.jsx';

const InteractiveViewer = ({ resource }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-puzzle-piece" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-petroleum/70">
              <span>Recurso interactivo</span>
              {resource.estimatedTime && <span>• {resource.estimatedTime}</span>}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum rounded-lg font-medium text-sm">
          <Icon name="fa-bolt" className="w-4 h-4 inline mr-1" />
          Interactivo
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-petroleum to-corporate rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon name="fa-bolt" className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-petroleum mb-3">
            {resource.title}
          </h3>
          
          <p className="text-petroleum/70 mb-6">
            {resource.description || "Este recurso interactivo está diseñado para aprendizaje práctico."}
          </p>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-petroleum/25 dark:border-petroleum/40 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-petroleum/80">Simulación activa</span>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">En tiempo real</span>
            </div>
            
            <div className="h-32 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-lg border border-petroleum/25 flex items-center justify-center">
              <div className="text-center">
                <Icon name="fa-spinner" className="text-[#06B6D4] text-2xl mb-2 animate-spin" />
                <p className="text-sm text-petroleum/70">Cargando experiencia interactiva...</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-petroleum/60">
            <p>Este es un recurso interactivo que requiere interacción del usuario.</p>
            <p>En producción, aquí se cargaría la herramienta interactiva real.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveViewer;
