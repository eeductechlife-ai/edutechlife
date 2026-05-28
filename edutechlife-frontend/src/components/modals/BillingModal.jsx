import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const BillingModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const planInfo = {
    name: t('modals.billing.plan_name'),
    price: t('modals.billing.plan_price'),
    renewalDate: t('modals.billing.renewal_date'),
    status: t('modals.billing.status_active'),
    features: [
      t('modals.billing.feature_1'),
      t('modals.billing.feature_2'),
      t('modals.billing.feature_3'),
      t('modals.billing.feature_4'),
      t('modals.billing.feature_5'),
      t('modals.billing.feature_6'),
    ],
  };

  const paymentHistory = [
    { date: '15/05/2026', amount: '$29.990', method: t('modals.billing.payment_method'), status: t('modals.billing.payment_status_paid') },
    { date: '15/04/2026', amount: '$29.990', method: t('modals.billing.payment_method'), status: t('modals.billing.payment_status_paid') },
    { date: '15/03/2026', amount: '$29.990', method: t('modals.billing.payment_method'), status: t('modals.billing.payment_status_paid') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label={t('modals.billing.close')}
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <div className="border-b border-slate-200/60 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 pt-10 pb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-credit-card" className="text-[#004B63] text-sm" />
            </div>
            <h3 className="text-slate-800 font-bold text-base">{t('modals.billing.title')}</h3>
          </div>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Plan actual */}
          <div className="mb-6 p-4 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">{t('modals.billing.current_plan')}</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                {planInfo.status}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-[#004B63]">{planInfo.name}</span>
              <span className="text-sm text-slate-500 pb-1">{planInfo.price}</span>
            </div>
            <p className="text-xs text-slate-500">
              {t('modals.billing.renewal_label')} {planInfo.renewalDate}
            </p>
          </div>

          {/* Características del plan */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Icon name="fa-check-circle" className="text-[#00BCD4]" />
              {t('modals.billing.includes_title')}
            </h4>
            <div className="space-y-2">
              {planInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                  <Icon name="fa-check" className="text-emerald-500 text-xs flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de pagos */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Icon name="fa-clock" className="text-[#004B63]" />
              {t('modals.billing.payment_history_title')}
            </h4>
            <div className="space-y-2">
              {paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-lg"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{payment.date}</p>
                    <p className="text-[10px] text-slate-500">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">{payment.amount}</p>
                    <p className="text-[10px] text-emerald-600">{payment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón gestionar suscripción */}
          <div className="mt-6 pt-4 border-t border-slate-200/60">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800">
              <Icon name="fa-cog" className="text-[#004B63]" />
              {t('modals.billing.manage_subscription')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
