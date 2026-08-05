import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Flame,
  Award,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    whileHover={{ y: -4 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <p
            className={`text-sm font-semibold mt-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% esta semana
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const ActivityCard = ({ date, activity, status }) => (
  <motion.div
    className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    whileHover={{ x: 4 }}
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === "completed"
          ? "bg-green-100 dark:bg-green-900"
          : "bg-blue-100 dark:bg-blue-900"
      }`}
    >
      {status === "completed" ? (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      ) : (
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      )}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900 dark:text-white">{activity}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{date}</p>
    </div>
  </motion.div>
);

const ParentDashboard = memo(() => {
  const { t } = useTranslation();
  const [studentName] = useState("Juan");
  const [stats] = useState({
    streak: 7,
    totalPoints: 2840,
    lessonsCompleted: 24,
    averageScore: 88,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Padres</h1>
          <p className="text-blue-100">
            Monitorea el progreso académico de {studentName}
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Flame}
            label="Racha Actual"
            value={`${stats.streak} días`}
            trend={25}
            color="bg-orange-500"
          />
          <StatCard
            icon={Award}
            label="Puntos Totales"
            value={stats.totalPoints}
            trend={15}
            color="bg-blue-500"
          />
          <StatCard
            icon={BookOpen}
            label="Lecciones Completadas"
            value={stats.lessonsCompleted}
            trend={8}
            color="bg-green-500"
          />
          <StatCard
            icon={Target}
            label="Promedio de Calificación"
            value={`${stats.averageScore}%`}
            trend={5}
            color="bg-purple-500"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Actividad Reciente
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <ActivityCard
                  date="Hoy a las 14:30"
                  activity="Completó lección de Matemáticas - Fracciones"
                  status="completed"
                />
                <ActivityCard
                  date="Ayer a las 16:45"
                  activity="Completó 10 flashcards de Biología"
                  status="completed"
                />
                <ActivityCard
                  date="Hace 2 días"
                  activity="Inició examen de práctica de Español"
                  status="in-progress"
                />
                <ActivityCard
                  date="Hace 3 días"
                  activity="Alcanzó 7 días de racha"
                  status="completed"
                />
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recomendaciones
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Progreso Excelente
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {studentName} mantiene una racha de 7 días. ¡Sigue así!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100">
                        Área de Mejora
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Considere más práctica en Ciencias Naturales
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Próximo Hito
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        A 150 puntos de desbloquear recompensa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Summary */}
        <motion.div
          className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Resumen de la Semana
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Horas de Estudio
              </p>
              <p className="text-4xl font-bold text-blue-600">8.5h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                +2h vs semana anterior
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Tareas Completadas
              </p>
              <p className="text-4xl font-bold text-green-600">12/15</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                80% de tareas asignadas
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Racha Actual
              </p>
              <p className="text-4xl font-bold text-orange-600">7 días</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mejor racha: 14 días
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact & Support */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-8 text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-2">
            ¿Preguntas sobre el progreso?
          </h3>
          <p className="text-blue-100 mb-6">
            Nuestro equipo de soporte está disponible para ayudarte
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
          >
            Contactar Soporte
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
});

ParentDashboard.displayName = "ParentDashboard";

export default ParentDashboard;
