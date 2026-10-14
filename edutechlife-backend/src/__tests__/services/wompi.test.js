const crypto = require('crypto');
const request = require('supertest');
const {
  integritySignature,
  buildReference,
  parseReference,
  createWompiCheckout,
  verifyEventChecksum,
  getActivationFromEvent,
  isPagosWompiEnabled,
  firmaIntegridad,
  verificarChecksumEvento,
  planDisponible,
  montoPlanEnCentavos,
} = require('../../services/wompi');

const sha256 = (t) => crypto.createHash('sha256').update(t).digest('hex');
const USER = '6f1c2a3b-1111-4222-8333-944455556666';
const KEYS = {
  WOMPI_PUBLIC_KEY: 'pub_test_abc',
  WOMPI_INTEGRITY_SECRET: 'test_integrity_x',
  WOMPI_EVENTS_SECRET: 'test_events_y',
};

function withKeys() {
  Object.assign(process.env, KEYS);
}
function withoutKeys() {
  Object.keys(KEYS).forEach((k) => delete process.env[k]);
}

function signedEvent(transaction, secret = KEYS.WOMPI_EVENTS_SECRET) {
  const timestamp = 1530291411;
  const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'];
  const checksum = sha256(
    `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`,
  );
  return {
    event: 'transaction.updated',
    data: { transaction: { ...transaction } },
    signature: { properties, checksum },
    timestamp,
  };
}

afterEach(withoutKeys);

describe('Wompi: firma de integridad', () => {
  it('coincide con el ejemplo de la documentación de Wompi', () => {
    // Ejemplo publicado por Wompi para la firma de integridad.
    const sig = integritySignature(
      { reference: 'sk8-438k4-xmxm392-sn2m', amountInCents: 2490000, currency: 'COP' },
      'prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6',
    );
    expect(sig).toBe(sha256('sk8-438k4-xmxm392-sn2m2490000COPprod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6'));
  });

  it('la referencia lleva plan y usuario y se puede leer de vuelta', () => {
    const ref = buildReference('ingenia_segundo_hijo', USER, 123);
    expect(parseReference(ref)).toEqual({ planId: 'ingenia_segundo_hijo', userId: USER });
    expect(parseReference('basura')).toBeNull();
  });
});

describe('Wompi: checkout', () => {
  it('no arma nada sin llaves', () => {
    withoutKeys();
    expect(createWompiCheckout({ planId: 'smartboard_premium', userId: USER }).error).toBe('Wompi no configurado');
  });

  it('arma la URL firmada con el precio del plan en centavos de COP', () => {
    withKeys();
    const { url, reference } = createWompiCheckout({
      planId: 'smartboard_premium',
      userId: USER,
      email: 'familia@example.com',
    });
    const params = new URL(url).searchParams;
    expect(url.startsWith('https://checkout.wompi.co/p/?')).toBe(true);
    expect(params.get('amount-in-cents')).toBe('4990000');
    expect(params.get('currency')).toBe('COP');
    expect(params.get('reference')).toBe(reference);
    expect(params.get('signature:integrity')).toBe(
      sha256(`${reference}4990000COP${KEYS.WOMPI_INTEGRITY_SECRET}`),
    );
    expect(params.get('customer-data:email')).toBe('familia@example.com');
  });

  it('rechaza planes en dólares, gratis o inexistentes', () => {
    withKeys();
    expect(createWompiCheckout({ planId: 'pro', userId: USER }).error).toBe('Plan no disponible en pesos');
    expect(createWompiCheckout({ planId: 'free', userId: USER }).error).toBe('Este plan no requiere pago');
    expect(createWompiCheckout({ planId: 'nada', userId: USER }).error).toBe('Plan no válido');
  });
});

describe('Wompi: eventos', () => {
  const tx = {
    id: '1234-1610641025-49201',
    status: 'APPROVED',
    amount_in_cents: 4990000,
    currency: 'COP',
    reference: buildReference('smartboard_premium', USER, 1),
  };

  it('acepta un evento con checksum válido', () => {
    expect(verifyEventChecksum(signedEvent(tx), KEYS.WOMPI_EVENTS_SECRET)).toBe(true);
  });

  it('rechaza un evento firmado con otro secreto o alterado', () => {
    expect(verifyEventChecksum(signedEvent(tx, 'otro'), KEYS.WOMPI_EVENTS_SECRET)).toBe(false);
    const altered = signedEvent(tx);
    altered.data.transaction.amount_in_cents = 100;
    expect(verifyEventChecksum(altered, KEYS.WOMPI_EVENTS_SECRET)).toBe(false);
    expect(verifyEventChecksum({}, KEYS.WOMPI_EVENTS_SECRET)).toBe(false);
  });

  it('activa solo transacciones aprobadas por el precio exacto del plan', () => {
    expect(getActivationFromEvent(signedEvent(tx))).toEqual({
      userId: USER,
      planId: 'smartboard_premium',
      transactionId: tx.id,
    });
    expect(getActivationFromEvent(signedEvent({ ...tx, status: 'DECLINED' }))).toBeNull();
    expect(getActivationFromEvent(signedEvent({ ...tx, amount_in_cents: 100 }))).toBeNull();
  });
});

describe('Rutas /api/payments/wompi', () => {
  const app = require('../../app');

  it('checkout pide sesión', async () => {
    const res = await request(app).post('/api/payments/wompi/checkout').send({ planId: 'smartboard_premium' });
    expect(res.status).toBe(401);
  });

  it('eventos sin llaves responde 200 y no hace nada', async () => {
    withoutKeys();
    const res = await request(app).post('/api/payments/wompi/events').send({ event: 'transaction.updated' });
    expect(res.status).toBe(200);
  });

  it('eventos con firma inválida responde 401', async () => {
    withKeys();
    const res = await request(app)
      .post('/api/payments/wompi/events')
      .send(signedEvent({ id: 'x', status: 'APPROVED', amount_in_cents: 1 }, 'falso'));
    expect(res.status).toBe(401);
  });
});

// --- Funciones base de #105 (firma, checksum, montos y Fundador) ---

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
