import { useTranslation } from '../../../i18n/I18nProvider';

const SkipLink = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-petroleum focus:text-white focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
    >
      {t('ialab.skip_link')}
    </a>
  );
};

export default SkipLink;
