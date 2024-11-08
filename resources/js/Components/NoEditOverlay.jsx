import React from 'react';

const NoEditOverlay = ({ value = 'User Tidak Bisa Melakukan Edit' }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white/0 opacity-0 hover:bg-white/30 hover:opacity-100 hover:cursor-not-allowed duration-200 transition-all ease-in">
      <div className="flex h-full w-full items-center justify-center">
        <div className="font-black text-3xl">{value}</div>
      </div>
    </div>
  );
};

export default NoEditOverlay;
