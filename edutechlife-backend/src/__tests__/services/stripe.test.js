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
