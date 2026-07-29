import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Brain, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import FloatingParticles from "./FloatingParticles";
import { sanitize } from "../utils/sanitize";
import SEO from "./SEO";

const CustomSignUpForm = ({ onBack, returnTo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp, setActive } = useAuth();

  const defaultReturnTo = returnTo || "/ialab";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError(
        t("signup.error.first_name_required") || "First name is required",
      );
      return false;
    }
    if (!formData.lastName.trim()) {
      setError(t("signup.error.last_name_required") || "Last name is required");
      return false;
    }
    if (!formData.username.trim()) {
      setError(t("signup.error.username_required") || "Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("signup.error.email_required") || "Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t("signup.error.invalid_email") || "Invalid email format");
      return false;
    }
    if (!formData.password) {
      setError(t("signup.error.password_required") || "Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError(
        t("signup.error.password_min_length") ||
          "Password must be at least 8 characters",
      );
      return false;
    }
    if (formData.phone.trim() && !/^[\d\s+()/-]{7,}$/.test(formData.phone)) {
      setError(
        t("signup.error.phone_invalid") || "Invalid phone number format",
      );
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Create user with Clerk
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        unsafeMetadata: {
          user_type: "adult",
          platform: "ialab",
          age_range: "18+",
          registration_source: "ialab_signup",
        },
      });

      // Get the Clerk user ID for syncing
      const clerkUserId = result.createdUserId;

      // Sync user to Supabase
      if (clerkUserId) {
        try {
          const syncResponse = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/sync-user`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                clerk_id: clerkUserId,
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username,
                phone_number: formData.phone || null,
                user_type: "adult",
                platform: "ialab",
                age_range: "18+",
                registration_source: "ialab_signup",
              }),
            },
          );

          if (!syncResponse.ok) {
            console.warn(
              "Failed to sync user to Supabase:",
              await syncResponse.text(),
            );
            // Continue anyway - Clerk user is created
          }
        } catch (syncErr) {
          console.warn("Error syncing to Supabase:", syncErr);
          // Continue anyway - Clerk user is created
        }
      }

      // If email verification is enabled, prompt to verify
      if (result.status === "missing_requirements") {
        // Email verification required
        setSuccess(true);
        setTimeout(() => {
          setActive({ session: result.createdSessionId });
          navigate(defaultReturnTo);
        }, 2000);
      } else if (result.status === "complete") {
        // Registration complete
        setSuccess(true);
        setTimeout(() => {
          setActive({ session: result.createdSessionId });
          navigate(defaultReturnTo);
        }, 2000);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(
        err.errors?.[0]?.message ||
          err.message ||
          t("signup.error.registration_failed") ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={t("seo.signup_ialab.title")}
        description={t("seo.signup_ialab.desc")}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t("ialab.signup_back_to_login")}
          </span>
        </button>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Brand & Info */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] p-8 lg:p-12 text-white flex flex-col justify-between">
              <div>
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Edutechlife</h1>
                    <p className="text-white/80 text-sm">
                      {t("ialab.signup_subtitle")}
                    </p>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {t("ialab.signup_welcome_title")}
                  </h2>
                  <p
                    className="text-white/90 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sanitize(t("ialab.signup_welcome_desc")),
                    }}
                  />
                  <p className="text-white/80 mt-4 text-sm italic">
                    {t("ialab.signup_welcome_quote")}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-white/90">
                      {t("ialab.signup_feature_1")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-white/90">
                      {t("ialab.signup_feature_2")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-white/90">
                      {t("ialab.signup_feature_3")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  {t("ialab.signup_have_account")}{" "}
                  <button
                    onClick={onBack}
                    className="text-white hover:underline font-medium"
                  >
                    {t("ialab.signup_login_here")}
                  </button>
                </p>
              </div>
            </div>

            {/* Right Side - Custom Sign-Up Form */}
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center items-center">
              {/* Header */}
              <div className="mb-6 text-center w-full">
                <h3 className="text-2xl font-bold text-[#004B63] mb-2">
                  {t("ialab.signup_form_title")}
                </h3>
                <p className="text-[#4DA8C4]">{t("ialab.signup_form_desc")}</p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSignUp}
                className="w-full max-w-sm space-y-4"
              >
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {t("signup.success.registration_complete") ||
                      "Registration successful! Redirecting..."}
                  </div>
                )}

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.first_name") || "First Name"}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={
                      t("signup.placeholder.first_name") ||
                      "Enter your first name"
                    }
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.last_name") || "Last Name"}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={
                      t("signup.placeholder.last_name") ||
                      "Enter your last name"
                    }
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.username") || "Username"}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={
                      t("signup.placeholder.username") || "Choose a username"
                    }
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.phone") || "Phone Number (Optional)"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={
                      t("signup.placeholder.phone") || "+1 (555) 123-4567"
                    }
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.email") || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={
                      t("signup.placeholder.email") || "Enter your email"
                    }
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#00374A] mb-2">
                    {t("signup.field.password") || "Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={
                        t("signup.placeholder.password") || "Create a password"
                      }
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B63] disabled:bg-gray-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#004B63]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("signup.info.password_min_length") ||
                      "At least 8 characters"}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004B63] text-white py-2 rounded-lg font-medium hover:bg-[#0A3550] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                >
                  {loading
                    ? t("signup.button.registering") || "Registering..."
                    : t("signup.button.register") || "Register"}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 w-full max-w-sm">
                <p
                  className="text-center text-[#4DA8C4] text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitize(t("ialab.signup_terms")),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSignUpForm;
