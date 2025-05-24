import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaHome, FaCheck, FaTimes, FaCarSide, FaUtensils } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { getCalendarData } from '../services/calendarService';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [view, setView] = useState('calendar'); // 'calendar' or 'properties'
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const data = await getCalendarData();
        
        // Transform dates from strings to Date objects
        const transformedProperties = data.properties.map(property => ({
          ...property,
          bookings: property.bookings.map(booking => ({
            ...booking,
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate)
          }))
        }));

        const transformedServices = data.services.map(service => ({
          ...service,
          bookings: service.bookings.map(booking => ({
            ...booking,
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate)
          }))
        }));

        setProperties(transformedProperties);
        setServices(transformedServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50 max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Properties or Services Found</h3>
        <p className="text-gray-600 mb-6">
          You haven't added any properties or services yet. Start by adding your first property or service to manage their availability.
        </p>
        <div className="flex space-x-4 justify-center">
          <button className="bg-gradient-to-r from-[#ff385c] to-[#ff385c]/90 text-white px-6 py-3 rounded-xl hover:from-[#ff385c]/90 hover:to-[#ff385c]/80 transition-all shadow-lg hover:shadow-xl">
            Add Property
          </button>
          <button className="bg-white text-[#ff385c] px-6 py-3 rounded-xl border border-[#ff385c] hover:bg-[#ff385c]/10 transition-all shadow-lg hover:shadow-xl">
            Add Service
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!properties.length && !services.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {renderEmptyState()}
        </div>
      </div>
    );
  }

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const isDateInRange = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
  };

  const getBookingsForDate = (date) => {
    const bookings = [];
    
    // Check property bookings
    properties.forEach(property => {
      property.bookings.forEach(booking => {
        if (isDateInRange(date, booking.startDate, booking.endDate)) {
          bookings.push({
            ...booking,
            name: property.name,
            type: 'property'
          });
        }
      });
    });

    // Check service bookings
    services.forEach(service => {
      service.bookings.forEach(booking => {
        if (isDateInRange(date, booking.startDate, booking.endDate)) {
          bookings.push({
            ...booking,
            name: service.name,
            type: 'service'
          });
        }
      });
    });

    return bookings;
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = 42; // 6 rows of 7 days

    for (let i = 0; i < totalDays; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
      const bookings = isCurrentMonth ? getBookingsForDate(dateToCheck) : [];
      const isSelected = selectedDate && 
        selectedDate.getDate() === dayNumber &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={i}
          onClick={() => isCurrentMonth && handleDateClick(dayNumber)}
          className={`p-4 text-center border border-gray-100 rounded-xl cursor-pointer transition-all relative
            ${isCurrentMonth ? 'hover:bg-[#ff385c]/10' : 'bg-gray-50 text-gray-400'}
            ${isSelected ? 'bg-[#ff385c] text-white hover:bg-[#ff385c]' : ''}
          `}
        >
          <span className="relative z-10">{isCurrentMonth ? dayNumber : ''}</span>
          {isCurrentMonth && bookings.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 flex justify-center space-x-1">
              {bookings.map((booking, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    booking.type === 'property' 
                      ? 'bg-blue-500' 
                      : booking.type === 'service' 
                        ? 'bg-green-500' 
                        : 'bg-gray-500'
                  }`}
                  title={`${booking.name} (${booking.status})`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderPropertyAvailability = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div 
            key={property.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  property.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.status === 'available' ? 'Available' : 'Booked'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-2">{property.name}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-[#ff385c] font-bold">{property.price}</span>
                <button 
                  onClick={() => {
                    setSelectedProperty(property);
                    setView('calendar');
                  }}
                  className="bg-[#ff385c] text-white px-4 py-2 rounded-xl hover:bg-[#ff385c]/90 transition-all"
                >
                  View Calendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/50">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff385c] via-[#ff385c]/90 to-[#ff385c]/80 bg-clip-text text-transparent">
                {view === 'calendar' ? 'Property Calendar' : 'Property Availability'}
              </h1>
              <p className="text-gray-600 mt-3 text-lg font-medium">
                {view === 'calendar' 
                  ? 'Manage your property bookings' 
                  : 'View and manage property availability'}
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setView(view === 'calendar' ? 'properties' : 'calendar')}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3.5 rounded-2xl hover:bg-white transition-all shadow-lg hover:shadow-xl border border-gray-100/50 hover:scale-[1.02]"
              >
                <FaHome className="text-[#ff385c] text-xl" />
                <span className="font-medium">{view === 'calendar' ? 'View Properties' : 'View Calendar'}</span>
              </button>
              {view === 'calendar' && (
                <button className="flex items-center space-x-3 bg-gradient-to-r from-[#ff385c] to-[#ff385c]/90 text-white px-6 py-3.5 rounded-2xl hover:from-[#ff385c]/90 hover:to-[#ff385c]/80 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  <FaPlus className="text-xl" />
                  <span className="font-medium">Add Booking</span>
                </button>
              )}
            </div>
          </div>

          {view === 'calendar' ? (
            <>
              {selectedProperty && (
                <div className="mb-10 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 flex items-center justify-between transform transition-all hover:scale-[1.01]">
                  <div className="flex items-center space-x-8">
                    <div className="relative">
                      <img 
                        src={selectedProperty.image} 
                        alt={selectedProperty.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          selectedProperty.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedProperty.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-3xl text-gray-800 mb-2">{selectedProperty.name}</h3>
                      <p className="text-gray-600 text-lg">{selectedProperty.location}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-3 hover:bg-gray-50 rounded-xl"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
              )}

              {properties.length > 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 p-8">
                  <div className="flex justify-between items-center mb-10">
                    <button
                      onClick={handlePrevMonth}
                      className="p-4 rounded-2xl hover:bg-gray-50/80 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <FaChevronLeft className="text-[#ff385c] text-2xl" />
                    </button>
                    <h2 className="text-4xl font-bold text-gray-800">
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                      onClick={handleNextMonth}
                      className="p-4 rounded-2xl hover:bg-gray-50/80 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <FaChevronRight className="text-[#ff385c] text-2xl" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-4 mb-6">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center font-semibold text-gray-600 py-4 text-lg">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-4">
                    {renderCalendarDays()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No properties available to display in calendar view.</p>
                </div>
              )}

              {selectedDate && getBookingsForDate(selectedDate).length > 0 && (
                <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-8">
                    Bookings for {selectedDate.toLocaleDateString()}
                  </h3>
                  <div className="space-y-6">
                    {getBookingsForDate(selectedDate).map((booking, index) => (
                      <div 
                        key={index} 
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01]"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-6">
                            <div className={`p-4 rounded-2xl ${
                              booking.type === 'property' 
                                ? 'bg-blue-50' 
                                : 'bg-green-50'
                            }`}>
                              {booking.type === 'property' ? (
                                <FaHome className="text-blue-500 text-2xl" />
                              ) : (
                                <FaCarSide className="text-green-500 text-2xl" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-2xl text-gray-800 mb-1">{booking.name}</h4>
                              <p className="text-gray-600 text-lg">
                                {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-5 py-2.5 rounded-xl text-sm font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div 
                  key={property.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="relative h-64">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status === 'available' ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-bold text-2xl text-gray-800 mb-2">{property.name}</h3>
                    <p className="text-gray-600 text-lg mb-6">{property.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#ff385c] font-bold text-2xl">{property.price}</span>
                      <button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setView('calendar');
                        }}
                        className="bg-gradient-to-r from-[#ff385c] to-[#ff385c]/90 text-white px-6 py-3.5 rounded-xl hover:from-[#ff385c]/90 hover:to-[#ff385c]/80 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        View Calendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 