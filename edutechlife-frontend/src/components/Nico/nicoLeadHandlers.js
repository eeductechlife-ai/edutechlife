import { removeEmojis } from "./nicoTextUtils";
import { speakTextConversational } from "../../utils/speech";

function sendNewLeadNotification(leadData) {
  if (leadData.email) {
  }
}

async function sendAppointmentEmailConfirmation() {
  try {
  } catch (error) {
    console.error("Error en simulación de email:", error);
  }
}

export function createHandleSaveLead({
  saveLead,
  setMessages,
  setShowLeadSuccess,
  audioEnabled,
  setAudioPermissionError,
  messages,
}) {
  return async (leadData) => {
    try {
      const leadId = saveLead({
        nombre: leadData.nombreCompleto,
        telefono: leadData.telefono,
        email: leadData.email,
        motivo: leadData.interesPrincipal || "Inter\u00e9s general",
        messages: messages.slice(-10),
      });

      setShowLeadSuccess(true);

      setTimeout(() => {
        setShowLeadSuccess(false);
      }, 5000);

      sendNewLeadNotification(leadData);

      const successMessage = {
        role: "assistant",
        content: `Perfecto ${leadData.nombreCompleto.split(" ")[0]}, hemos registrado tu interes en ${leadData.interesPrincipal || "nuestros servicios"}.`,
        timestamp: new Date().toISOString(),
        isLeadSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

      setTimeout(() => {
        const appointmentQuestion = {
          role: "assistant",
          content: `\u00bfTe gustar\u00eda agendar una llamada gratuita con uno de nuestros especialistas para profundizar en ${leadData.interesPrincipal || "tus necesidades"}?`,
          timestamp: new Date().toISOString(),
          isAppointmentPrompt: true,
        };

        setMessages((prev) => [...prev, appointmentQuestion]);

        if (audioEnabled) {
          setTimeout(() => {
            speakTextConversational(
              removeEmojis(appointmentQuestion.content),
              "nico_premium",
              {},
              () => {},
              undefined,
            );
          }, 400);
        }
      }, 500);

      if (audioEnabled) {
        speakTextConversational(
          removeEmojis(successMessage.content),
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      const leadForScheduling = {
        id: leadId,
        ...leadData,
      };

      return leadForScheduling;
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content:
          "Hubo un error al guardar tu informacion. Por favor intenta de nuevo o contacta directamente por WhatsApp.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    }
  };
}

export function createHandleScheduleAppointment({
  scheduleAppointment,
  setMessages,
  setShowAppointmentSuccess,
  audioEnabled,
  setAudioPermissionError,
}) {
  return async (appointmentData) => {
    try {
      const appointment = scheduleAppointment(appointmentData);

      sendAppointmentEmailConfirmation(appointmentData);

      setShowAppointmentSuccess(true);

      setTimeout(() => {
        setShowAppointmentSuccess(false);
      }, 5000);

      const successMessage = {
        role: "assistant",
        content: `Excelente. Hemos agendado tu llamada para el ${new Date(appointmentData.date).toLocaleDateString("es-CO")} a las ${appointmentData.time}. Recibiras confirmacion por ${appointmentData.leadPhone ? "WhatsApp" : "email"}.`,
        timestamp: new Date().toISOString(),
        isAppointmentSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

      if (audioEnabled) {
        speakTextConversational(
          removeEmojis(successMessage.content),
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      return appointment;
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content:
          "Hubo un error al agendar la cita. Por favor intenta de nuevo o contacta directamente por WhatsApp.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    }
  };
}
