const crypto = require('crypto');
const {
  isPagosWompiEnabled,
  firmaIntegridad,
  verificarChecksumEvento,
  planDisponible,
  montoPlanEnCentavos,
} = require('../../services/wompi');

const sha256 = (texto) => crypto.createHash('sha256').update(texto).digest('hex');

describe('PAGOS_WOMPI (bandera)', () => {
  it('está apagada por defecto', () => {
    expect(isPagosWompiEnabled({})).toBe(false);
  });

  it('solo se enciende con el valor exacto "true"', () => {
    expect(isPagosWompiEnabled({ PAGOS_WOMPI: 'true' })).toBe(true);
    expect(isPagosWompiEnabled({ PAGOS_WOMPI: 'TRUE' })).toBe(false);
    expect(isPagosWompiEnabled({ PAGOS_WOMPI: '1' })).toBe(false);
    expect(isPagosWompiEnabled({ PAGOS_WOMPI: '' })).toBe(false);
  });
});

describe('firma de integridad', () => {
  const datos = {
    referencia: 'ING-1700000000-abc',
    montoEnCentavos: 4990000,
    moneda: 'COP',
    secretoIntegridad: 'test_integrity_secreto',
  };

  it('es SHA256 de referencia + centavos + moneda + secreto (TODO: confirmar en docs.wompi.co)', () => {
    expect(firmaIntegridad(datos)).toBe(
      sha256('ING-1700000000-abc' + '4990000' + 'COP' + 'test_integrity_secreto'),
    );
  });

  it('cambia si cambia el monto (no se puede cobrar otro precio con la misma firma)', () => {
    expect(firmaIntegridad({ ...datos, montoEnCentavos: 4990001 })).not.toBe(firmaIntegridad(datos));
  });

  it('se niega a firmar sin secreto de integridad', () => {
    expect(() => firmaIntegridad({ ...datos, secretoIntegridad: '' })).toThrow(/secreto/i);
  });
});

describe('verificación del webhook (checksum de eventos)', () => {
  const SECRETO = 'test_events_secreto';
  const construirEvento = (overrides = {}) => {
    const data = { transaction: { id: '1234-5678', status: 'APPROVED', amount_in_cents: 4990000 } };
    const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'];
    const timestamp = 1530291411;
    const base = properties.map((p) => p.split('.').reduce((o, k) => o[k], data)).join('') +
      String(timestamp) + SECRETO;
    return {
      event: 'transaction.updated',
      data,
      environment: 'test',
      signature: { properties, checksum: sha256(base).toUpperCase() },
      timestamp,
      ...overrides,
    };
  };

  it('acepta un evento con firma válida', () => {
    expect(verificarChecksumEvento(construirEvento(), SECRETO)).toBe(true);
  });

  it('rechaza si cambia el estado de la transacción', () => {
    const evento = construirEvento();
    evento.data.transaction.status = 'DECLINED';
    expect(verificarChecksumEvento(evento, SECRETO)).toBe(false);
  });

  it('rechaza si cambia el monto', () => {
    const evento = construirEvento();
    evento.data.transaction.amount_in_cents = 100;
    expect(verificarChecksumEvento(evento, SECRETO)).toBe(false);
  });

  it('rechaza con secreto de eventos incorrecto', () => {
    expect(verificarChecksumEvento(construirEvento(), 'otro_secreto')).toBe(false);
  });

  it('rechaza si falta la firma, el secreto o el timestamp', () => {
    expect(verificarChecksumEvento(construirEvento({ signature: undefined }), SECRETO)).toBe(false);
    expect(verificarChecksumEvento(construirEvento({ timestamp: undefined }), SECRETO)).toBe(false);
    expect(verificarChecksumEvento(construirEvento(), '')).toBe(false);
  });

  it('rechaza si una propiedad firmada no existe en el evento', () => {
    const evento = construirEvento();
    evento.signature.properties = ['transaction.id', 'transaction.inexistente'];
    expect(verificarChecksumEvento(evento, SECRETO)).toBe(false);
  });
});

describe('montos en centavos por plan', () => {
  it.each([
    ['smartboard_premium', 4990000],
    ['ingenia_base_anual', 44900000],
    ['ingenia_segundo_hijo', 2490000],
    ['ingenia_fundador', 3990000],
    ['ingenia_acompanamiento', 14900000],
    ['ingenia_intensivo', 24900000],
  ])('%s cobra %i centavos de COP', (planId, centavos) => {
    expect(montoPlanEnCentavos(planId)).toBe(centavos);
  });

  it('no devuelve monto para planes gratuitos, en USD o a medida', () => {
    expect(montoPlanEnCentavos('free')).toBeNull();
    expect(montoPlanEnCentavos('pro')).toBeNull();
    expect(montoPlanEnCentavos('enterprise')).toBeNull();
    expect(montoPlanEnCentavos('no_existe')).toBeNull();
  });
});

describe('disponibilidad del plan Fundador', () => {
  it('sigue disponible el 3-nov-2026 hasta las 23:59:59 (hora de Colombia)', () => {
    expect(planDisponible('ingenia_fundador', new Date('2026-11-03T23:59:59-05:00'))).toBe(true);
  });

  it('deja de estar disponible después del 3-nov-2026', () => {
    expect(planDisponible('ingenia_fundador', new Date('2026-11-04T00:00:00-05:00'))).toBe(false);
  });

  it('los planes sin fecha límite siguen disponibles', () => {
    expect(planDisponible('smartboard_premium', new Date('2030-01-01T00:00:00-05:00'))).toBe(true);
  });

  it('un plan inexistente no está disponible', () => {
    expect(planDisponible('no_existe', new Date())).toBe(false);
  });
});
