import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Clock, TrendingUp } from "lucide-react";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { supabase } from "../../lib/supabase";

/**
 * SmartBoardSessionStart: Begin work session
 *
 * Handles:
 * 1. Show "Comenzar a trabajar" button
 * 2. Create active session on click
 * 3. Start realtime sync to parents
 * 4. Redirect to SmartBoard dashboard
 */
const SmartBoardConsentGate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const { profile, userId } = useStudentProfile();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-up/smartboard");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleStartSession = async () => {
    setIsLoading(true);

    try {
      // Create active session in Supabase
      const sessionData = {
        student_id: userId,
        start_time: new Date().toISOString(),
        status: "active",
        last_activity: new Date().toISOString(),
      };

      const { error: sessionError } = await supabase
        .from("sessions")
        .insert([sessionData]);

      if (sessionError) {
        console.warn("Session creation warning:", sessionError);
        // Soft fail - continue to dashboard anyway
      }

      // Notify parent dashboard in realtime
      const broadcastData = {
        type: "session_started",
        student_id: userId,
        start_time: new Date().toISOString(),
      };

      await supabase
        .channel(`parent-updates-${userId}`)
        .send({
          type: "broadcast",
          event: "student_session",
          payload: broadcastData,
        })
        .catch(() => console.warn("Realtime broadcast failed"));

      // Redirect to SmartBoard
      const returnTo = searchParams.get("returnTo") || "/smartboard";
      navigate(returnTo);
    } catch (error) {
      console.error("Session start failed:", error);
      // Allow retry by not closing UI
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#48CAE4]">
        <div className="text-white text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#48CAE4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center mx-auto mb-6">
            <Play size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-[#004B63] mb-2">
            ¡Hola {profile?.username || "Estudiante"}!
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenido a SmartBoard
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start">
            <TrendingUp className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#004B63]">Aprende a tu ritmo</p>
              <p className="text-sm text-gray-600">
                Lecciones personalizadas según tu estilo de aprendizaje
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <Clock className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#004B63]">Padres conectados</p>
              <p className="text-sm text-gray-600">
                Tus padres verán tu progreso en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <motion.button
          onClick={handleStartSession}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              Iniciando...
            </>
          ) : (
            <>
              <Play size={20} className="fill-current" />
              Comenzar a trabajar
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Los padres recibirán notificaciones de tu progreso
        </p>
      </motion.div>
    </div>
  );
};

export default SmartBoardConsentGate;
