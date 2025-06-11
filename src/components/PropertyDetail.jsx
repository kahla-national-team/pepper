import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import BookingForm from './BookingForm';

export default function PropertyDetail() {
  const { id } = useParams();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showBookingForm ? (
        <BookingForm
          property={property}
          onClose={() => setShowBookingForm(false)}
        />
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
              <p className="text-gray-600 mb-6">{property.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">${property.price}</div>
                  <div className="text-gray-600">per night</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{property.bedrooms}</div>
                  <div className="text-gray-600">bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{property.bathrooms}</div>
                  <div className="text-gray-600">bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{property.maxGuests}</div>
                  <div className="text-gray-600">guests</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-[#ff385c] text-white py-3 rounded-lg font-medium hover:bg-[#e31c5f]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 