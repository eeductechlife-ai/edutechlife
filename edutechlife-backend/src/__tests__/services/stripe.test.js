const { getPlanById, getPublicPlans } = require('../../data/plans');

describe('Plans data', () => {
  it('returns free plan', () => {
    const plan = getPlanById('free');
    expect(plan).toBeDefined();
    expect(plan.price).toBe(0);
    expect(plan.id).toBe('free');
  });

  it('returns pro plan', () => {
    const plan = getPlanById('pro');
    expect(plan).toBeDefined();
    expect(plan.price).toBe(29900);
    expect(plan.priceId).toBeDefined();
  });

  it('returns enterprise plan', () => {
    const plan = getPlanById('enterprise');
    expect(plan).toBeDefined();
    expect(plan.isCustom).toBe(true);
  });

  it('returns null for invalid plan', () => {
    const plan = getPlanById('nonexistent');
    expect(plan).toBeNull();
  });

  it('getPublicPlans hides priceId', () => {
    const plans = getPublicPlans();
    const pro = plans.find((p) => p.id === 'pro');
    expect(pro.priceId).toBeUndefined();
  });
});

describe('Stripe service', () => {
  let stripeService;
  let mockSessionsCreate;
  let mockConstructEvent;
  let mockUpdateUser;
  let mockStripeFactory;

  beforeAll(() => {
    mockSessionsCreate = vi.fn();
    mockConstructEvent = vi.fn();
    mockUpdateUser = vi.fn();

    mockStripeFactory = vi.fn(() => ({
      checkout: { sessions: { create: mockSessionsCreate } },
      webhooks: { constructEvent: mockConstructEvent },
    }));

    const stripePath = require.resolve('stripe');
    delete require.cache[stripePath];
    require.cache[stripePath] = {
      id: stripePath,
      filename: stripePath,
      loaded: true,
      exports: mockStripeFactory,
    };

    const clerkPath = require.resolve('@clerk/backend');
    delete require.cache[clerkPath];
    require.cache[clerkPath] = {
      id: clerkPath,
      filename: clerkPath,
      loaded: true,
      exports: {
        createClerkClient: vi.fn(() => ({
          users: { updateUser: mockUpdateUser },
        })),
      },
    };

    const stripeServicePath = require.resolve('../../services/stripe');
    delete require.cache[stripeServicePath];
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    stripeService = require('../../services/stripe');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  describe('getStripe', () => {
    it('returns stripe instance when key is set', () => {
      const stripe = stripeService.getStripe();
      expect(stripe).toBeDefined();
      expect(stripe.checkout).toBeDefined();
    });

    it('returns null when stripe key is missing', () => {
      delete process.env.STRIPE_SECRET_KEY;
      const result = stripeService.getStripe();
      expect(result).toBeNull();
      process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    });
  });

  describe('createCheckoutSession', () => {
    it('returns error when stripe not configured', async () => {
      delete process.env.STRIPE_SECRET_KEY;
      const result = await stripeService.createCheckoutSession({ planId: 'pro', userId: 'u1', email: 'test@test.com' });
      expect(result.url).toBeNull();
      expect(result.error).toBe('Stripe no configurado');
      process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    });

    it('returns error for invalid planId', async () => {
      const result = await stripeService.createCheckoutSession({ planId: 'nonexistent' });
      expect(result.url).toBeNull();
      expect(result.error).toBe('Plan no válido');
    });

    it('returns error for free plan', async () => {
      const result = await stripeService.createCheckoutSession({ planId: 'free' });
      expect(result.url).toBeNull();
      expect(result.error).toBe('Este plan no requiere pago');
    });

    it('returns error for custom/enterprise plan', async () => {
      const result = await stripeService.createCheckoutSession({ planId: 'enterprise' });
      expect(result.url).toBeNull();
      expect(result.error).toBe('Este plan no requiere pago');
    });

    it('creates checkout session successfully', async () => {
      mockSessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/session', id: 'cs_test_123' });

      const result = await stripeService.createCheckoutSession({
        planId: 'pro', userId: 'u1', email: 'test@test.com',
      });

      expect(mockSessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
        mode: 'subscription',
        client_reference_id: 'u1',
        customer_email: 'test@test.com',
        metadata: expect.objectContaining({ userId: 'u1', planId: 'pro' }),
      }));
      expect(result.url).toBe('https://checkout.stripe.com/session');
      expect(result.sessionId).toBe('cs_test_123');
    });

    it('returns error when stripe session creation throws', async () => {
      mockSessionsCreate.mockRejectedValue(new Error('Stripe API error'));

      const result = await stripeService.createCheckoutSession({
        planId: 'pro', userId: 'u1', email: 'test@test.com',
      });

      expect(result.url).toBeNull();
      expect(result.error).toBe('Error al crear sesión de pago');
    });
  });

  describe('handleWebhookEvent', () => {
    it('handles checkout.session.completed', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { userId: 'u1', planId: 'pro' },
            subscription: 'sub_123',
          },
        },
      };

      const result = await stripeService.handleWebhookEvent(event);

      expect(mockUpdateUser).toHaveBeenCalledWith('u1', {
        publicMetadata: {
          plan: 'pro',
          subscriptionId: 'sub_123',
          subscriptionStatus: 'active',
        },
      });
      expect(result).toEqual({ userId: 'u1', planId: 'pro', subscriptionId: 'sub_123', status: 'active' });
    });

    it('handles checkout.session.completed with missing metadata', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: { object: { metadata: {} } },
      };

      const result = await stripeService.handleWebhookEvent(event);

      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('handles customer.subscription.updated', async () => {
      const event = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_123',
            metadata: { userId: 'u1', planId: 'pro' },
            status: 'active',
          },
        },
      };

      const result = await stripeService.handleWebhookEvent(event);

      expect(mockUpdateUser).toHaveBeenCalledWith('u1', {
        publicMetadata: {
          plan: 'pro',
          subscriptionStatus: 'active',
        },
      });
      expect(result.userId).toBe('u1');
      expect(result.status).toBe('active');
    });

    it('handles customer.subscription.deleted', async () => {
      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            metadata: { userId: 'u1', planId: 'pro' },
            status: 'canceled',
          },
        },
      };

      const result = await stripeService.handleWebhookEvent(event);

      expect(mockUpdateUser).toHaveBeenCalledWith('u1', {
        publicMetadata: {
          plan: 'free',
          subscriptionStatus: 'canceled',
        },
      });
      expect(result.status).toBe('canceled');
    });

    it('handles subscription updated without userId', async () => {
      const event = {
        type: 'customer.subscription.updated',
        data: { object: { id: 'sub_123', metadata: {}, status: 'active' } },
      };

      const result = await stripeService.handleWebhookEvent(event);

      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(result.userId).toBeUndefined();
    });

    it('returns null for unknown event type', async () => {
      const event = { type: 'unknown.event', data: { object: {} } };
      const result = await stripeService.handleWebhookEvent(event);
      expect(result).toBeNull();
    });
  });
});
