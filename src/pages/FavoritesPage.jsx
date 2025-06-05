import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch } from 'react-icons/fa';
import favoriteService from '../services/favoriteService';
import StaysCard from '../components/RENTALCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUnlike = async (favoriteId) => {
    try {
      await favoriteService.removeFavorite(favoriteId);
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      setError(err.message || 'Failed to remove from favorites');
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoriteService.getFavorites();
        setFavorites(data);
      } catch (err) {
        setError(err.message || 'Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const filteredFavorites = favorites.filter(stay => {
    const searchLower = searchQuery.toLowerCase();
    const title = stay?.title?.toLowerCase() ?? '';
    const description = stay?.description?.toLowerCase() ?? '';
    const providerName = stay?.provider_name?.toLowerCase() ?? '';

    return title.includes(searchLower) ||
           description.includes(searchLower) ||
           providerName.includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Favorites</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-[#ff385c] rounded-full flex items-center justify-center mx-auto">
              <FaHeart className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Favorite Stays</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and manage your saved accommodations. Find your perfect stay from your curated collection.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((stay) => (
              <motion.div
                key={stay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StaysCard 
                  service={stay} 
                  onUnlike={() => handleUnlike(stay.id)}
                  isFavorite={true}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <FaHeart className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching favorites found' : 'No favorites yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start exploring stays and add them to your favorites'}
            </p>
            {!searchQuery && (
              <a
                href="/stays"
                className="inline-flex items-center px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
              >
                Browse Stays
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 