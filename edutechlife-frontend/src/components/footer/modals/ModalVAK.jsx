import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const footerWhiteText = { color: '#FFFFFF' };
const footerPrimaryText = { color: '#004B63' };
const footerAccentText = { color: '#4DA8C4' };
const footerLighterBg = { backgroundColor: '#E8F4F8' };

export default function ModalVAK({ onClose, content }) {
  const { t } = useTranslation();
  const c = content.vakContent;
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
            <Icon name="fa-brain" className="text-2xl" style={footerWhiteText} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={footerPrimaryText}>{t('footer.methodology')}</h2>
            <p className="text-sm" style={footerAccentText}>{c.subtitle}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">{c.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.styles.map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={footerLighterBg}>
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                  <Icon name={s.icon} className="text-lg" style={footerWhiteText} />
                </div>
                <h3 className="font-semibold mb-2" style={footerPrimaryText}>{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-xl" style={{ backgroundColor: '#004B63' }}>
            <h3 className="font-semibold mb-2 text-white">{c.calloutTitle}</h3>
            <p className="text-sm text-white/80">{c.calloutDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
