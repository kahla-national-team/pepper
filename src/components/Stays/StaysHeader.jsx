import React from 'react';
import ServiceSearchBar from '../serviceSearchBar';

const StaysHeader = ({ onSearch, filters }) => {
  return (
    <div className="mb-8 sm:mb-12 in-flow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Perfect Stay</h1>
      <ServiceSearchBar 
        onSearch={onSearch}
        filters={filters}
      />
    </div>
  );
};

export default StaysHeader; 