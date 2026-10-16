// C-005: los precios de IngenIA del backend (Stripe) deben ser los mismos que
// publica el sitio. La fuente única es el frontend (config/preciosIngenia.js);
// esta prueba falla si alguien cambia un monto en un lado y no en el otro.
const path = require('path');
const { pathToFileURL } = require('url');
const { getPlanById, getPublicPlans, INGENIA_PLAN_IDS } = require('../../data/plans');

const CONFIG_FRONTEND = path.resolve(
  __dirname,
  '../../../../edutechlife-frontend/src/config/preciosIngenia.js',
);

describe('precios de IngenIA sincronizados con el sitio', () => {
  let P;

  beforeAll(async () => {
    ({ PRECIOS_INGENIA: P } = await import(pathToFileURL(CONFIG_FRONTEND).href));
  });

  it('todos los planes de IngenIA están en COP (no USD)', () => {
    for (const id of INGENIA_PLAN_IDS) {
      expect(getPlanById(id).currency, id).toBe('cop');
    }
  });

  it('los montos (centavos de COP) coinciden con la configuración del sitio', () => {
    const esperados = {
      [P.base.planId]: P.base.mensual,
      ingenia_base_anual: P.base.anual,
      ingenia_segundo_hijo: P.base.segundoHijo,
      [P.fundador.planId]: P.fundador.mensual,
      [P.acompanamiento.planId]: P.acompanamiento.mensualDesde,
      [P.intensivo.planId]: P.intensivo.mensual,
    };
    expect(Object.keys(esperados).sort()).toEqual([...INGENIA_PLAN_IDS].sort());
    for (const [id, pesos] of Object.entries(esperados)) {
      expect(getPlanById(id).price, id).toBe(pesos * 100);
    }
    expect(getPlanById(P.fundador.planId).availableUntil).toBe(P.fundador.vigenteHasta);
  });

  it('el plan Base no promete coach humano', () => {
    expect(JSON.stringify(getPlanById('smartboard_premium')).toLowerCase()).not.toContain('coach');
  });

  it('el ID de precio de Stripe sale de variables de entorno y no se expone', () => {
    delete process.env.STRIPE_PRICE_INGENIA_MENSUAL;
    expect(getPlanById('smartboard_premium').priceId).toBeNull();
    process.env.STRIPE_PRICE_INGENIA_MENSUAL = 'price_cop_mensual';
    expect(getPlanById('smartboard_premium').priceId).toBe('price_cop_mensual');
    // El Base ya no está en /planes: la proyección pública no debe exponer
    // priceId ni priceEnv en ningún plan.
    getPublicPlans().forEach((p) => {
      expect(p.priceId).toBeUndefined();
      expect(p.priceEnv).toBeUndefined();
    });
    delete process.env.STRIPE_PRICE_INGENIA_MENSUAL;
  });
});
