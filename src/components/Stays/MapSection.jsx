import React from 'react';
import ServiceMap from '../ServiceMap';
import MapToggleWrapper from '../MapToggleWrapper';

const MapSection = ({ stays, selectedStay }) => {
  return (
    <MapToggleWrapper>
      <ServiceMap 
        services={stays}
        selectedService={selectedStay}
      />
    </MapToggleWrapper>
  );
};

export default MapSection; 