import { userService } from '../services/userService';

// Cache for owner information to avoid repeated API calls
const ownerCache = new Map();

/**
 * Fetch owner information by owner ID
 * @param {number|string} ownerId - The owner's user ID
 * @returns {Promise<Object>} Owner information object
 */
export const fetchOwnerInfo = async (ownerId) => {
  try {
    // Check cache first
    if (ownerCache.has(ownerId)) {
      return ownerCache.get(ownerId);
    }

    // Fetch from API
    const ownerInfo = await userService.getOwnerInfo(ownerId);
    
    // Cache the result
    ownerCache.set(ownerId, ownerInfo);
    
    return ownerInfo;
  } catch (error) {
    console.error('Error fetching owner info:', error);
    // Return default owner info if fetch fails
    const defaultInfo = {
      id: ownerId,
      username: 'Unknown User',
      full_name: 'Unknown User',
      profile_image: '/placeholder-avatar.png',
      email: null
    };
    
    // Cache the default info to avoid repeated failed requests
    ownerCache.set(ownerId, defaultInfo);
    
    return defaultInfo;
  }
};

/**
 * Enhance service data with owner information
 * @param {Object} service - Service object
 * @returns {Promise<Object>} Enhanced service object
 */
export const enhanceServiceWithOwner = async (service) => {
  if (!service.owner_id) {
    return service;
  }

  // If provider info already exists, return as is
  if (service.provider && service.provider.name) {
    return service;
  }

  try {
    const ownerInfo = await fetchOwnerInfo(service.owner_id);
    
    return {
      ...service,
      provider: {
        id: ownerInfo.id,
        name: ownerInfo.full_name,
        username: ownerInfo.username,
        image: ownerInfo.profile_image,
        rating: 5.0, // Default rating
        reviewCount: 0 // Default review count
      }
    };
  } catch (error) {
    console.error('Error enhancing service with owner:', error);
    return service;
  }
};

/**
 * Enhance rental data with owner information
 * @param {Object} rental - Rental object
 * @returns {Promise<Object>} Enhanced rental object
 */
export const enhanceRentalWithOwner = async (rental) => {
  if (!rental.owner_id) {
    return rental;
  }

  // If provider info already exists, return as is
  if (rental.provider && rental.provider.name) {
    return rental;
  }

  try {
    const ownerInfo = await fetchOwnerInfo(rental.owner_id);
    
    return {
      ...rental,
      provider: {
        id: ownerInfo.id,
        name: ownerInfo.full_name,
        username: ownerInfo.username,
        image: ownerInfo.profile_image,
        rating: 5.0, // Default rating
        reviewCount: 0 // Default review count
      }
    };
  } catch (error) {
    console.error('Error enhancing rental with owner:', error);
    return rental;
  }
};

/**
 * Enhance multiple services with owner information
 * @param {Array} services - Array of service objects
 * @returns {Promise<Array>} Array of enhanced service objects
 */
export const enhanceServicesWithOwner = async (services) => {
  if (!Array.isArray(services)) {
    return services;
  }

  const enhancedServices = await Promise.all(
    services.map(service => enhanceServiceWithOwner(service))
  );

  return enhancedServices;
};

/**
 * Enhance multiple rentals with owner information
 * @param {Array} rentals - Array of rental objects
 * @returns {Promise<Array>} Array of enhanced rental objects
 */
export const enhanceRentalsWithOwner = async (rentals) => {
  if (!Array.isArray(rentals)) {
    return rentals;
  }

  const enhancedRentals = await Promise.all(
    rentals.map(rental => enhanceRentalWithOwner(rental))
  );

  return enhancedRentals;
};

/**
 * Clear the owner cache
 */
export const clearOwnerCache = () => {
  ownerCache.clear();
};

/**
 * Get cached owner info
 * @param {number|string} ownerId - The owner's user ID
 * @returns {Object|null} Cached owner information or null if not cached
 */
export const getCachedOwnerInfo = (ownerId) => {
  return ownerCache.get(ownerId) || null;
}; 