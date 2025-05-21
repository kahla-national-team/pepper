import React, { useState } from 'react';

const popularDestinations = [
  { id: 1, name: 'Oran, Algeria', type: 'City' },
  { id: 2, name: 'Algiers, Algeria', type: 'City' },
  { id: 3, name: 'Constantine, Algeria', type: 'City' },
  { id: 4, name: 'Annaba, Algeria', type: 'City' },
  { id: 5, name: 'Bejaia, Algeria', type: 'City' },
  { id: 6, name: 'Sidi Bel Abbes, Algeria', type: 'City' },
  { id: 7, name: 'Biskra, Algeria', type: 'City' },
  { id: 8, name: 'Setif, Algeria', type: 'City' },
  { id: 9, name: 'Batna, Algeria', type: 'City' },
  { id: 10, name: 'Tlemcen, Algeria', type: 'City' }
];

const DestinationInput = ({ value, onChange, onSearch }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    onChange(value);
    
    if (value.trim()) {
      const filteredSuggestions = popularDestinations.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  return (
    <div className="destination-input">
      <input
        type="text"
        value={value}
        onChange={handleDestinationChange}
        placeholder="Where are you going?"
        className="destination-field"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-name">{suggestion.name}</span>
              <span className="suggestion-type">{suggestion.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationInput; 