import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get all search params for debugging
        const allParams = Object.fromEntries(searchParams);
        console.log("OAuth Callback - All params:", allParams);

        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const error = searchParams.get("error");

        console.log("OAuth Callback - Token:", token ? "present" : "missing");
        console.log("OAuth Callback - Email:", email);
        console.log("OAuth Callback - Error:", error);

        if (error) {
          console.error("OAuth error:", error);
          navigate(`/login?error=oauth_failed`);
          return;
        }

        if (!token || !email) {
          console.error("Missing token or email", { token: !!token, email });
          navigate("/login?error=invalid_callback");
          return;
        }

        // Save authentication token
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_email", email);
        console.log("OAuth token saved, redirecting to /ialab");

        // Redirect to IALab
        navigate("/ialab");
      } catch (err) {
        console.error("Callback processing error:", err);
        navigate("/login?error=callback_failed");
      }
    };

    // Only run if we have search params
    if (searchParams.toString()) {
      handleCallback();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackHandler;
