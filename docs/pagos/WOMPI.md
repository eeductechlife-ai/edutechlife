# Cobro en Colombia con Wompi

Stripe no abre cuentas a empresas colombianas y no ofrece PSE ni Nequi. Wompi
(Bancolombia) cobra con tarjeta, PSE, Nequi y botón Bancolombia, en COP.

## Qué hay en el código (paso 1)

- `edutechlife-backend/src/services/wompi.js`: arma el Web Checkout firmado
  (firma de integridad SHA256) y verifica el checksum de los eventos.
- `POST /api/payments/wompi/checkout` (con sesión): devuelve la URL de pago de
  un plan en COP. Responde 503 sin llaves.
- `POST /api/payments/wompi/events`: URL de eventos para el panel de Wompi.
  Si la transacción queda `APPROVED` por el monto exacto del plan, activa el
  plan con la misma función que usa Stripe.
- Montos: salen de `src/data/plans.js` (centavos de COP, la unidad de Wompi).

Sin las tres variables siguientes todo queda apagado:

| Variable (Render) | De dónde sale |
|---|---|
| `WOMPI_PUBLIC_KEY` | Panel Wompi > Desarrolladores (`pub_test_…` o `pub_prod_…`) |
| `WOMPI_INTEGRITY_SECRET` | Panel Wompi > Desarrolladores > Secretos > Integridad |
| `WOMPI_EVENTS_SECRET` | Panel Wompi > Desarrolladores > Secretos > Eventos |

## Antes de encenderlo en producción

1. **Renovación.** Web Checkout cobra una sola vez. Hoy un pago aprobado deja
   el plan activo sin fecha de fin. Antes de vender planes mensuales hay que
   (a) guardar `paid_until` y apagar el plan al vencer, o (b) cobrar cada mes
   con fuentes de pago (tarjeta tokenizada o Nequi) desde el backend.
   El plan anual (`ingenia_base_anual`) es el que mejor encaja con un pago único.
2. **Botón en el frontend.** `/planes` y la landing de IngenIA siguen llamando
   a Stripe. Falta elegir la pasarela según el país del usuario.
3. **Probar en sandbox** con llaves `pub_test_` y las tarjetas de prueba de Wompi,
   y registrar la URL de eventos `https://<backend>/api/payments/wompi/events`.
