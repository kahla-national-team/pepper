import React, { useState } from 'react';
import '../styles/listingcard.css';

const ListingCard = ({ listing, onToggleFavorite, isFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ensure listing.images exists, otherwise use a default array with the single image
  const images = listing?.images || [listing?.image || ''];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(listing.id);
  };

  return (
    <div className="listing-card">
      <div className="listing-image">
        <div className="carousel-container">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
            >
              <img src={image} alt={`${listing?.title || 'Listing'} - ${index + 1}`} />
            </div>
          ))}
          {images.length > 1 && (
            <>
              <button className="carousel-button prev" onClick={prevImage}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="carousel-button next" onClick={nextImage}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="carousel-dots">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => goToImage(index, e)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="listing-price">${listing?.price || 0}/night</div>
        <button 
          className={`like-button ${isFavorite ? 'liked' : ''}`} 
          onClick={handleFavoriteClick}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className="like-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="listing-content">
        <div className="listing-header">
          <h3 className="listing-title">{listing?.title || 'Untitled Listing'}</h3>
          <div className="listing-rating">
            <span className="rating">★ {listing?.rating || 0}</span>
            <span className="reviews">({listing?.reviews || 0} reviews)</span>
          </div>
        </div>
        
        <div className="listing-location">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="location-icon">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{listing?.location || 'Location not specified'}</span>
        </div>

        <button className="listing-cta">
          Book Now
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cta-icon">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ListingCard;