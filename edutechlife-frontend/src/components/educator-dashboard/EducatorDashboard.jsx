import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";

const StudentCard = ({ student, onSelect }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer"
    whileHover={{ y: -4 }}
    onClick={onSelect}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
        {student.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {student.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {student.grade}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Racha</span>
        <span className="font-bold text-orange-600">{student.streak} días</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Progreso</span>
        <span className="font-bold text-blue-600">{student.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${student.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>

    {student.needsAttention && (
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-semibold text-amber-600">
          Requiere atención
        </span>
      </div>
    )}
  </motion.div>
);

const ClassOverview = ({ classData }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Resumen de Clase
    </h3>

    <div className="grid md:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Estudiantes
          </p>
        </div>
        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
          {classData.totalStudents}
        </p>
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-600 dark:text-green-400">Activos</p>
        </div>
        <p className="text-3xl font-bold text-green-900 dark:text-green-100">
          {classData.activeStudents}
        </p>
      </div>

      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Promedio
          </p>
        </div>
        <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
          {classData.averageProgress}%
        </p>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-600 dark:text-amber-400">Atención</p>
        </div>
        <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
          {classData.needingAttention}
        </p>
      </div>
    </div>
  </motion.div>
);

const EducatorDashboard = memo(() => {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classData = {
    totalStudents: 28,
    activeStudents: 25,
    averageProgress: 76,
    needingAttention: 3,
  };

  const students = [
    {
      id: 1,
      name: "Juan Martínez",
      grade: "6to Grado",
      streak: 12,
      progress: 94,
      needsAttention: false,
    },
    {
      id: 2,
      name: "María García",
      grade: "6to Grado",
      streak: 8,
      progress: 87,
      needsAttention: false,
    },
    {
      id: 3,
      name: "Carlos López",
      grade: "6to Grado",
      streak: 2,
      progress: 42,
      needsAttention: true,
    },
    {
      id: 4,
      name: "Sofia Rodríguez",
      grade: "6to Grado",
      streak: 7,
      progress: 79,
      needsAttention: false,
    },
    {
      id: 5,
      name: "Lucas Fernández",
      grade: "6to Grado",
      streak: 0,
      progress: 35,
      needsAttention: true,
    },
    {
      id: 6,
      name: "Emma Sánchez",
      grade: "6to Grado",
      streak: 14,
      progress: 98,
      needsAttention: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Dashboard del Educador</h1>
          <p className="text-purple-100">Monitorea el progreso de tu clase</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Class Overview */}
        <ClassOverview classData={classData} />

        {/* Students Grid */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Estudiantes ({students.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onSelect={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div
          className="mt-12 grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Top Performers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top 3 Estudiantes
            </h4>
            <div className="space-y-3">
              {[
                { name: "Emma Sánchez", score: 98 },
                { name: "Juan Martínez", score: 94 },
                { name: "María García", score: 87 },
              ].map((student, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {idx + 1}. {student.name}
                  </span>
                  <span className="font-bold text-green-600">
                    {student.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Requieren Atención
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "Carlos López",
                  reason: "Bajo progreso",
                  action: "Contactar",
                },
                {
                  name: "Lucas Fernández",
                  reason: "Sin actividad",
                  action: "Revisar",
                },
              ].map((student, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800"
                >
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {student.name}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {student.reason}
                  </p>
                  <button className="mt-2 text-sm font-bold text-amber-600 hover:text-amber-700">
                    {student.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-2">Recursos para Educadores</h3>
          <p className="text-purple-100 mb-6">
            Accede a guías, planes de lección y reportes detallados
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
          >
            Explorar Recursos
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
});

EducatorDashboard.displayName = "EducatorDashboard";

export default EducatorDashboard;
