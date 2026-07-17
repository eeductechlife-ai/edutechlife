import { motion } from 'framer-motion';
import FloatingParticles from '../../FloatingParticles';
import MagneticButton from '../../MagneticButton';
import SplitTextReveal from '../../SplitTextReveal';

export default function VAKInfoPanel({ onBack, onNavigate }) {
    return (
        <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#B2D8E5] via-[#E8F4F8] to-[#B2D8E5]">
            
            <motion.button
                onClick={onBack}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    transition: { 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 15 
                    }
                }}
                whileHover={{ 
                    x: 5, 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 10px 30px rgba(0, 75, 99, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group absolute top-8 left-8 flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border-2 border-[#004B63] text-[#004B63] font-bold hover:border-[#4DA8C4] transition-all duration-500 z-30 shadow-premium-lg hover:shadow-premium-xl"
            >
                <motion.div
                    animate={{ x: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="relative"
                >
                    <i className="fa-solid fa-arrow-left text-lg group-hover:text-xl transition-all duration-500" />
                    <div className="absolute -inset-1 bg-[#4DA8C4]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
                
                <motion.span className="relative overflow-hidden">
                    <span className="relative z-10">Volver</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#4DA8C4]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.span>
                
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4DA8C4] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[sparkle_1s_ease-in-out]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#66CCCC] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[sparkle_1s_ease-in-out]" style={{ animationDelay: '0.3s' }} />
            </motion.button>

            <FloatingParticles count={35} className="z-0" colors={['#004B63', '#2D7A94', '#0B2A3A']} />
            
            <div className="absolute top-[10%] left-[5%] w-4 h-4 bg-[#004B63]/30 rounded-full animate-[float-3d_8s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-[#2D7A94]/25 rounded-full animate-[float-3d_10s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-1s' }} />
            <div className="absolute bottom-[25%] left-[10%] w-5 h-5 bg-[#0B2A3A]/20 rounded-full animate-[float-3d_12s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-[15%] right-[10%] w-4 h-4 bg-[#004B63]/30 rounded-full animate-[float-3d_9s_ease-in-out_infinite] blur-sm" />
            <div className="absolute top-[35%] right-[5%] w-3 h-3 bg-[#2D7A94]/25 rounded-full animate-[float-3d_11s_ease-in-out_infinite] blur-sm" />
            <div className="absolute bottom-[30%] right-[15%] w-5 h-5 bg-[#0B2A3A]/20 rounded-full animate-[float-3d_13s_ease-in-out_infinite] blur-sm" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-radial from-[#004B63]/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center w-full">
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="flex-1 max-w-lg w-full"
                    >
                        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/30 rounded-2xl p-4 shadow-premium-md">
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-4 bg-gradient-to-r from-[#004B63] via-[#2D7A94] to-[#004B63] text-white shadow-premium-lg border border-[#4DA8C4]/50 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    className="relative"
                                >
                                    <i className="fa-solid fa-gift text-sm text-[#66CCCC] group-hover:text-white transition-all duration-500" />
                                    <div className="absolute -inset-2 bg-[#66CCCC]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.div>
                                
                                <motion.span 
                                    className="text-sm font-bold uppercase tracking-[0.15em] text-white"
                                    whileHover={{ letterSpacing: "0.2em" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    REALÍZALO GRÁTIS
                                </motion.span>
                                
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#66CCCC] rounded-full animate-[sparkle_1s_ease-in-out]" />
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[sparkle_1s_ease-in-out]" style={{ animationDelay: '0.3s' }} />
                            </motion.div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-2xl lg:text-3xl font-black text-[#004B63] mt-2 mb-4 font-montserrat tracking-tight leading-tight"
                            >
                                Estilo de Aprendizaje VAK
                            </motion.h2>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <motion.div 
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{ 
                                        y: [0, -3, 0],
                                        transition: { 
                                            duration: 4, 
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }
                                    }}
                                    className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #004B63 0%, #2D7A94 100%)',
                                        boxShadow: '0 10px 25px rgba(0, 75, 99, 0.2)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative mb-3">
                                        <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                        <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                            <i className="fa-solid fa-eye text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">VISUAL</div>
                                    <div className="text-white/70 text-xs font-medium mt-1">Ver para aprender</div>
                                    
                                    <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{ 
                                        y: [0, -3, 0],
                                        transition: { 
                                            duration: 4, 
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            delay: 0.5
                                        }
                                    }}
                                    className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #2D7A94 0%, #004B63 100%)',
                                        boxShadow: '0 10px 25px rgba(45, 122, 148, 0.2)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative mb-3">
                                        <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                        <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                            <i className="fa-solid fa-ear-listen text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">AUDITIVO</div>
                                    <div className="text-white/70 text-xs font-medium mt-1">Escuchar para comprender</div>
                                    
                                    <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{ 
                                        y: [0, -3, 0],
                                        transition: { 
                                            duration: 4, 
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            delay: 1
                                        }
                                    }}
                                    className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #0B2A3A 0%, #004B63 100%)',
                                        boxShadow: '0 10px 25px rgba(11, 42, 58, 0.2)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative mb-3">
                                        <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#B2D8E5] to-[#66CCCC] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                        <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                            <i className="fa-solid fa-hand text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">KINEST</div>
                                    <div className="text-white/70 text-xs font-medium mt-1">Hacer para internalizar</div>
                                    
                                    <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                </motion.div>
                            </div>
                            
                            <MagneticButton 
                                onClick={() => onNavigate('vak')}
                                className="group relative overflow-hidden w-full flex items-center justify-center gap-3 px-8 py-3 rounded-full text-base font-bold mb-4 border-2 border-[#004B63] hover:border-[#4DA8C4] transition-all duration-500"
                                style={{ 
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDFF 50%, #E8F4F8 100%)',
                                    color: '#004B63',
                                    boxShadow: '0 8px 20px rgba(0, 75, 99, 0.15)'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4]/0 via-[#4DA8C4]/10 to-[#66CCCC]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <motion.span 
                                    className="relative z-10 font-semibold"
                                    style={{ color: '#004B63' }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    Comenzar Evaluación
                                </motion.span>
                                
                                <motion.div
                                    className="relative z-10"
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <i className="fa-solid fa-arrow-right text-sm" style={{ color: '#004B63' }} />
                                </motion.div>
                            </MagneticButton>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="flex justify-center gap-6 flex-wrap"
                            >
                                <motion.div 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <i className="fa-solid fa-clock text-[#004B63] text-base" />
                                    <span className="text-[#004B63] font-bold text-sm">3 min</span>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                >
                                    <i className="fa-solid fa-circle-question text-[#2D7A94] text-base" />
                                    <span className="text-[#004B63] font-bold text-sm">10 preguntas</span>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                >
                                    <i className="fa-solid fa-bullseye text-[#0B2A3A] text-base" />
                                    <span className="text-[#004B63] font-bold text-sm">100% personal</span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 max-w-lg w-full text-[#004B63]"
                    >
                        <div className="p-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="mb-6"
                            >
                                <h1 className="text-2xl lg:text-3xl font-black mb-3 font-montserrat tracking-tight leading-tight text-[#004B63]">
                                    <SplitTextReveal text="¿Qué es el método VAK?" />
                                </h1>
                                
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "60%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                                />
                            </motion.div>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-base sm:text-lg leading-relaxed mb-6 font-medium text-[#0B2A3A]"
                            >
                                VAK es un modelo neuropsicológico que identifica cómo procesa información cada persona de manera única.
                            </motion.p>
                            
                            <ul className="space-y-4 mb-6">
                                <motion.li 
                                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
                                    whileHover={{ x: 5, scale: 1.02 }}
                                    className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#004B63]/30 transition-all duration-500"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_6s_ease-in-out_infinite]" />
                                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                            <i className="fa-solid fa-eye text-white text-2xl group-hover:text-3xl group-hover:animate-[pulse_2s_ease-in-out_infinite] transition-all duration-500" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    <div className="pt-1 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Visual:</span>
                                            <div className="w-1.5 h-1.5 bg-[#4DA8C4] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                            Aprende mejor con imágenes, gráficos y contenido visual organizado
                                        </p>
                                    </div>
                                </motion.li>
                                
                                <motion.li 
                                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                                    whileHover={{ x: 5, scale: 1.02 }}
                                    className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#2D7A94]/30 transition-all duration-500"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_7s_ease-in_out_infinite]" style={{ animationDelay: '0.5s' }} />
                                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                            <i className="fa-solid fa-ear-listen text-white text-2xl group-hover:text-3xl group-hover:animate-[bounce_2s_ease-in-out_infinite] transition-all duration-500" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    <div className="pt-1 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Auditivo:</span>
                                            <div className="w-1.5 h-1.5 bg-[#66CCCC] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.3s' }} />
                                        </div>
                                        <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                            Aprende mejor con sonidos, explicaciones verbales y discusiones
                                        </p>
                                    </div>
                                </motion.li>
                                
                                <motion.li 
                                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
                                    whileHover={{ x: 5, scale: 1.02 }}
                                    className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#0B2A3A]/30 transition-all duration-500"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#B2D8E5] to-[#66CCCC] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
                                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                            <i className="fa-solid fa-hand text-white text-2xl group-hover:text-3xl group-hover:animate-[shake_2s_ease-in-out_infinite] transition-all duration-500" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    <div className="pt-1 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Kinestésico:</span>
                                            <div className="w-1.5 h-1.5 bg-[#B2D8E5] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.6s' }} />
                                        </div>
                                        <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                            Aprende mejor con experiencias prácticas, movimiento y manipulación
                                        </p>
                                    </div>
                                </motion.li>
                            </ul>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                                className="pt-6 mt-6 border-t border-[#004B63]/20"
                            >
                                <div className="relative p-4 rounded-xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-lg border border-white/30 shadow-premium-lg">
                                    <div className="absolute top-2 left-3 text-3xl text-[#4DA8C4]/30 font-serif">"</div>
                                    <div className="absolute bottom-2 right-3 text-3xl text-[#66CCCC]/30 font-serif">"</div>
                                    
                                    <p className="text-sm italic text-center font-medium text-[#0B2A3A] leading-relaxed px-4">
                                        <span className="font-semibold text-[#004B63]">Conocer tu estilo VAK</span> te permite estudiar de forma más eficiente y personalizada, optimizando tu proceso de aprendizaje.
                                    </p>
                                    
                                    <div className="flex justify-center gap-2 mt-3">
                                        <div className="w-1.5 h-1.5 bg-[#4DA8C4] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                                        <div className="w-1.5 h-1.5 bg-[#66CCCC] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 bg-[#B2D8E5] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
