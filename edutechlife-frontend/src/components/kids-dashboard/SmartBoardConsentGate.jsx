import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import SmartBoardHabeasDataModal from "./SmartBoardHabeasDataModal";

/**
 * SmartBoardConsentGate: Intermediate page after signup
 *
 * Handles:
 * 1. Show Habeas Data modal
 * 2. Collect parental consent if minor
 * 3. Save to backend
 * 4. Redirect to SmartBoard dashboard
 */
const SmartBoardConsentGate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Identidad y perfil desde Supabase (Clerk ya no autentica).
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const { profile } = useStudentProfile();
  const { setSubscriptionTier } = useSmartBoardKids();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user not authenticated or failed signup, redirect back
    if (isLoaded && !isSignedIn) {
      navigate("/sign-up/smartboard");
      return;
    }

    // Show modal when loaded
    if (isLoaded && isSignedIn) {
      setShowModal(true);
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleAcceptConsent = async (data) => {
    setIsLoading(true);

    try {
      // Calculate student age from Clerk publicMetadata
      // La edad venia de Clerk publicMetadata; ahora del rango guardado en el
      // perfil de Supabase (age_range), con 13 como valor por defecto.
      const studentAge = parseInt(profile?.age_range, 10) || 13;

      // If minor, send parental consent to backend
      if (data.parentEmail) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/smartboard/parental-consent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              parentEmail: data.parentEmail,
              studentAge,
              timestamp: new Date().toISOString(),
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to register parental consent");
        }
      }

      // Set basic subscription tier
      setSubscriptionTier("basic");

      // Redirect to SmartBoard
      const returnTo = searchParams.get("returnTo") || "/smartboard";
      navigate(returnTo);
    } catch (error) {
      console.error("Consent submission failed:", error);
      // Show error and allow retry
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    // User declined — send back to signup
    navigate("/sign-up/smartboard");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004B63] to-[#0A3550]">
        <div className="text-white text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && profile && (
        <SmartBoardHabeasDataModal
          studentAge={parseInt(profile?.age_range, 10) || 13}
          onClose={handleCloseModal}
          onAccept={handleAcceptConsent}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-white text-center">
            <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4"></div>
            <p>Guardando consentimiento...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartBoardConsentGate;
