// Utility functions for image handling

export const retryImageLoad = (src, maxRetries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const attemptLoad = () => {
      const img = new Image();
      
      img.onload = () => {
        resolve(src);
      };
      
      img.onerror = () => {
        retries++;
        if (retries < maxRetries) {
          setTimeout(attemptLoad, delay);
        } else {
          reject(new Error(`Failed to load image after ${maxRetries} attempts`));
        }
      };
      
      img.src = src;
    };

    attemptLoad();
  });
};

export const getImageUrl = (path, type = 'default') => {
  if (!path) return null;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's a Cloudinary URL, add error handling
  if (path.includes('cloudinary.com')) {
    return path;
  }
  
  // For local images, you might want to prepend a base URL
  return path;
};

export const getPlaceholderImage = (type = 'default') => {
  const placeholders = {
    default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iI0QxRDVEM0EiLz4KPHBhdGggZD0iTTEwMCAxNDBDMTE2LjU2OSAxNDAgMTMwIDE1My40MzEgMTMwIDE3MEMxMzAgMTg2LjU2OSAxMTYuNTY5IDIwMCAxMDAgMjAwQzgzLjQzMSAyMDAgNzAgMTg2LjU2OSA3MCAxNzBDNzAgMTUzLjQzMSA4My40MzEgMTQwIDEwMCAxNDBaIiBmaWxsPSIjRDFENUQzQSIvPgo8L3N2Zz4K',
    profile: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRDFENUQzQSIvPgo8cGF0aCBkPSJNNTAgODBDMzAgODAgMTUgNzAgMTUgNTVDMTUgNDAgMzAgMzAgNTAgMzBDNzAgMzAgODUgNDAgODUgNTVDODUgNzAgNzAgODAgNTAgODBaIiBmaWxsPSIjRDFENUQzQSIvPgo8L3N2Zz4K',
    property: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMzBDMTE2LjU2OSAzMCAxMzAgNDMuNDMxIDEzMCA2MEMxMzAgNzYuNTY5IDExNi41NjkgOTAgMTAwIDkwQzgzLjQzMSA5MCA3MCA3Ni41NjkgNzAgNjBDNzAgNDMuNDMxIDgzLjQzMSAzMCAxMDAgMzBaIiBmaWxsPSIjRDFENUQzQSIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTYuNTY5IDEwMCAxMzAgMTEzLjQzMSAxMzAgMTMwQzEzMCAxNDYuNTY5IDExNi41NjkgMTYwIDEwMCAxNjBDODMuNDMxIDE2MCA3MCAxNDYuNTY5IDcwIDEzMEM3MCAxMTMuNDMxIDgzLjQzMSAxMDAgMTAwIDEwMFoiIGZpbGw9IiNEMUQ1RDNBIi8+Cjwvc3ZnPgo='
  };
  
  return placeholders[type] || placeholders.default;
}; 