import { memo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Icon } from '../../../utils/iconMapping.jsx'

const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const IALabForumOptimizedInput = ({
    handleSubmitMessage,
    user,
    newMessage,
    setNewMessage,
    isSubmitting,
    prefersReducedMotion,
    getInitials: getInitialsProp,
    t,
    cn
}) => {
    const initialsFn = getInitialsProp || getInitials;

    return (
        <div className="border-t border-slate-100 p-4 md:p-6">
            <form onSubmit={handleSubmitMessage} className="relative">
                <div className="flex items-center gap-3">
                    {user && (
                        <div className={cn(
                            "w-8 h-8 rounded-full flex-shrink-0",
                            "bg-gradient-to-tr from-petroleum to-petroleum-dark",
                            "flex items-center justify-center",
                            "shadow-sm"
                        )}>
                            <span className="text-xs font-bold text-white">
                                {initialsFn(user.full_name || user.email)}
                            </span>
                        </div>
                    )}

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t('ialab.forum.optimized.input_placeholder')}
                            disabled={isSubmitting || !user}
                            className={cn(
                                "w-full px-4 py-3 pr-12",
                                "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl",
                                "text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-600/70 dark:placeholder:text-slate-400",
                                "focus:outline-none focus:ring-2 focus:ring-corporate/20 focus:border-corporate/30",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "transition-all duration-200",
                                "shadow-sm focus:shadow-md"
                            )}
                            maxLength={500}
                        />

                        {newMessage.length > 0 && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className={cn(
                                    "text-[10px] font-medium",
                                    newMessage.length > 450 ? "text-amber-500" : "text-slate-600"
                                )}>
                                    {newMessage.length}/500
                                </span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        disabled={!newMessage.trim() || isSubmitting || !user}
                        className={cn(
                            "px-4 py-3 rounded-xl",
                            "bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate",
                            "text-white text-sm font-medium",
                            "hover:shadow-[0_0_15px_rgba(0,188,212,0.3)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-200",
                            "flex items-center justify-center gap-2",
                            "shadow-sm",
                            "relative overflow-hidden group"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{t('ialab.forum.optimized.sending')}</span>
                            </>
                        ) : (
                            <>
                                <Icon name="fa-paper-plane" />
                                <span className="hidden sm:inline">{t('ialab.forum.optimized.send')}</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {!user && (
                    <div className="mt-2 text-center">
                        <p className="text-xs text-slate-500">
                            <a href="/auth" className="text-petroleum hover:text-petroleum-dark font-medium">
                                {t('ialab.forum.optimized.login_link')}
                            </a>{t('ialab.forum.optimized.login_prompt')}
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

IALabForumOptimizedInput.propTypes = {
    handleSubmitMessage: PropTypes.func.isRequired,
    user: PropTypes.object,
    newMessage: PropTypes.string.isRequired,
    setNewMessage: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    prefersReducedMotion: PropTypes.bool,
    getInitials: PropTypes.func,
    t: PropTypes.func.isRequired,
    cn: PropTypes.func.isRequired,
};

export default memo(IALabForumOptimizedInput);
