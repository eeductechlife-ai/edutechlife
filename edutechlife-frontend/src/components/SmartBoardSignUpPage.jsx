import { SignIn, SignUp } from '@clerk/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import FloatingParticles from './FloatingParticles';
import { GraduationCap, BookOpen, Users, CheckCircle, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from '../i18n/I18nProvider';

const clerkAppearance = {
  variables: {
    colorPrimary: '#4DA8C4',
    colorPrimaryHover: '#66CCCC',
    colorText: '#00374A',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#F8FAFC',
    colorInputText: '#00374A',
    colorInputPlaceholder: '#64748B',
    colorDanger: '#DC2626',
    colorSuccess: '#059669',
    borderRadius: '0.75rem',
    fontSize: { base: '14px', sm: '15px', md: '16px' },
    fontFamily: "'Montserrat', sans-serif",
    fontSmoothing: 'antialiased',
    fontWeight: { normal: '400', medium: '500', bold: '600' },
    spacingUnit: { base: '0.2rem', sm: '0.25rem', md: '0.3rem' },
    animation: { slow: '400ms', default: '250ms', fast: '150ms' },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
  elements: {
    formButtonPrimary: {
      backgroundColor: '#4DA8C4',
      '&:hover': { backgroundColor: '#66CCCC' }
    },
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  }
};

const SmartBoardSignUpPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/smartboard';
  const [mode, setMode] = useState('signin');

  const handleBack = () => {
    navigate('/conoce-smartboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />

      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">{t('smartboard.signup_back')}</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Brand & Info */}
          <div className="lg:w-2/5 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] p-8 lg:p-12 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">SmartBoard</h1>
                  <p className="text-white/80 text-sm">{t('smartboard.signup_for_students')}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('smartboard.signup_welcome')}</h2>
                {mode === 'signin' ? (
                  <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('smartboard.signup_signin_desc') }} />
                ) : (
                  <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('smartboard.signup_signup_desc') }} />
                )}
                <p className="text-white/80 mt-4 text-sm italic">
                  {t('smartboard.signup_quote')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                    <span className="text-white/90">{t('smartboard.signup_feature_missions')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                    <span className="text-white/90">{t('smartboard.signup_feature_community')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                    <span className="text-white/90">{t('smartboard.signup_feature_tracking')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  {mode === 'signin'
                    ? t('smartboard.signup_no_account')
                    : t('smartboard.signup_have_account')}
                  {' '}
                  <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-white hover:underline font-medium"
                  >
                    {mode === 'signin' ? t('smartboard.signup_register_here') : t('smartboard.signup_login_here')}
                </button>
              </p>
            </div>
          </div>

          {/* Right Side - Clerk SignIn / SignUp */}
          <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center items-center">
            {/* Mode Tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6 w-full max-w-sm">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-white text-[#004B63] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LogIn className="w-4 h-4" />
                {t('smartboard.signup_login_tab')}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-white text-[#004B63] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {t('smartboard.signup_register_tab')}
              </button>
            </div>

            {/* Header */}
            <div className="mb-4 text-center w-full">
              <h3 className="text-xl font-bold text-[#004B63] mb-1">
                {mode === 'signin' ? t('smartboard.signup_login_heading') : t('smartboard.signup_register_heading')}
              </h3>
              <p className="text-[#4DA8C4] text-sm">
                {mode === 'signin'
                  ? t('smartboard.signup_login_sub')
                  : t('smartboard.signup_register_sub')}
              </p>
            </div>

            {/* Clerk Component */}
            <div className="w-full min-h-[480px] sm:min-h-[520px] py-4 sm:py-6">
              <AnimatePresence mode="wait">
                {mode === 'signin' ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SignIn
                      signUpUrl="/sign-up/smartboard"
                      afterSignInUrl="/smartboard"
                      fallbackRedirectUrl={returnTo}
                      appearance={clerkAppearance}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SignUp
                      signInUrl="/sign-up/smartboard"
                      afterSignUpUrl="/smartboard"
                      fallbackRedirectUrl={returnTo}
                      appearance={clerkAppearance}
                      metadata={{
                        user_type: 'student',
                        platform: 'smartboard',
                        age_range: '8-16',
                        registration_source: 'smartboard_signup'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer info */}
            <div className="mt-4 pt-4 border-t border-gray-200 w-full max-w-sm">
              {mode === 'signup' && (
                <p className="text-center text-[#4DA8C4] text-xs" dangerouslySetInnerHTML={{ __html: t('smartboard.signup_terms') }} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartBoardSignUpPage;
