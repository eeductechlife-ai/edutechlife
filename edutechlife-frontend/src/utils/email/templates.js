function t(locale, es, en) { return locale === 'en' ? en : es; }

const LOCALE_ES = 'es-CO';
const LOCALE_EN = 'en-US';

function getLocaleDateString(locale, date) {
  const loc = locale === 'en' ? LOCALE_EN : LOCALE_ES;
  return new Date(date).toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function getAppointmentConfirmationTemplate() {
  return (data, locale = 'es') => {
    const T = {
      headerTitle: t(locale, 'Cita Confirmada', 'Appointment Confirmed'),
      headerSub: t(locale, 'EdutechLife - Transformando educación', 'EdutechLife - Transforming education'),
      greeting: t(locale, `Hola ${data.leadName},`, `Hello ${data.leadName},`),
      confirmed: t(locale, 'Tu cita con nuestro especialista ha sido confirmada exitosamente.', 'Your appointment with our specialist has been confirmed successfully.'),
      detailsTitle: t(locale, 'Detalles de tu cita:', 'Appointment Details:'),
      labelDate: t(locale, 'Fecha:', 'Date:'),
      labelTime: t(locale, 'Hora:', 'Time:'),
      labelDuration: t(locale, 'Duración:', 'Duration:'),
      labelModality: t(locale, 'Modalidad:', 'Modality:'),
      labelSpecialist: t(locale, 'Especialista:', 'Specialist:'),
      labelTopic: t(locale, 'Tema:', 'Topic:'),
      minutes: t(locale, 'minutos', 'minutes'),
      specialist: t(locale, 'Equipo EdutechLife', 'EdutechLife Team'),
      initialConsult: t(locale, 'Consulta inicial', 'Initial consultation'),
      videoCall: t(locale, 'Videollamada', 'Video call'),
      phoneCall: t(locale, 'Llamada telefónica', 'Phone call'),
      videoLink: t(locale, 'Enlace de videollamada:', 'Video call link:'),
      videoDetail: t(locale, 'Se enviará 15 minutos antes de la cita.', 'It will be sent 15 minutes before the appointment.'),
      phoneDetail: t(locale, 'Te llamaremos al número proporcionado.', 'We will call you at the provided number.'),
      prepTitle: t(locale, 'Preparación recomendada:', 'Recommended preparation:'),
      prep1: t(locale, 'Ten a mano cualquier pregunta específica que tengas', 'Have any specific questions ready'),
      prep2: t(locale, 'Prepara información relevante sobre tus necesidades', 'Prepare relevant information about your needs'),
      prep3V: t(locale, 'Busca un lugar tranquilo para la videollamada', 'Find a quiet place for the video call'),
      prep3P: t(locale, 'Busca un lugar tranquilo para la llamada', 'Find a quiet place for the call'),
      addCalendar: t(locale, 'Agregar a mi calendario', 'Add to my calendar'),
      reschedule: t(locale, 'Si necesitas reagendar o cancelar, por favor contáctanos con al menos 24 horas de anticipación.', 'If you need to reschedule or cancel, please contact us at least 24 hours in advance.'),
      footerInfo: t(locale, 'EdutechLife · Manizales, Colombia · info@edutechlife.com · +57 323 836 5517', 'EdutechLife · Manizales, Colombia · info@edutechlife.com · +57 323 836 5517'),
      footerAuto: t(locale, 'Este es un email automático, por favor no respondas a este mensaje.', 'This is an automated email, please do not reply to this message.'),
      call: t(locale, 'llamada', 'call'),
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${T.headerTitle} - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #004B63 0%, #4DA8C4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; border: 2px solid #B2D8E5; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #66CCCC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ ${T.headerTitle}</h1>
          <p>${T.headerSub}</p>
        </div>
        
        <div class="content">
          <h2>${T.greeting}</h2>
          <p>${T.confirmed}</p>
          
          <div class="appointment-details">
            <h3>📅 ${T.detailsTitle}</h3>
            <div class="detail-item"><span class="label">${T.labelDate}</span> ${getLocaleDateString(locale, data.date)}</div>
            <div class="detail-item"><span class="label">${T.labelTime}</span> ${data.time}</div>
            <div class="detail-item"><span class="label">${T.labelDuration}</span> ${data.duration} ${T.minutes}</div>
            <div class="detail-item"><span class="label">${T.labelModality}</span> ${data.modality === "videollamada" ? T.videoCall : T.phoneCall}</div>
            <div class="detail-item"><span class="label">${T.labelSpecialist}</span> ${T.specialist}</div>
            <div class="detail-item"><span class="label">${T.labelTopic}</span> ${data.topic || T.initialConsult}</div>
          </div>
          
          ${
            data.modality === "videollamada"
              ? `
          <p><strong>🔗 ${T.videoLink}</strong> ${T.videoDetail}</p>
          `
              : `
          <p><strong>📞 ${T.phoneDetail}</strong></p>
          `
          }
          
          <p><strong>📝 ${T.prepTitle}</strong></p>
          <ul>
            <li>${T.prep1}</li>
            <li>${T.prep2}</li>
            <li>${data.modality === "videollamada" ? T.prep3V : T.prep3P}</li>
          </ul>
          
          <p><a href="#" class="button">📅 ${T.addCalendar}</a></p>
          
          <p>${T.reschedule}</p>
          
          <div class="footer">
            <p>${T.footerInfo}</p>
            <p>${T.footerAuto}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
}

export function getAppointmentReminder24hTemplate() {
  return (data, locale = 'es') => {
    const T = {
      headerTitle: t(locale, 'Recordatorio: Cita Mañana', 'Reminder: Appointment Tomorrow'),
      headerSub: t(locale, 'EdutechLife - Tu cita está programada para mañana', 'EdutechLife - Your appointment is scheduled for tomorrow'),
      greeting: t(locale, `Hola ${data.leadName},`, `Hello ${data.leadName},`),
      reminder: t(locale, 'Este es un recordatorio amistoso de tu cita programada para <strong>mañana</strong>.', 'This is a friendly reminder of your appointment scheduled for <strong>tomorrow</strong>.'),
      boxTitle: t(locale, 'Tu cita es mañana:', 'Your appointment is tomorrow:'),
      labelDate: t(locale, 'Fecha:', 'Date:'),
      labelTime: t(locale, 'Hora:', 'Time:'),
      labelDuration: t(locale, 'Duración:', 'Duration:'),
      labelModality: t(locale, 'Modalidad:', 'Modality:'),
      minutes: t(locale, 'minutos', 'minutes'),
      videoCall: t(locale, 'Videollamada', 'Video call'),
      phoneCall: t(locale, 'Llamada telefónica', 'Phone call'),
      prepTitle: t(locale, 'Preparación:', 'Preparation:'),
      prep1V: t(locale, 'Verifica tu conexión a internet si es videollamada', 'Check your internet connection if it is a video call'),
      prep1: t(locale, 'Ten a mano tu identificación', 'Have your ID ready'),
      prep2: t(locale, 'Prepara tus preguntas y objetivos', 'Prepare your questions and goals'),
      videoLink: t(locale, 'El enlace de videollamada llegará 15 minutos antes de la cita.', 'The video call link will arrive 15 minutes before the appointment.'),
      phoneDetail: t(locale, 'Te llamaremos al número proporcionado 5 minutos antes.', 'We will call you at the provided number 5 minutes before.'),
      viewDetails: t(locale, 'Ver detalles completos', 'View full details'),
      reschedule: t(locale, '¿Necesitas reagendar?', 'Need to reschedule?'),
      clickHere: t(locale, 'Haz clic aquí', 'Click here'),
      rescheduleNote: t(locale, '(con 24h de anticipación)', '(with 24h notice)'),
      footerInfo: t(locale, 'EdutechLife · Transformando educación, una conversación a la vez', 'EdutechLife · Transforming education, one conversation at a time'),
      footerAuto: t(locale, 'Este es un email automático de recordatorio.', 'This is an automated reminder email.'),
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${T.headerTitle} - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder-box { background: #fff8e1; border: 2px solid #ffd54f; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #4DA8C4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⏰ ${T.headerTitle}</h1>
          <p>${T.headerSub}</p>
        </div>
        
        <div class="content">
          <h2>${T.greeting}</h2>
          <p>${T.reminder}</p>
          
          <div class="reminder-box">
            <h3>📅 ${T.boxTitle}</h3>
            <div class="detail-item"><span class="label">${T.labelDate}</span> ${getLocaleDateString(locale, data.date)}</div>
            <div class="detail-item"><span class="label">${T.labelTime}</span> ${data.time}</div>
            <div class="detail-item"><span class="label">${T.labelDuration}</span> ${data.duration} ${T.minutes}</div>
            <div class="detail-item"><span class="label">${T.labelModality}</span> ${data.modality === "videollamada" ? T.videoCall : T.phoneCall}</div>
          </div>
          
          <p><strong>🎯 ${T.prepTitle}</strong></p>
          <ul>
            <li>${data.modality === "videollamada" ? T.prep1V : T.prep1}</li>
            <li>${T.prep2}</li>
          </ul>
          
          ${
            data.modality === "videollamada"
              ? `
          <p><strong>🔗 ${T.videoLink}</strong></p>
          `
              : `
          <p><strong>📞 ${T.phoneDetail}</strong></p>
          `
          }
          
          <p><a href="#" class="button">📅 ${T.viewDetails}</a></p>
          
          <p>${T.reschedule} <a href="#">${T.clickHere}</a> ${T.rescheduleNote}</p>
          
          <div class="footer">
            <p>${T.footerInfo}</p>
            <p>${T.footerAuto}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
}

export function getAppointmentReminder1hTemplate() {
  return (data, locale = 'es') => {
    const T = {
      headerTitle: t(locale, '¡Tu cita es en 1 hora!', 'Your appointment is in 1 hour!'),
      headerSub: t(locale, 'EdutechLife - Prepárate para conectar', 'EdutechLife - Get ready to connect'),
      greeting: t(locale, `Hola ${data.leadName},`, `Hello ${data.leadName},`),
      startsIn1h: t(locale, 'Tu cita con nuestro especialista de EdutechLife comienza <strong>en 1 hora</strong>.', 'Your appointment with our EdutechLife specialist starts <strong>in 1 hour</strong>.'),
      boxTitle: t(locale, `Comienza a las ${data.time}:`, `Starts at ${data.time}:`),
      labelStartTime: t(locale, 'Hora de inicio:', 'Start time:'),
      labelDuration: t(locale, 'Duración:', 'Duration:'),
      labelModality: t(locale, 'Modalidad:', 'Modality:'),
      minutes: t(locale, 'minutos', 'minutes'),
      videoCall: t(locale, 'Videollamada', 'Video call'),
      phoneCall: t(locale, 'Llamada telefónica', 'Phone call'),
      prepTitle: t(locale, 'Últimos preparativos:', 'Final preparations:'),
      prep1: t(locale, 'Busca un lugar tranquilo y sin distracciones', 'Find a quiet place without distractions'),
      prep2: t(locale, 'Verifica tu equipo (micrófono, cámara, auriculares)', 'Check your equipment (microphone, camera, headphones)'),
      prep3: t(locale, 'Ten a mano lápiz y papel para notas', 'Have pen and paper ready for notes'),
      prep4: t(locale, 'Prepara tu identificación si es necesario', 'Prepare your ID if necessary'),
      videoLinkTitle: t(locale, 'Enlace de videollamada:', 'Video call link:'),
      joinCall: t(locale, 'Unirse a la videollamada', 'Join video call'),
      incomingCall: t(locale, 'Llamada entrante:', 'Incoming call:'),
      callDetail: t(locale, 'Recibirás una llamada del número +57 323 836 5517', 'You will receive a call from +57 323 836 5517'),
      keepPhone: t(locale, 'Por favor mantén tu teléfono disponible y con señal.', 'Please keep your phone available and with signal.'),
      troubleConnect: t(locale, 'Si tienes problemas para conectarte, contáctanos inmediatamente por WhatsApp.', 'If you have trouble connecting, contact us immediately via WhatsApp.'),
      footerExcited: t(locale, '¡Estamos emocionados de conocerte! El equipo EdutechLife', 'We are excited to meet you! The EdutechLife team'),
      footerAuto: t(locale, 'Este es un recordatorio automático enviado 1 hora antes de tu cita.', 'This is an automated reminder sent 1 hour before your appointment.'),
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${T.headerTitle} - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #66CCCC 0%, #B2D8E5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent-box { background: #e3f2fd; border: 2px solid #4DA8C4; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #66CCCC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 ${T.headerTitle}</h1>
          <p>${T.headerSub}</p>
        </div>
        
        <div class="content">
          <h2>${T.greeting}</h2>
          <p>${T.startsIn1h}</p>
          
          <div class="urgent-box">
            <h3>⏰ ${T.boxTitle}</h3>
            <div class="detail-item"><span class="label">${T.labelStartTime}</span> ${data.time}</div>
            <div class="detail-item"><span class="label">${T.labelDuration}</span> ${data.duration} ${T.minutes}</div>
            <div class="detail-item"><span class="label">${T.labelModality}</span> ${data.modality === "videollamada" ? T.videoCall : T.phoneCall}</div>
          </div>
          
          <p><strong>🚀 ${T.prepTitle}</strong></p>
          <ul>
            <li>${T.prep1}</li>
            <li>${T.prep2}</li>
            <li>${T.prep3}</li>
            <li>${T.prep4}</li>
          </ul>
          
          ${
            data.modality === "videollamada"
              ? `
          <p><strong>🔗 ${T.videoLinkTitle}</strong> https://meet.edutechlife.com/${data.appointmentId}</p>
          <p><a href="https://meet.edutechlife.com/${data.appointmentId}" class="button">🎥 ${T.joinCall}</a></p>
          `
              : `
          <p><strong>📞 ${T.incomingCall}</strong> ${T.callDetail}</p>
          <p>${T.keepPhone}</p>
          `
          }
          
          <p>${T.troubleConnect}</p>
          
          <div class="footer">
            <p>${T.footerExcited}</p>
            <p>${T.footerAuto}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
}

export function getLeadWelcomeTemplate() {
  return (data, locale = 'es') => {
    const T = {
      headerTitle: t(locale, 'Bienvenido a EdutechLife', 'Welcome to EdutechLife'),
      headerSub: t(locale, 'Transformando educación con tecnología e innovación', 'Transforming education with technology and innovation'),
      greeting: t(locale, `Hola ${data.nombre},`, `Hello ${data.nombre},`),
      thanks: t(locale, '¡Gracias por tu interés en EdutechLife! Estamos emocionados de tenerte con nosotros.', 'Thank you for your interest in EdutechLife! We are excited to have you with us.'),
      boxTitle: t(locale, 'Hemos registrado tu interés en:', 'We have registered your interest in:'),
      defaultInterest: t(locale, 'Nuestros servicios educativos', 'Our educational services'),
      advisorWillContact: t(locale, 'Un asesor especializado se contactará contigo pronto para personalizar una solución para tus necesidades.', 'A specialized advisor will contact you soon to personalize a solution for your needs.'),
      servicesTitle: t(locale, 'Nuestros servicios:', 'Our services:'),
      serviceVakTitle: t(locale, 'Diagnóstico VAK', 'VAK Diagnosis'),
      serviceVakDesc: t(locale, 'Identifica tu estilo de aprendizaje preferido', 'Identify your preferred learning style'),
      serviceStemTitle: t(locale, 'Programación STEM', 'STEM Programming'),
      serviceStemDesc: t(locale, 'Robótica, coding y ciencias para todas las edades', 'Robotics, coding and sciences for all ages'),
      serviceTutoringTitle: t(locale, 'Tutoría académica', 'Academic Tutoring'),
      serviceTutoringDesc: t(locale, 'Refuerzo en matemáticas, ciencias e inglés', 'Reinforcement in math, science and English'),
      serviceWellnessTitle: t(locale, 'Bienestar emocional', 'Emotional Wellness'),
      serviceWellnessDesc: t(locale, 'Acompañamiento psicológico y desarrollo emocional', 'Psychological support and emotional development'),
      nextStepsTitle: t(locale, 'Próximos pasos:', 'Next steps:'),
      step1: t(locale, 'Un asesor se contactará en las próximas 24 horas', 'An advisor will contact you within 24 hours'),
      step2: t(locale, 'Coordinarán una clase gratuita de prueba', 'They will coordinate a free trial class'),
      step3: t(locale, 'Recibirás un plan personalizado basado en tus necesidades', 'You will receive a personalized plan based on your needs'),
      accessAccount: t(locale, 'Acceder a mi cuenta', 'Access my account'),
      contactTitle: t(locale, 'Contacto inmediato:', 'Immediate contact:'),
      footerInfo: t(locale, 'EdutechLife · Centro de Innovación Educativa · Manizales, Colombia', 'EdutechLife · Educational Innovation Center · Manizales, Colombia'),
      footerAuto: t(locale, 'Este es un email automático de bienvenida.', 'This is an automated welcome email.'),
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${T.headerTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0A1628 0%, #004B63 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-box { background: white; border: 2px solid #66CCCC; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .services { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .service-item { background: #f0f9ff; padding: 15px; border-radius: 5px; }
          .button { display: inline-block; background: #004B63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 ${T.headerTitle}</h1>
          <p>${T.headerSub}</p>
        </div>
        
        <div class="content">
          <h2>${T.greeting}</h2>
          <p>${T.thanks}</p>
          
          <div class="welcome-box">
            <h3>📋 ${T.boxTitle}</h3>
            <p><strong>${data.interes || T.defaultInterest}</strong></p>
            <p>${T.advisorWillContact}</p>
          </div>
          
          <h3>🎯 ${T.servicesTitle}</h3>
          <div class="services">
            <div class="service-item">
              <strong>🧠 ${T.serviceVakTitle}</strong>
              <p>${T.serviceVakDesc}</p>
            </div>
            <div class="service-item">
              <strong>🤖 ${T.serviceStemTitle}</strong>
              <p>${T.serviceStemDesc}</p>
            </div>
            <div class="service-item">
              <strong>📚 ${T.serviceTutoringTitle}</strong>
              <p>${T.serviceTutoringDesc}</p>
            </div>
            <div class="service-item">
              <strong>💖 ${T.serviceWellnessTitle}</strong>
              <p>${T.serviceWellnessDesc}</p>
            </div>
          </div>
          
          <p><strong>🚀 ${T.nextStepsTitle}</strong></p>
          <ol>
            <li>${T.step1}</li>
            <li>${T.step2}</li>
            <li>${T.step3}</li>
          </ol>
          
          <p><a href="https://edutechlife.com/mi-cuenta" class="button">👤 ${T.accessAccount}</a></p>
          
          <p><strong>📞 ${T.contactTitle}</strong><br>
          WhatsApp: +57 323 836 5517<br>
          Email: info@edutechlife.com<br>
          Sitio web: www.edutechlife.com</p>
          
          <div class="footer">
            <p>${T.footerInfo}</p>
            <p>${T.footerAuto}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
}
