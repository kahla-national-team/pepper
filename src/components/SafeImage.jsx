import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, fallbackSrc, showLoading = true, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        // Default placeholder SVG
        setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iI0QxRDVEM0EiLz4KPHBhdGggZD0iTTEwMCAxNDBDMTE2LjU2OSAxNDAgMTMwIDE1My40MzEgMTMwIDE3MEMxMzAgMTg2LjU2OSAxMTYuNTY5IDIwMCAxMDAgMjAwQzgzLjQzMSAyMDAgNzAgMTg2LjU2OSA3MCAxNzBDNzAgMTUzLjQzMSA4My40MzEgMTQwIDEwMCAxNDBaIiBmaWxsPSIjRDFENUQzQSIvPgo8L3N2Zz4K');
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && showLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#ff385c] rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default SafeImage; 