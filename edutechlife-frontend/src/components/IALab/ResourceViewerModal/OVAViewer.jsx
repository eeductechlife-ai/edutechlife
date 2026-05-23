import { useRef, useEffect } from 'react';
import QueEsPrompt_OVA_Original from '../QueEsPrompt_OVA_Original';

const OVAViewer = ({ resource, onClose }) => {
  const autoMarkedRef = useRef(false);

  useEffect(() => {
  }, []);

  if (resource.url) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full rounded-2xl border-0"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
      <div className="flex-1 relative">
        <QueEsPrompt_OVA_Original onClose={onClose} />
      </div>
    </div>
  );
};

export default OVAViewer;
