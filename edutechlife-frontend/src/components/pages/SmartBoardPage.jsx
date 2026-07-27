import { lazy, Suspense } from "react";
import { SmartBoardKidsProvider } from "../../context/SmartBoardKidsContext";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

// The SmartBoard student app renders the full kids dashboard (2.0) — the same
// rich experience as /smartboard, so both entry points stay in sync.
const SmartBoardKidsDashboard = lazy(
  () => import("../kids-dashboard/SmartBoardKidsDashboard"),
);

const SmartBoardPage = () => {
  const { t } = useTranslation();

  return (
    <SmartBoardKidsProvider>
      <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
        <SmartBoardKidsDashboard />
      </Suspense>
    </SmartBoardKidsProvider>
  );
};

export default SmartBoardPage;
