import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error
}) => {
  return (
    <div className="space-y-1">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-red-50 focus:border-transparent transition duration-200 rounded-2xl ${
          error ? 'border-red-500 ring-1 ring-red-500' : 'border-black'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput; 