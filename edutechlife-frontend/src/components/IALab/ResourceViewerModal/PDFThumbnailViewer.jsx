import { Icon } from '../../../utils/iconMapping.jsx';

const PDFThumbnailViewer = ({ resource }) => {
  const openFullScreen = () => window.open(resource.url, '_blank');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end items-center mb-2 px-1">
        <button
          onClick={openFullScreen}
          className="text-sm font-medium text-petroleum bg-petroleum/10 hover:bg-petroleum/12 py-1.5 px-3 rounded-md transition-colors flex items-center gap-2"
        >
          <Icon name="fa-expand" className="w-3.5 h-3.5" />
          Abrir en pantalla completa
          <Icon name="fa-arrow-up-right-from-square" className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 bg-transparent rounded-2xl overflow-hidden">
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full rounded-lg border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default PDFThumbnailViewer;
