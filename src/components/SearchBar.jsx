import { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = () => {
  const [destination, setDestination] = useState('');
  const [editingDestination, setEditingDestination] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, babies: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const guestRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const checkInCalRef = useRef(null);
  const checkOutCalRef = useRef(null);

  // Hide check-in calendar when clicking outside
  useEffect(() => {
    if (!showCheckInPicker) return;
    function handleClickOutside(e) {
      if (
        checkInRef.current &&
        !checkInRef.current.contains(e.target) &&
        checkInCalRef.current &&
        !checkInCalRef.current.contains(e.target)
      ) {
        setShowCheckInPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCheckInPicker]);

  // Hide check-out calendar when clicking outside
  useEffect(() => {
    if (!showCheckOutPicker) return;
    function handleClickOutside(e) {
      if (
        checkOutRef.current &&
        !checkOutRef.current.contains(e.target) &&
        checkOutCalRef.current &&
        !checkOutCalRef.current.contains(e.target)
      ) {
        setShowCheckOutPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCheckOutPicker]);

  // Guest selector outside click
  function handleClickOutsideGuest(e) {
    if (guestRef.current && !guestRef.current.contains(e.target)) {
      setShowGuestSelector(false);
      document.removeEventListener('mousedown', handleClickOutsideGuest);
    }
  }

  function openGuestSelector() {
    setShowGuestSelector(true);
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutsideGuest);
    }, 0);
  }

  function handleSearch() {
    alert(
      `Destination: ${destination || 'Not set'}\nCheck in: ${checkIn ? checkIn.toLocaleDateString() : 'Not set'}\nCheck out: ${checkOut ? checkOut.toLocaleDateString() : 'Not set'}\nGuests: ${guests.adults} adults, ${guests.children} children, ${guests.babies} babies`
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2 flex items-center shadow-md rounded-full bg-white p-2">
        {/* Set destination */}
        <div className="flex-1 flex items-center justify-center h-12 cursor-pointer select-none"
             onClick={() => setEditingDestination(true)}>
          {editingDestination ? (
            <input
              autoFocus
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              onBlur={() => setEditingDestination(false)}
              placeholder="Set destination"
              className="w-full bg-transparent text-sm text-gray-700 focus:outline-none px-1"
            />
          ) : (
            <span className="text-sm text-gray-400">
              {destination ? destination : 'Set destination'}
            </span>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Check in */}
        <div className="flex-1 flex items-center justify-center h-12 cursor-pointer select-none"
             onClick={() => setShowCheckInPicker(true)}
             ref={checkInRef}>
          <span className="text-sm text-gray-400">
            {checkIn ? checkIn.toLocaleDateString() : 'Check in'}
          </span>
          <div
            ref={checkInCalRef}
            className={`absolute left-1/3 top-14 z-20 transition-all duration-200 ${showCheckInPicker ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ minWidth: 220 }}
            onClick={e => e.stopPropagation()}
          >
            {showCheckInPicker && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <DatePicker
                  selected={checkIn}
                  onChange={date => {
                    setCheckIn(date);
                    setShowCheckInPicker(false);
                  }}
                  inline
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Check out */}
        <div className="flex-1 flex items-center justify-center h-12 cursor-pointer select-none"
             onClick={() => setShowCheckOutPicker(true)}
             ref={checkOutRef}>
          <span className="text-sm text-gray-400">
            {checkOut ? checkOut.toLocaleDateString() : 'Check out'}
          </span>
          <div
            ref={checkOutCalRef}
            className={`absolute left-1/2 top-14 z-20 transition-all duration-200 ${showCheckOutPicker ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ minWidth: 220 }}
            onClick={e => e.stopPropagation()}
          >
            {showCheckOutPicker && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <DatePicker
                  selected={checkOut}
                  onChange={date => {
                    setCheckOut(date);
                    setShowCheckOutPicker(false);
                  }}
                  inline
                  minDate={checkIn || new Date()}
                />
              </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Guests */}
        <div className="flex-1 flex flex-col items-start justify-center h-12 cursor-pointer select-none"
             onClick={openGuestSelector}
             ref={guestRef}>
          <span className="text-sm font-bold text-gray-700 leading-tight">Who ?</span>
          <span className="text-xs text-gray-400 -mt-0.5">Add guests</span>
          {showGuestSelector && (
            <div className="absolute top-14 right-20 z-20 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 min-w-[180px]">
              {['adults', 'children', 'babies'].map(type => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize text-sm text-gray-500">{type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-base"
                      onClick={e => {
                        e.stopPropagation();
                        setGuests(g => ({ ...g, [type]: Math.max(0, g[type] - 1) }));
                      }}
                      disabled={guests[type] === 0}
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm">{guests[type]}</span>
                    <button
                      className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-base"
                      onClick={e => {
                        e.stopPropagation();
                        setGuests(g => ({ ...g, [type]: g[type] + 1 }));
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          className="ml-2 w-10 h-10 rounded-full bg-[#D10F0F] flex items-center justify-center"
          aria-label="Search"
          onClick={handleSearch}
        >
          <FaSearch className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
