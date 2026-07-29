import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import CustomSignUpForm from "./CustomSignUpForm";
import SEO from "./SEO";

const IALabSignUpPage = ({ onBack }) => {
  const { t, locale } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/ialab";

  const handleBackToLogin = () => {
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomSignUpForm onBack={handleBackToLogin} returnTo={returnTo} />
    </motion.div>
  );
};

export default IALabSignUpPage;
