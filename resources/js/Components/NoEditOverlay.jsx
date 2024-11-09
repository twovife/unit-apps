import React from 'react';

const NoEditOverlay = ({ value = 'User Tidak Bisa Melakukan Edit' }) => {
  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full transition-all duration-200 ease-in opacity-0 bg-white/0 hover:bg-white/30 hover:opacity-100 hover:cursor-not-allowed">
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-3xl font-black text-center text-red-500">
          {value}
        </div>
      </div>
    </div>
  );
};

export default NoEditOverlay;
