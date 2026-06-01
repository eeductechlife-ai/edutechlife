import { Icon } from '../../../utils/iconMapping.jsx';

const IALabForumEmptyState = ({ user, showInput, t }) => (
  <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
      <Icon name="fa-comments" className="text-corporate text-3xl" />
    </div>
    <h3 className="text-2xl font-bold text-petroleum-darker font-montserrat mb-3">
      {t('ialab.forum.section.empty_title')}
    </h3>
    <p className="text-slate-600 text-lg mb-2 max-w-2xl mx-auto">
      {t('ialab.forum.section.empty_desc')}
    </p>
    <p className="text-slate-500 text-sm mb-8 max-w-xl mx-auto">
      {t('ialab.forum.section.empty_hint')}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left">
        <div className="w-10 h-10 rounded-full bg-petroleum/10 flex items-center justify-center mb-3">
          <Icon name="fa-lightbulb" className="text-petroleum w-5 h-5" />
        </div>
        <h4 className="font-bold text-petroleum mb-1">{t('ialab.forum.section.empty_card1_title')}</h4>
        <p className="text-slate-600 text-sm">{t('ialab.forum.section.empty_card1_desc')}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left">
        <div className="w-10 h-10 rounded-full bg-corporate/10 flex items-center justify-center mb-3">
          <Icon name="fa-question-circle" className="text-corporate w-5 h-5" />
        </div>
        <h4 className="font-bold text-corporate mb-1">{t('ialab.forum.section.empty_card2_title')}</h4>
        <p className="text-slate-600 text-sm">{t('ialab.forum.section.empty_card2_desc')}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left">
        <div className="w-10 h-10 rounded-full bg-petroleum/10 flex items-center justify-center mb-3">
          <Icon name="fa-users" className="text-petroleum w-5 h-5" />
        </div>
        <h4 className="font-bold text-petroleum mb-1">{t('ialab.forum.section.empty_card3_title')}</h4>
        <p className="text-slate-600 text-sm">{t('ialab.forum.section.empty_card3_desc')}</p>
      </div>
    </div>
    {user && showInput && (
      <button
        onClick={() => document.querySelector('textarea')?.focus()}
        className="px-8 py-4 bg-gradient-to-r from-corporate to-corporate-dark text-white rounded-xl hover:shadow-[0_0_25px_rgba(0,188,212,0.4)] transition-all duration-300 flex items-center gap-3 font-medium text-lg mx-auto"
      >
        <Icon name="fa-plus" className="w-5 h-5" />
        {t('ialab.forum.section.empty_cta')}
      </button>
    )}
  </div>
);

export default IALabForumEmptyState;
