import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { sanitize } from "../../utils/sanitize";
import { fadeInUp } from "./SmartBoardShared";

export default function SmartBoardQueEsSection({ t }) {
  return (
    <section
      id="que-es"
      className="relative w-full overflow-hidden bg-white py-12 lg:py-16 scroll-mt-20"
    >
      <div className="absolute top-[30%] right-[10%] w-48 h-48 bg-mint/8 rounded-full blur-[80px]" />
      <div className="absolute bottom-[20%] left-[5%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <motion.div {...fadeInUp} className="text-left">
              <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-mint/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
                {t("smartboard.landing_what_badge")}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
                {t("smartboard.landing_what_title_line1")}
                <br />
                <span className="text-gradient-accent pr-1">
                  {t("smartboard.landing_what_title_line2")}
                </span>
              </h2>
            </motion.div>
            <p
              className="text-sm sm:text-base text-slate-500 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitize(t("smartboard.landing_what_desc1")),
              }}
            />
            <p
              className="text-sm text-slate-500 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitize(t("smartboard.landing_what_desc2")),
              }}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                t("smartboard.landing_tag_adaptive_ai"),
                t("smartboard.landing_tag_real_coaches"),
                t("smartboard.landing_tag_scientific_vak"),
                t("smartboard.landing_tag_live_reports"),
              ].map((tag) => (
                <span
                  key={tag}
                  className="badge-clay px-4 py-2 rounded-full bg-petroleum/5 text-petroleum text-sm font-semibold border border-petroleum/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative group flex flex-col"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -4 }}
              style={{ willChange: "transform" }}
              className="rounded-2xl bg-petroleum/5 border border-petroleum/10 overflow-hidden relative shadow-2xl hover:shadow-[0_25px_50px_rgba(0,75,99,0.15)] transition-shadow duration-300"
            >
              <div className="aspect-video w-full bg-petroleum-dark/10 flex items-center justify-center">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                >
                  <source src="/smarboard.mp4" type="video/mp4" />
                  <source src="/smarboard.mov" type="video/quicktime" />
                </video>
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-xl border border-white/40 text-[11px] font-bold text-petroleum flex items-center gap-1.5 pointer-events-none shadow-sm">
                <Icon name="fa-flask-vial" className="text-[10px]" /> SmartBoard
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-petroleum/80 backdrop-blur-xl border border-white/10 text-[11px] font-medium text-white/90 flex items-center gap-1.5 pointer-events-none">
                <Icon name="fa-play" className="text-[9px]" /> Video demo
              </div>
            </motion.div>
            <div className="mt-4 card-clay-white bg-white rounded-xl shadow-premium border border-petroleum/10 p-3 self-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Icon
                    name="fa-check-circle"
                    className="text-success text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-petroleum">
                    {t("smartboard.landing_kids_count")}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t("smartboard.landing_kids_learning")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
