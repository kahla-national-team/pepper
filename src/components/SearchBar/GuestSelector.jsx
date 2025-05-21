import React from 'react';

const GuestSelector = ({ guests, onGuestChange }) => {
  const handleGuestCount = (e, type, operation) => {
    e.stopPropagation();
    const newGuests = { ...guests };
    
    if (operation === 'input') {
      const value = parseInt(e.target.value) || 0;
      newGuests[type] = Math.max(0, value);
    } else {
      newGuests[type] = operation === 'add' ? newGuests[type] + 1 : Math.max(0, newGuests[type] - 1);
    }

    onGuestChange(newGuests);
  };

  return (
    <div className="guest-selector">
      <div className="guest-type">
        <span>Adults</span>
        <div className="guest-controls">
          <button onClick={(e) => handleGuestCount(e, 'adults', 'subtract')}>-</button>
          <input
            type="number"
            value={guests.adults}
            onChange={(e) => handleGuestCount(e, 'adults', 'input')}
            min="0"
          />
          <button onClick={(e) => handleGuestCount(e, 'adults', 'add')}>+</button>
        </div>
      </div>
      <div className="guest-type">
        <span>Children</span>
        <div className="guest-controls">
          <button onClick={(e) => handleGuestCount(e, 'children', 'subtract')}>-</button>
          <input
            type="number"
            value={guests.children}
            onChange={(e) => handleGuestCount(e, 'children', 'input')}
            min="0"
          />
          <button onClick={(e) => handleGuestCount(e, 'children', 'add')}>+</button>
        </div>
      </div>
      <div className="guest-type">
        <span>Babies</span>
        <div className="guest-controls">
          <button onClick={(e) => handleGuestCount(e, 'babies', 'subtract')}>-</button>
          <input
            type="number"
            value={guests.babies}
            onChange={(e) => handleGuestCount(e, 'babies', 'input')}
            min="0"
          />
          <button onClick={(e) => handleGuestCount(e, 'babies', 'add')}>+</button>
        </div>
      </div>
    </div>
  );
};

export default GuestSelector; 