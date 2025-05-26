import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaCalendarAlt } from 'react-icons/fa';

const ServiceCard = ({ service }) => (
  <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={service.image} 
        alt={service.title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {service.status}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-[#ff385c] font-bold text-lg">{service.price}</span>
        <div className="flex items-center text-yellow-400">
          <FaStar />
          <span className="ml-1 text-gray-600">{service.rating}</span>
        </div>
      </div>
      <div className="flex items-center text-gray-500 mb-6">
        <FaCalendarAlt className="mr-2" />
        <span>{service.bookings} bookings</span>
      </div>
      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 bg-[#ff385c] text-white py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all">
          <FaEdit />
          <span>Edit</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all">
          <FaTrash />
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
);

const ConciergeServices = ({ services }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#ff385c]">My Concierge Services</h2>
          <p className="text-gray-500 mt-1">Manage and track your service offerings</p>
        </div>
        <button className="flex items-center space-x-2 bg-[#ff385c] text-white px-6 py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02]">
          <FaPlus />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ConciergeServices; 