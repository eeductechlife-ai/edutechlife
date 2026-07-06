import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const footerWhiteText = { color: '#FFFFFF' };
const footerPrimaryText = { color: '#004B63' };
const footerAccentText = { color: '#4DA8C4' };
const footerLighterBg = { backgroundColor: '#E8F4F8' };

export default function ModalCertificaciones({ onClose, content }) {
  const { t } = useTranslation();
  const c = content.certificationsContent;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={footerPrimaryText}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-certificate" className="text-2xl" style={footerWhiteText} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={footerPrimaryText}>{t('footer.certifications')}</h2>
            <p className="text-sm" style={footerAccentText}>{c.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">{c.description}</p>
          {c.list.map((cert, index) => (
            <div key={index} className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer" style={{ borderColor: '#E8F4F8', backgroundColor: '#FAFDFF' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold" style={footerPrimaryText}>{cert.titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cert.descripcion}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E8F4F8', color: '#004B63' }}>
                  {cert.nivel}
                </span>
              </div>
            </div>
          ))}
          <div className="mt-6 p-5 rounded-xl text-center" style={{ backgroundColor: '#004B63' }}>
            <p className="text-white font-medium mb-2">{c.calloutTitle}</p>
            <p className="text-sm text-white/80">{c.calloutDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
