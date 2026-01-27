import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="border border-gray-100 rounded-lg p-4 animate-pulse bg-white">
      <div className="bg-gray-200 h-[300px] w-full rounded mb-4"></div>
      <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/2 rounded mb-4"></div>
      <div className="flex justify-between items-center mt-4">
         <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
         <div className="h-8 bg-gray-200 w-24 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;