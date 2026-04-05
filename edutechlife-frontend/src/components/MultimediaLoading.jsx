import React from 'react';

const MultimediaLoading = ({ type = 'default' }) => {
  const loaders = {
    default: (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#B2D8E5] border-t-[#2D7A94] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"></div>
          </div>
        </div>
        <p className="text-[#2D7A94] font-medium font-montserrat">Cargando contenido multimedia...</p>
      </div>
    ),
    video: (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden relative animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    ),
    audio: (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 my-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    ),
    content: (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return loaders[type] || loaders.default;
};

export default MultimediaLoading;