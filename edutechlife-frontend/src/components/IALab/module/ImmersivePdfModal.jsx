import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const ImmersivePdfModal = ({ isOpen, resource, onClose, t }) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full h-full max-w-6xl bg-white rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_50px_-12px_rgba(0,75,99,0.25)]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <Icon name="fa-file-pdf" className="text-[#06B6D4] text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{resource.title}</h2>
              <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                <span>{t("ialab.topic_resources.immersive_view")}</span>
                <span>&bull;</span>
                <span>{t("ialab.viewer_modal.fullscreen")}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              document.documentElement.requestFullscreen?.();
            }}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium border-none"
          >
            <Icon name="fa-expand" className="w-5 h-5 text-white" />
            {t("ialab.viewer_modal.fullscreen")}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium border-none"
          >
            <Icon name="fa-times" className="w-5 h-5 text-white" />
            {t("ialab.viewer_modal.close")}
          </button>
        </div>
        <div className="flex-1 relative">
          <iframe
            src={`${resource.url}#view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
            title={`${resource.title} - ${t("ialab.topic_resources.immersive_view")}`}
            id="immersive-pdf-iframe"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

ImmersivePdfModal.propTypes = {
  isOpen: PropTypes.bool,
  resource: PropTypes.object,
  onClose: PropTypes.func,
  t: PropTypes.func,
};

export default ImmersivePdfModal;
