import { useStudentProfile } from "./useStudentProfile";

const PLANS = {
  free: { id: "free", name: "Gratis", color: "#94A3B8" },
  pro: { id: "pro", name: "Pro", color: "#D4A017" },
  enterprise: { id: "enterprise", name: "Enterprise", color: "#004B63" },
};

export function usePremiumStatus() {
  // El plan venia de Clerk publicMetadata; ahora del perfil en Supabase.
  const { profile: user, isLoading } = useStudentProfile();
  const isLoaded = !isLoading;

  if (!isLoaded || !user) {
    return {
      isLoaded,
      isPremium: false,
      plan: PLANS.free,
      features: [],
    };
  }

  const planId = user?.plan || "free";
  const plan = PLANS[planId] || PLANS.free;
  const isPremium = planId !== "free";

  return {
    isLoaded,
    isPremium,
    plan,
    planId,
    subscriptionId: user?.subscriptionId,
  };
}
