import { useNavigate } from "react-router-dom";
import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title={t("seo.notfound.title")}
        description={t("seo.notfound.desc")}
      />
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#004B63] mb-4">404</h1>
          <p className="text-lg text-[#4DA8C4] mb-6">
            {t("seo.notfound.title")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#004B63] text-white rounded-full hover:bg-[#4DA8C4] transition-colors"
          >
            {t("notfound.button")}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
