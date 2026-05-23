import { useRef } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

const DocumentViewer = ({ resource }) => {
  const iframeRef = useRef(null);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-file-pdf" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-petroleum/70">
              <span>{resource.format}</span>
              {resource.size && <span>• {resource.size}</span>}
              {resource.pages && <span>• {resource.pages} páginas</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            Descargar
          </a>
        </div>
      </div>

      <div className="flex-1 relative" ref={iframeRef}>
        <iframe
          src={`${resource.url}#view=FitH`}
          title={resource.title}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
