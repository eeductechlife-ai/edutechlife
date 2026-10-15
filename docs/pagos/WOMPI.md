# Cobro en Colombia con Wompi

Stripe no abre cuentas a empresas colombianas y no ofrece PSE ni Nequi. Wompi
(Bancolombia) cobra con tarjeta, PSE, Nequi y botón Bancolombia, en COP.

## Qué hay en el código (paso 1)

- `edutechlife-backend/src/services/wompi.js`: arma el Web Checkout firmado
  (firma de integridad SHA256) y verifica el checksum de los eventos.
- `POST /api/payments/wompi/checkout` (con sesión): devuelve la URL de pago de
  un plan en COP. Responde 503 sin llaves.
- `POST /api/payments/wompi/events`: URL de eventos para el panel de Wompi.
  Si la transacción queda `APPROVED` por el monto exacto del plan, activa o
  extiende el plan un mes (o un año en el plan anual) y guarda hasta cuándo
  está pagado. Un evento repetido no extiende dos veces.
- `POST /api/payments/wompi/link-cobro` (solo admin, body `{ email, planId }`):
  para quien ya tuvo la valoración gratuita. Genera el enlace de pago de ese
  usuario registrado, lo devuelve al admin y se lo envía por correo (es/en/pt).
  Planes: `smartboard_premium` (base), `ingenia_fundador`, `ingenia_acompanamiento`,
  `ingenia_intensivo`. Máximo 5 por hora y por administrador.
- `src/services/paidPlans.js`: cada hora apaga los planes cuyo periodo pagado
  terminó (solo corre con Wompi configurado). Los planes de Stripe y de
  colegios no tienen fecha y no se tocan.
- Montos: salen de `src/data/plans.js` (centavos de COP, la unidad de Wompi).

Sin las tres variables siguientes todo queda apagado:

| Variable (Render) | De dónde sale |
|---|---|
| `WOMPI_PUBLIC_KEY` | Panel Wompi > Desarrolladores (`pub_test_…` o `pub_prod_…`) |
| `WOMPI_INTEGRITY_SECRET` | Panel Wompi > Desarrolladores > Secretos > Integridad |
| `WOMPI_EVENTS_SECRET` | Panel Wompi > Desarrolladores > Secretos > Eventos |

## Antes de encenderlo en producción

1. **Aplicar la migración 104** (`supabase/migrations/104_planes_pagados_con_vencimiento.sql`)
   en Supabase. Agrega la fecha de vencimiento del plan. Las migraciones se
   aplican a mano en producción.
2. **Botón en el frontend.** Listo: `/planes` y el candado Premium de IngenIA
   piden primero el pago a Wompi y, si el backend responde 503 (sin llaves),
   caen a Stripe. La llave pública vive solo en el backend (Render).
3. **Probar en sandbox** con llaves `pub_test_` y las tarjetas de prueba de Wompi,
   y registrar la URL de eventos `https://<backend>/api/payments/wompi/events`.
