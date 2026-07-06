import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const footerWhiteText = { color: '#FFFFFF' };
const footerPrimaryText = { color: '#004B63' };
const footerAccentText = { color: '#4DA8C4' };
const footerDarkText = { color: '#374151' };
const footerMutedText = { color: '#6B7280' };
const footerLogoInvert = { filter: 'brightness(0) invert(1)' };
const footerPrimaryButton = { backgroundColor: '#004B63', color: '#FFFFFF' };

export default function ModalTerminos({ onClose, content }) {
  const { t } = useTranslation();
  const c = content.termsContent;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
          <div className="flex items-center gap-3">
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-8 w-auto" style={footerLogoInvert} />
            <span className="text-white font-medium text-sm">{t('footer.terms')}</span>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20" style={footerWhiteText}>
            <Icon name="fa-xmark" className="text-lg" />
          </button>
        </div>

        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={footerPrimaryText}>{t('footer.terms')}</h1>
            <p className="text-sm" style={footerAccentText}>{c.lastUpdate}</p>
          </div>

          <div className="space-y-6">
            {c.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                <h2 className="text-lg font-bold" style={footerPrimaryText}>{section.title}</h2>
                <p className="text-base leading-relaxed" style={footerDarkText}>{section.content}</p>
                {section.prohibitions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.prohibitions.map((prohibido, pi) => (
                      <div key={pi} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                        <Icon name="fa-xmark" className="text-sm" style={{ color: '#DC2626' }} />
                        <span className="text-sm" style={{ color: '#991B1B' }}>{prohibido}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center gap-2">
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-6 w-auto" style={footerLogoInvert} />
            <span className="text-sm" style={footerMutedText}>{t('footer.terms')}</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={footerPrimaryButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
