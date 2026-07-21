import { useUser } from '@clerk/react';

const PLANS = {
  free: { id: 'free', name: 'Gratis', color: '#94A3B8' },
  pro: { id: 'pro', name: 'Pro', color: '#D4A017' },
  enterprise: { id: 'enterprise', name: 'Enterprise', color: '#004B63' },
};

export function usePremiumStatus() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return {
      isLoaded,
      isPremium: false,
      plan: PLANS.free,
      features: [],
    };
  }

  const planId = user.publicMetadata?.plan || 'free';
  const plan = PLANS[planId] || PLANS.free;
  const isPremium = planId !== 'free';

  return {
    isLoaded,
    isPremium,
    plan,
    planId,
    subscriptionId: user.publicMetadata?.subscriptionId,
  };
}
