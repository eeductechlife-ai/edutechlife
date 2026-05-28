import { memo, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';
import { useTranslation } from '../../i18n/I18nProvider';

const Metodo = memo(() => {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', interes: '' });
    const [submitted, setSubmitted] = useState(false);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const leadData = {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            interes: formData.interes || 'Transformación Educativa',
            tema: 'Comenzar Mi Transformación - Método'
        };
        const existing = JSON.parse(localStorage.getItem('edutechlife_leads') || '[]');
        existing.push({ ...leadData, timestamp: new Date().toISOString() });
        localStorage.setItem('edutechlife_leads', JSON.stringify(existing));
        setSubmitted(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSubmitted(false);
        setFormData({ nombre: '', email: '', telefono: '', interes: '' });
    };

    const steps = [
        {
            title: t('metodo.step_1_title'),
            description: t('metodo.step_1_desc'),
            icon: 'fa-brain'
        },
        {
            title: t('metodo.step_2_title'),
            description: t('metodo.step_2_desc'),
            icon: 'fa-route'
        },
        {
            title: t('metodo.step_3_title'),
            description: t('metodo.step_3_desc'),
            icon: 'fa-laptop-code'
        },
        {
            title: t('metodo.step_4_title'),
            description: t('metodo.step_4_desc'),
            icon: 'fa-certificate'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
                delayChildren: 0.1,
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15,
            }
        }
    };

    const floatAnimations = [
        { y: [0, -8, 0], duration: 4, delay: 0 },
        { y: [0, -8, 0], duration: 4.5, delay: 0.25 },
        { y: [0, -8, 0], duration: 5, delay: 0.5 },
        { y: [0, -8, 0], duration: 4.2, delay: 0.75 },
    ];

    return (
        <section id="metodo" ref={sectionRef} className="w-full relative overflow-hidden bg-white">
            <FloatingParticles count={15} className="z-0" />
            
            <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-primary-light/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-mint/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            
            <div className="absolute inset-0 opacity-[0.015]">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-4">
                        {t('metodo.title_before')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum">
                            {t('metodo.title_highlight')}
                        </span>
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        {t('metodo.subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            animate={isInView ? {
                                y: floatAnimations[index].y,
                                transition: {
                                    duration: floatAnimations[index].duration,
                                    delay: floatAnimations[index].delay,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }
                            } : {}}
                            className="relative group flex flex-col items-center cursor-default"
                        >
                            <motion.div
                                whileHover={{ scale: 1.12, transition: { type: "spring", stiffness: 200, damping: 10 } }}
                                className="relative z-10 circle-clay w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center mb-4 group-hover:shadow-[0_0_30px_rgba(77,168,196,0.4)] transition-shadow duration-300"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <Icon name={step.icon} className="text-3xl lg:text-4xl text-primary-light relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                
                                {index === steps.length - 1 && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mint border-4 border-white flex items-center justify-center shadow-premium">
                                        <Icon name="fa-check" className="text-xs text-white" />
                                    </div>
                                )}
                            </motion.div>

                            <div className="text-center max-w-[180px] lg:max-w-[200px]">
                                <h3 className="text-base lg:text-lg font-semibold text-petroleum mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mt-16"
                >
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-light text-white font-normal rounded-full transition-all duration-300 hover:bg-petroleum hover:shadow-premium-lg"
                    >
                        <Icon name="fa-rocket" className="text-lg" />
                        <span className="text-lg">{t('metodo.cta_text')}</span>
                        <Icon name="fa-arrow-right" className="text-lg" />
                    </button>
                </motion.div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4" onClick={closeForm}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    <div
                        className="relative bg-white rounded-2xl shadow-premium-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-border-light">
                            <button
                                onClick={closeForm}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-petroleum hover:bg-gray-100 transition-all"
                            >
                                <Icon name="fa-xmark" className="text-lg" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light to-petroleum flex items-center justify-center">
                                    <Icon name="fa-rocket" className="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-petroleum">{t('metodo.cta_text')}</h3>
                                    <p className="text-sm text-primary-light">{t('metodo.modal_subtitle')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-petroleum flex items-center justify-center mx-auto mb-6">
                                        <Icon name="fa-check" className="text-white text-3xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-petroleum mb-2">{t('metodo.success_title')}</h4>
                                    <p className="text-gray-600 mb-8">{t('metodo.success_desc')}</p>
                                    <button
                                        onClick={closeForm}
                                        className="px-8 py-3 bg-gradient-to-r from-petroleum to-primary-light text-white font-semibold rounded-full hover:shadow-premium-lg transition-all duration-300"
                                    >
                                        {t('metodo.success_close')}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_name_label')} <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                                            placeholder={t('metodo.form_name_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_email_label')} <span className="text-red-400">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                                            placeholder={t('metodo.form_email_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_phone_label')} <span className="text-red-400">*</span></label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                                            placeholder={t('metodo.form_phone_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_interest_label')}</label>
                                        <select
                                            name="interes"
                                            value={formData.interes}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all bg-white text-petroleum text-sm"
                                        >
                                            <option value="">{t('metodo.form_select_default')}</option>
                                            <option value="Diagnóstico VAK">{t('metodo.form_option_vak')}</option>
                                            <option value="Cursos STEAM">{t('metodo.form_option_steam')}</option>
                                            <option value="Tutorías Personalizadas">{t('metodo.form_option_tutoring')}</option>
                                            <option value="SmartBoard">{t('metodo.form_option_smartboard')}</option>
                                            <option value="Consultoría B2B">{t('metodo.form_option_b2b')}</option>
                                            <option value="Otro">{t('metodo.form_option_other')}</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-gradient-to-r from-petroleum to-primary-light text-white font-bold rounded-xl hover:shadow-premium-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Icon name="fa-paper-plane" className="text-sm" />
                                        {t('metodo.form_submit')}
                                    </button>

                                    <p className="text-xs text-gray-400 text-center">
                                        {t('metodo.form_privacy')}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
});

Metodo.displayName = 'Metodo';

export default Metodo;
