import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "../utils/iconMapping.jsx";
import FloatingParticles from "./FloatingParticles";
import { useTranslation } from "../i18n/I18nProvider";

function AIToolsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [isHoveredSmartboard, setIsHoveredSmartboard] = useState(false);
  const [isVideoErrorSmartboard, setIsVideoErrorSmartboard] = useState(false);
  const videoRefSmartboard = useRef(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleMouseEnterSmartboard = useCallback(() => {
    setIsVideoErrorSmartboard(false);
    setIsHoveredSmartboard(true);
  }, []);
  const handleMouseLeaveSmartboard = useCallback(
    () => setIsHoveredSmartboard(false),
    [],
  );

  const showVideo = isDesktop && isHovered && !isVideoError;
  const showVideoSmartboard =
    isDesktop && isHoveredSmartboard && !isVideoErrorSmartboard;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showVideo) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [showVideo]);

  useEffect(() => {
    const video = videoRefSmartboard.current;
    if (!video) return;
    if (showVideoSmartboard) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [showVideoSmartboard]);

  const tools = [
    {
      id: "ai-lab-academic",
      name: t("ai_tools.card_1_name"),
      subtitle: "ACADEMIC",
      path: "/ialab-academic",
      icon: "fa-rocket",
      description: t("ai_tools.card_1_desc"),
      badges: ["ACADEMIC", "CERTIFIED"],
      buttonText: t("ai_tools.card_1_button"),
      variant: "main-dark",
    },
    {
      id: "automation",
      name: t("ai_tools.card_2_name"),
      subtitle: t("ai_tools.card_2_subtitle"),
      path: "/automation",
      icon: "fa-robot",
      description: t("ai_tools.card_2_desc"),
      features: [
        t("ai_tools.card_2_feature_1"),
        t("ai_tools.card_2_feature_2"),
        t("ai_tools.card_2_feature_3"),
      ],
      buttonText: t("ai_tools.card_2_button"),
      variant: "white-card",
    },
    {
      id: "vak",
      name: t("ai_tools.card_3_name"),
      subtitle: t("ai_tools.card_3_subtitle"),
      path: "/vak",
      icon: "fa-brain",
      description: t("ai_tools.card_3_desc"),
      buttonText: t("ai_tools.card_3_button"),
      variant: "white-card-vak",
    },
    {
      id: "smartboard",
      name: t("ai_tools.card_4_name"),
      subtitle: t("ai_tools.card_4_subtitle"),
      path: "/conoce-smartboard",
      icon: "fa-chalkboard",
      description: t("ai_tools.card_4_desc"),
      buttonText: t("ai_tools.card_4_button"),
      variant: "horizontal",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="herramientas"
      className="py-20 px-4 md:px-6 bg-white relative overflow-hidden"
    >
      <div id="ai-lab-academic" className="absolute -top-24" />
      <FloatingParticles count={8} className="z-0 opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-left mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-3">
              {t("ai_tools.title_before")}{" "}
              <span className="text-gradient-accent pr-1">
                {t("ai_tools.title_highlight")}
              </span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl font-medium">
              {t("ai_tools.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Card 1: AI Lab Academic (Main Dark) — hover overlays video */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
            role="button"
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            className="col-span-1 md:col-span-2 rounded-2xl bg-gradient-to-b from-[#004B63] to-[#003545] p-[1px] relative overflow-hidden cursor-pointer shadow-lg group"
          >
            <div className="rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-[#003d52] to-[#002a38] p-8 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-cyan-400/15 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={tools[0].icon}
                    className="text-2xl text-cyan-300"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-cyan-300">
                    {tools[0].name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tools[0].badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 rounded-full bg-cyan-400/20 text-[11px] text-cyan-200 font-bold uppercase tracking-wider border border-cyan-400/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-100 max-w-xl text-base md:text-lg leading-relaxed font-normal">
                {tools[0].description}
              </p>
              <div className="mt-auto pt-6">
                <a
                  href={tools[0].path}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(tools[0].path);
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#002a38] text-sm font-bold hover:from-cyan-300 hover:to-cyan-200 transition-all duration-300 shadow-lg active:scale-[0.97]"
                >
                  {tools[0].buttonText}
                  <span className="w-6 h-6 rounded-full bg-[#002a38]/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <Icon
                      name="fa-arrow-right"
                      className="text-xs text-[#002a38]"
                    />
                  </span>
                </a>
              </div>
            </div>

            <AnimatePresence>
              {showVideo && (
                <motion.div
                  key="video"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setIsVideoError(true)}
                    className="w-full h-full object-cover"
                  >
                    <source src="/dashboard.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003d52]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center">
                    <a
                      href={tools[0].path}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(tools[0].path);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#002a38]/80 backdrop-blur-sm text-cyan-200 text-sm font-semibold hover:bg-cyan-400 hover:text-[#002a38] transition-all border border-cyan-400/30"
                    >
                      {tools[0].buttonText}
                      <Icon name="fa-arrow-right" className="text-xs" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Card 2: Automatización */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 card-clay-white p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary-light/10 flex items-center justify-center mb-5">
                <Icon
                  name={tools[1].icon}
                  className="text-2xl text-primary-light"
                />
              </div>
              <h3 className="text-xl font-black text-petroleum mb-2">
                {tools[1].name}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {tools[1].description}
              </p>
              <div className="space-y-2">
                {tools[1].features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <Icon
                      name="fa-check-circle"
                      className="text-primary-light text-xs flex-shrink-0"
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-1">
              <a
                href={tools[1].path}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(tools[1].path);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-petroleum/20 text-petroleum text-sm font-semibold hover:bg-petroleum hover:text-white transition-all"
              >
                {tools[1].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Diagnóstico VAK */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 card-clay-white p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary-light/10 flex items-center justify-center mb-5">
                <Icon
                  name={tools[2].icon}
                  className="text-2xl text-primary-light"
                />
              </div>
              <h3 className="text-xl font-black text-petroleum mb-1">
                {tools[2].name}
              </h3>
              <p className="text-xs text-primary-light font-semibold uppercase tracking-wider mb-3">
                {tools[2].subtitle}
              </p>
              <p className="text-slate-500 text-sm">{tools[2].description}</p>
            </div>
            <div className="mt-6 pt-1">
              <a
                href={tools[2].path}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(tools[2].path);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-petroleum text-white text-sm font-semibold hover:bg-primary-light transition-all"
              >
                {tools[2].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 4: SmartBoard (Horizontal) — hover overlays video */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={handleMouseEnterSmartboard}
            onMouseLeave={handleMouseLeaveSmartboard}
            tabIndex={0}
            role="button"
            onFocus={handleMouseEnterSmartboard}
            onBlur={handleMouseLeaveSmartboard}
            className="col-span-1 md:col-span-2 card-clay bg-primary-light/5 p-8 flex flex-col relative overflow-hidden cursor-pointer"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-primary-light/15 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={tools[3].icon}
                      className="text-2xl text-primary-light"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-black text-petroleum">
                      {tools[3].name}
                    </h3>
                    <p className="text-xs text-primary-light font-semibold uppercase tracking-wider">
                      {tools[3].subtitle}
                    </p>
                    <p className="text-petroleum/70 text-base mt-1.5">
                      {tools[3].description}
                    </p>
                  </div>
                </div>
                <a
                  href={tools[3].path}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(tools[3].path);
                  }}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-light text-white text-sm font-semibold hover:bg-petroleum transition-all"
                >
                  {tools[3].buttonText}
                  <Icon name="fa-arrow-right" className="text-xs" />
                </a>
              </div>
            </div>

            <AnimatePresence>
              {showVideoSmartboard && (
                <motion.div
                  key="video-smartboard"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <video
                    ref={videoRefSmartboard}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setIsVideoErrorSmartboard(true)}
                    className="w-full h-full object-cover"
                  >
                    <source src="/smarboard.mp4" type="video/mp4" />
                    <source src="/smarboard.mov" type="video/quicktime" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-petroleum/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center">
                    <a
                      href={tools[3].path}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(tools[3].path);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-petroleum/70 backdrop-blur-sm text-white text-sm font-semibold hover:bg-primary-light transition-colors border border-white/20"
                    >
                      {tools[3].buttonText}
                      <Icon name="fa-arrow-right" className="text-xs" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AIToolsSection;
