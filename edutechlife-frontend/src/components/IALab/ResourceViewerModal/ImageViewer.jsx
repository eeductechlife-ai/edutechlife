import { useState } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';

const ImageViewer = ({ resource }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-image" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            {resource.interactive && (
              <span className="text-sm text-petroleum font-medium">Interactiva</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
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

      <div className="flex-1 relative bg-transparent">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-petroleum/25 border-t-[#004B63] rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={resource.url}
          alt={resource.title}
          className={cn(
            "w-full object-contain",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {resource.description && (
        <div className="p-4 bg-petroleum/5">
          <p className="text-sm text-petroleum/80">{resource.description}</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
