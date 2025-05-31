import React from 'react';
import StaysCard from '../RENTALCard';

const StaysGrid = ({ stays, selectedStay, onStaySelect, isLoading, error, isMapVisible }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-xl">
        <p className="font-medium">{error}</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-medium text-gray-800 mb-2">No stays found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      isMapVisible 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    }`}>
      {stays.map((stay) => (
        <div key={stay.id} className="h-full">
          <StaysCard 
            service={stay}
            isSelected={selectedStay?.id === stay.id}
            onClick={() => onStaySelect(stay)}
          />
        </div>
      ))}
    </div>
  );
};

export default StaysGrid; 