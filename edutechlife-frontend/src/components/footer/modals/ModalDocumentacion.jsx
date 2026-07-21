import { useState } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useBodyScrollLock from '../../../hooks/useBodyScrollLock';

const footerWhiteText = { color: '#FFFFFF' };
const footerPrimaryText = { color: '#004B63' };
const footerDarkText = { color: '#374151' };
const footerMutedText = { color: '#6B7280' };
const footerAccentText = { color: '#4DA8C4' };
const footerLightBg = { backgroundColor: '#F3F9FB' };
const footerLighterBg = { backgroundColor: '#E8F4F8' };
const footerLogoInvert = { filter: 'brightness(0) invert(1)' };
const footerPrimaryButton = { backgroundColor: '#004B63', color: '#FFFFFF' };

export default function ModalDocumentacion({ onClose, content }) {
  const { t, locale } = useTranslation();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const helpArticles = content.helpArticles;
  const helpArticleContents = content.helpArticleContents;

  const focusTrapRef = useFocusTrap(true);
  useBodyScrollLock(true);

  if (selectedDoc) {
    const doc = helpArticleContents[selectedDoc];
    if (!doc) return null;

    return (
      <div ref={focusTrapRef} role="dialog" aria-modal="true" aria-label={t('footer.docs')} className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedDoc(null)}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
            <div className="flex items-center gap-3">
              <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-8 w-auto" style={footerLogoInvert} />
              <span className="text-white font-medium text-sm">{t('footer.docs')}</span>
            </div>
            <button onClick={() => setSelectedDoc(null)} aria-label="Cerrar" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20" style={footerWhiteText}>
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          <div className="px-6 md:px-10 py-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={footerLighterBg}>
                <Icon name={helpArticles.find(d => d.id === selectedDoc)?.icono || 'fa-file'} className="text-xl" style={footerPrimaryText} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={footerPrimaryText}>{doc.titulo}</h1>
                <p className="text-sm" style={footerAccentText}>{helpArticles.find(d => d.id === selectedDoc)?.tiempo} {locale === 'en' ? 'read' : 'de lectura'}</p>
              </div>
            </div>

            <p className="text-lg leading-relaxed" style={footerDarkText}>{doc.introduccion}</p>

            {doc.secciones.map((seccion, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold" style={footerPrimaryText}>{seccion.titulo}</h2>
                <p className="text-base leading-relaxed" style={footerDarkText}>{seccion.contenido}</p>

                {seccion.pasos && (
                  <ol className="space-y-2 ml-4">
                    {seccion.pasos.map((paso, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#4DA8C4', color: '#FFFFFF' }}>{i + 1}</span>
                        <span style={footerDarkText}>{paso}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {seccion.consejos && (
                  <ul className="space-y-2 ml-4">
                    {seccion.consejos.map((consejo, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="fa-lightbulb" className="text-sm mt-1" style={{ color: '#F59E0B' }} />
                        <span style={footerDarkText}>{consejo}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {seccion.especificacion && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {seccion.especificacion.map((spec, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                            <td className="py-2 font-medium" style={footerPrimaryText}>{spec.label}</td>
                            <td className="py-2" style={footerDarkText}>{spec.valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {seccion.modelos && (
                  <div className="space-y-3">
                    {seccion.modelos.map((modelo, i) => (
                      <div key={i} className="p-4 rounded-xl" style={footerLightBg}>
                        <h4 className="font-semibold" style={footerPrimaryText}>{modelo.nombre}</h4>
                        <p className="text-sm text-gray-600 mt-1">{modelo.descripcion}</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs" style={{ backgroundColor: '#E8F4F8', color: '#4DA8C4' }}>{locale === 'en' ? 'Use: ' : 'Uso: '}{modelo.caso}</span>
                      </div>
                    ))}
                  </div>
                )}
                {seccion.lista && (
                  <ul className="space-y-2 ml-4">
                    {seccion.lista.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="fa-check" className="text-sm mt-1" style={footerAccentText} />
                        <span style={footerDarkText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {seccion.opciones && (
                  <div className="space-y-2">
                    {seccion.opciones.map((opcion, i) => (
                      <div key={i} className="p-3 rounded-lg border-2" style={{ borderColor: '#E8F4F8' }}>
                        <span style={footerDarkText}>{opcion}</span>
                      </div>
                    ))}
                  </div>
                )}
                {seccion.imagen && <img src={seccion.imagen} alt={seccion.titulo} className="w-full h-48 object-cover rounded-xl" />}

                {seccion.grafica === 'linea' && renderLineChart(seccion, locale)}
                {seccion.grafica === 'barras' && renderBarChart(seccion)}
                {seccion.grafica === 'dona' && renderDonutChart(seccion)}
                {seccion.endpoints && renderEndpointsTable(seccion)}
                {seccion.codigo && renderCodeBlock(seccion)}
                {seccion.detalle && renderDetalleGrid(seccion)}
                {seccion.integraciones && renderIntegracionesTable(seccion)}
                {seccion.faqs && (
                  <div className="space-y-4">
                    {seccion.faqs.map((faq, i) => (
                      <div key={i} className="p-4 rounded-xl border-2" style={{ borderColor: '#E8F4F8' }}>
                        <h4 className="font-semibold mb-2" style={footerPrimaryText}>{faq.q}</h4>
                        <p className="text-sm" style={footerDarkText}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center gap-2">
              <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-6 w-auto" style={footerLogoInvert} />
              <span className="text-sm" style={footerMutedText}>{t('footer.docs')}</span>
            </div>
            <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={footerPrimaryButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              {locale === 'en' ? 'Back' : 'Volver'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={focusTrapRef} role="dialog" aria-modal="true" aria-label={t('footer.docs')} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8 bg-white" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={footerPrimaryText}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-folder-open" className="text-2xl" style={footerWhiteText} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={footerPrimaryText}>{t('footer.docs')}</h2>
            <p className="text-sm" style={footerAccentText}>{content.helpSubtitle}</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">{content.helpIntro}</p>
          {helpArticles.map((doc, index) => (
            <div key={index} className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer flex items-center gap-4" style={{ borderColor: '#E8F4F8', backgroundColor: '#FAFDFF' }} onClick={() => setSelectedDoc(doc.id)}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={footerLighterBg}>
                <Icon name={doc.icono} className="text-lg" style={footerPrimaryText} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={footerPrimaryText}>{doc.titulo}</h3>
                <p className="text-sm text-gray-600">{doc.descripcion}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={footerAccentText}>{doc.tiempo}</span>
                <Icon name="fa-chevron-right" className="text-sm" style={footerAccentText} />
              </div>
            </div>
          ))}
          <div className="mt-6 p-5 rounded-xl" style={footerLighterBg}>
            <div className="flex items-center gap-3 mb-2">
              <Icon name="fa-life-ring" className="text-lg" style={footerPrimaryText} />
              <h3 className="font-semibold" style={footerPrimaryText}>{content.helpNeedHelp}</h3>
            </div>
            <p className="text-sm text-gray-600">{content.helpNeedHelpDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderLineChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Evolución</h4>
      <div className="flex items-end justify-between h-40 gap-2">
        {seccion.datos.map((d, i) => {
          const max = Math.max(...seccion.datos.map(x => x.engagement || x.valor || 100));
          const h = ((d.engagement || d.valor) / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-md transition-all" style={{ height: `${h}%`, backgroundColor: i === seccion.datos.length - 1 ? '#004B63' : '#4DA8C4' }} />
              <span className="text-xs mt-2" style={{ color: '#6B7280' }}>{d.anio}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderBarChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Métricas</h4>
      <div className="space-y-3">
        {seccion.datos.map((d, i) => {
          const max = Math.max(...seccion.datos.map(x => x.antes || x.despues || x.valor || 100));
          const val = d.despues || d.valor || 0;
          const pct = (val / max) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: '#374151' }}>{d.categoria}</span>
                <span className="font-semibold" style={{ color: '#004B63' }}>{d.despues || d.valor}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#4DA8C4' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderDonutChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Distribución</h4>
      <div className="flex items-center justify-center gap-6">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {(() => {
              const colors = ['#004B63', '#4DA8C4', '#66CCCC', '#88D4E5'];
              let cumulative = 0;
              return seccion.datos.map((d, i) => {
                const pct = d.valor / 100;
                const dash = pct * 100;
                const color = colors[i % colors.length];
                const start = cumulative * 100;
                cumulative += pct;
                return <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={`${-start}`} />;
              });
            })()}
          </svg>
        </div>
        <div className="space-y-2">
          {seccion.datos.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#004B63', '#4DA8C4', '#66CCCC', '#88D4E5'][i] }} />
              <span style={{ color: '#374151' }}>{d.nombre}: {d.valor}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderEndpointsTable(seccion) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: '#F3F9FB' }}>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Método</th>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Route</th>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {seccion.endpoints.map((ep, i) => (
            <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded text-xs font-mono" style={{
                  backgroundColor: ep.metodo === 'GET' ? '#DCFCE7' : ep.metodo === 'POST' ? '#DBEAFE' : '#FEF3C7',
                  color: ep.metodo === 'GET' ? '#166534' : ep.metodo === 'POST' ? '#1E40AF' : '#92400E'
                }}>{ep.metodo}</span>
              </td>
              <td className="px-4 py-2 font-mono text-xs" style={{ color: '#374151' }}>{ep.ruta}</td>
              <td className="px-4 py-2" style={{ color: '#374151' }}>{ep.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCodeBlock(seccion) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#0F172A' }}>
        <span className="text-xs" style={{ color: '#94A3B8' }}>{seccion.lenguaje}</span>
        <Icon name="fa-code" className="text-sm" style={{ color: '#94A3B8' }} />
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto" style={{ color: '#E2E8F0' }}>{seccion.codigo}</pre>
    </div>
  );
}

function renderDetalleGrid(seccion) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
      <div>
        <span className="text-xs" style={{ color: '#6B7280' }}>Base URL</span>
        <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.base}</p>
      </div>
      <div>
        <span className="text-xs" style={{ color: '#6B7280' }}>Format</span>
        <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.formato}</p>
      </div>
      <div>
        <span className="text-xs" style={{ color: '#6B7280' }}>Auth</span>
        <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.autenticacion}</p>
      </div>
      <div>
        <span className="text-xs" style={{ color: '#6B7280' }}>Version</span>
        <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.version}</p>
      </div>
    </div>
  );
}

function renderIntegracionesTable(seccion) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: '#F3F9FB' }}>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>LMS</th>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Type</th>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {seccion.integraciones.map((int, i) => (
            <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
              <td className="px-4 py-2 font-medium" style={{ color: '#374151' }}>{int.lms}</td>
              <td className="px-4 py-2" style={{ color: '#374151' }}>{int.tipo}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded text-xs" style={{
                  backgroundColor: int.estado === 'Production' || int.estado === 'Producción' ? '#DCFCE7' : '#FEF3C7',
                  color: int.estado === 'Production' || int.estado === 'Producción' ? '#166534' : '#92400E'
                }}>{int.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
