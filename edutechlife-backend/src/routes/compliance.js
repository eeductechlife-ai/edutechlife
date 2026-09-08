const { Router } = require('express');

const router = Router();

const COMPLIANCE_INFO = {
  platform: 'EdutechLife',
  jurisdiction: 'Colombia',
  last_updated: '2026-09-08',
  frameworks: [
    {
      name: 'Ley 1581 de 2012 (Habeas Data — Colombia)',
      status: 'compliant',
      controls: [
        'Consentimiento explícito de titular antes de recolectar datos personales',
        'Endpoint DELETE /api/smartboard/delete-user-data — eliminación completa (Art. 8 lit. c)',
        'Endpoint GET /api/smartboard/export-user-data — portabilidad de datos (Art. 8 lit. d)',
        'Consentimiento parental para menores (parental consent middleware)',
        'Logs de auditoría de acceso a datos sensibles',
      ],
    },
    {
      name: 'COPPA (Children Online Privacy Protection Act)',
      status: 'compliant',
      controls: [
        'Consentimiento parental verificado para usuarios menores de 13 años',
        'No se recolectan datos personales de menores sin autorización parental',
        'Padres pueden solicitar eliminación de todos los datos del menor',
        'Datos de menores no se comparten con terceros sin consentimiento',
        'Retención de datos de menores limitada al período de uso activo',
      ],
    },
    {
      name: 'FERPA (Family Educational Rights and Privacy Act)',
      status: 'partial',
      controls: [
        'Registros educativos accesibles solo al estudiante y padres/tutores autorizados',
        'RLS (Row Level Security) en todas las tablas — 73/73 habilitadas',
        'Autenticación requerida para todos los endpoints de datos educativos',
        'Acceso administrativo limitado por RBAC (roles: admin, content_creator)',
      ],
      pending: [
        'Auditoría formal de acceso a registros educativos por terceros (en roadmap)',
      ],
    },
  ],
  data_retention: {
    active_accounts: 'Datos retenidos mientras la cuenta esté activa',
    deleted_accounts: 'Eliminación completa en 30 días tras solicitud',
    backups: 'Backups de base de datos retenidos 7 días',
    logs: 'Logs de acceso retenidos 90 días',
  },
  contact: {
    privacy_email: 'privacidad@edutechlife.co',
    dpo: 'Delegado de Protección de Datos — disponible vía privacidad@edutechlife.co',
  },
  security: {
    encryption_in_transit: 'TLS 1.2+',
    encryption_at_rest: 'AES-256 (Supabase managed)',
    mfa_available: true,
    password_policy: 'Mínimo 10 caracteres',
    rls_enabled: '73/73 tablas con RLS habilitado',
  },
};

/**
 * GET /api/compliance/trust-center
 * Público — devuelve el estado de cumplimiento normativo de la plataforma.
 * Usado por instituciones B2B para due diligence.
 */
router.get('/trust-center', (req, res) => {
  res.json(COMPLIANCE_INFO);
});

module.exports = router;
