---
name: stripe-setup
description: Configuración de productos Stripe, precios y webhooks para procesamiento de pagos. Ideal para e-commerce, suscripciones y Checkout.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: payments
  triggers:
    - stripe
    - pago
    - payments
    - checkout
    - precio
    - producto
---

# stripe-setup

Configure Stripe products, prices, and webhooks para procesamiento de pagos.

## When to use

Utiliza esta skill cuando necesites:

- **Configurar productos:** Crear productos para sesiones, eventos, descargas
- **Establecer precios:** Definir precios unitarios con diferentes monedas
- **Configurar webhooks:** Recibir notificaciones de eventos de pago
- **Checkout integration:** Implementar pago con Stripe Checkout
- **Suscripciones:** Crear planes recurrentes y membresías

**Palabras clave que activan esta skill:** `stripe`, `pago`, `payments`, `checkout`, `precio`, `producto`

## Instructions

### 1. Prerrequisitos

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Iniciar sesión
stripe login

# Verificar conexión
stripe config --list
```

### 2. Crear Productos

```bash
# Producto: Sesión de Retrato
stripe products create \
  --name="Sesión de Retrato" \
  --description="1 hora de sesión de fotos con 10 imágenes editadas"

# Producto: Cobertura de Evento - Medio Día
stripe products create \
  --name="Cobertura de Evento - Medio Día" \
  --description="4 horas de fotografía y video para eventos"

# Producto: Paquete de Descarga Digital
stripe products create \
  --name="Paquete de Descarga Digital" \
  --description="Imágenes en alta resolución de tu sesión"
```

### 3. Crear Precios

```bash
# Después de crear productos, obtener IDs y crear precios:

# Sesión de Retrato - $250
stripe prices create \
  --product="prod_XXXXX" \
  --unit-amount=25000 \
  --currency=usd

# Evento Medio Día - $800
stripe prices create \
  --product="prod_XXXXX" \
  --unit-amount=80000 \
  --currency=usd

# Descarga Digital - $150
stripe prices create \
  --product="prod_XXXXX" \
  --unit-amount=15000 \
  --currency=usd
```

### 4. Configurar Webhooks

**Desarrollo Local:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Producción:**
```bash
stripe webhook_endpoints create \
  --url="https://tu-dominio.com/api/webhooks/stripe" \
  --enabled-events="checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed"
```

### 5. Verificar Configuración

```bash
# Listar productos
stripe products list --limit 10

# Listar precios
stripe prices list --limit 10
```

## Errores Comunes

| Problema | Solución |
|----------|----------|
| Webhook no llega | Verificar que la URL sea accesible (no localhost en producción) |
| Precio no se crea | Asegurar que el product ID sea correcto |
| CLI no funciona | Verificar que `stripe login` fue exitoso |

## Véase También

- [Documentación Stripe](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)