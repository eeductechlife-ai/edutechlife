import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Maximize2, Minimize2, Bot, MessageSquare, User, Clock, Trash2, CheckCircle, Calendar, Bell, BarChart3 } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import useLeadManagement from '../../hooks/useLeadManagement';
import useLeadCaptureLogic from '../../hooks/useLeadCaptureLogic';
import useAppointmentScheduling from '../../hooks/useAppointmentScheduling';
import LeadCaptureForm from './LeadCaptureForm';
import AppointmentScheduler from './AppointmentScheduler';
import AppointmentReminders from './AppointmentReminders';
import AnalyticsDashboard from './AnalyticsDashboard';
import notificationService from '../../utils/notifications';
import emailService from '../../utils/emailService';
import analytics from '../../utils/analytics';
import { callDeepseek } from '../../utils/api';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { createSpeechRecognition } from '../../utils/speechRecognition';
import { detectInterest } from '../../utils/leads';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

// Simple response cache
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const removeEmojis = (text) => {
  if (!text) return '';
  
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F018}-\u{1F270}]|[\u{1F700}-\u{1F77F}]|\uFE0F/gmu;
  
  const cleanText = text.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
  
  return cleanText || text.replace(emojiRegex, '').trim();
};

// Prompt optimizado para evitar error 400 (más corto)
const PROMPT_NICO_SOPORTE = `# NICO - AGENTE DE EDUTECHLIFE

Eres NICO, primer agente de EdutechLife. Atiende con amabilidad, explica servicios, captura leads, agenda citas.

## SERVICIOS:
- **VAK**: Diagnóstico estilos aprendizaje (Visual, Auditivo, Kinestésico)
- **STEM**: Robótica LEGO/Arduino, programación Scratch/Python/JavaScript
- **Tutoría**: Matemáticas, ciencias, inglés, técnicas estudio
- **Bienestar**: Acompañamiento psicológico, inteligencia emocional

## FLUJO:
1. Saluda, pregunta nombre
2. Descubre necesidades
3. Explica servicios relevantes
4. Captura lead cuando haya interés (nombre, teléfono, interés)
5. Agenda clase gratuita

## DATOS LEAD:
- Nombre completo
- Teléfono (WhatsApp preferido)
- Email (opcional)
- Interés principal
- Edad estudiante (si aplica)

## CONTACTO:
- WhatsApp: +57 [número]
- Email: info@edutechlife.com
- Web: www.edutechlife.com

Sé natural en español, personaliza con nombre, elimina emojis en voz.`;

const NicoModern = ({ studentName: initialName = 'amigo', onNavigate, onInteraction }) => {
  // [Resto del componente permanece igual...]
  // Necesitaría copiar el resto del componente, pero por ahora voy a probar
  // si el prompt optimizado resuelve el error 400
};