import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Icon } from '../../../utils/iconMapping.jsx'
import { useTranslation } from '../../../i18n/I18nProvider'
import { OVA_CATALOG, MODULE_NAMES } from './ovaData'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

OVACard.propTypes = {
  ova: PropTypes.object.isRequired,
  moduleColor: PropTypes.string.isRequired,
}

function OVACard({ ova, moduleColor }) {
  const { t } = useTranslation()
  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      style={{ borderLeftColor: moduleColor }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center shrink-0">
            <Icon name={ova.icon} className="w-6 h-6 text-petroleum" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight mb-1">
              {ova.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {ova.description}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Icon name="fa-clock" className="w-3.5 h-3.5" />
            <span>{ova.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-corporate opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{t('ialab.ova_thumbnail.explore') || 'Explorar'}</span>
            <Icon name="fa-arrow-right" className="w-3 h-3" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-petroleum/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

const MODULE_COLORS = {
  1: '#004B63',
  2: '#4361EE',
  3: '#10B981',
  4: '#F59E0B',
  5: '#EF4444',
}

ModuleSection.propTypes = {
  moduleNum: PropTypes.number,
  ovas: PropTypes.array,
  color: PropTypes.string.isRequired,
}

function ModuleSection({ moduleNum, ovas, color }) {
  const { locale } = useTranslation()
  const name = MODULE_NAMES[moduleNum]?.[locale] || MODULE_NAMES[moduleNum]?.es || `Módulo ${moduleNum}`
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-1 h-8 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-lg font-black text-petroleum dark:text-white tracking-tight">
          {name}
        </h3>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full ml-auto">
          {ovas.length} {ovas.length === 1 ? 'OVA' : 'OVAs'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ovas.map((ova) => (
          <OVACard key={ova.id} ova={ova} moduleColor={color} />
        ))}
      </div>
    </div>
  )
}

OVAHub.propTypes = {}

export default function OVAHub() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const filtered = search.trim()
      ? OVA_CATALOG.filter(
          (ova) =>
            ova.title.toLowerCase().includes(search.toLowerCase()) ||
            ova.description.toLowerCase().includes(search.toLowerCase())
        )
      : OVA_CATALOG

    const map = {}
    for (const ova of filtered) {
      if (!map[ova.module]) map[ova.module] = []
      map[ova.module].push(ova)
    }
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b))
  }, [search])

  const totalOVAs = OVA_CATALOG.length
  const totalModules = 5
  const totalDuration = OVA_CATALOG.reduce((acc, ova) => {
    const min = parseInt(ova.duration, 10)
    return acc + (isNaN(min) ? 15 : min)
  }, 0)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-md">
            <Icon name="fa-brain" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-petroleum dark:text-white tracking-tight">
            {t('ialab.ova_hub.title') || 'Centro de OVAs'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-[52px]">
          {t('ialab.ova_hub.subtitle') || `${totalOVAs} experiencias interactivas en ${totalModules} módulos · ~${totalDuration} min total`}
        </p>
      </motion.div>

      <div className="relative mb-8">
        <Icon name="fa-search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('ialab.ova_hub.search_placeholder') || 'Buscar OVA por nombre o descripción...'}
          aria-label={t('ialab.ova_hub.search_placeholder') || 'Buscar OVA por nombre o descripción...'}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/30 focus:border-corporate transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label={t('ialab.ova_hub.clear_search') || 'Limpiar búsqueda'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="fa-xmark" className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </button>
        )}
      </div>

      {grouped.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Icon name="fa-search" className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-500 dark:text-slate-400">
            {t('ialab.ova_hub.no_results') || 'Ninguna OVA coincide con tu búsqueda'}
          </p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 text-sm font-bold text-corporate hover:underline"
          >
            {t('ialab.ova_hub.clear_search') || 'Limpiar búsqueda'}
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {grouped.map(([moduleNum, ovas]) => (
            <ModuleSection
              key={moduleNum}
              moduleNum={Number(moduleNum)}
              ovas={ovas}
              color={MODULE_COLORS[moduleNum] || '#004B63'}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}