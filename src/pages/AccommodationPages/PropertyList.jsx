import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Search, Filter, Grid, List, Map, Heart, Bed, Bath, Users } from "lucide-react";

const VIEW_MODES = { GRID: 'grid', LIST: 'list', MAP: 'map' };

const PropertyList = ({ type, onBack, onPropertyClick }) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 10000],
    bedrooms: null,
    bathrooms: null,
    sortBy: 'recommended'
  });

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const filteredProperties = useMemo(() => {
    let filtered = type.properties.filter(item => {
      const p = item.property;
      const matchesSearch = searchTerm === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice = p.price_per_night >= activeFilters.priceRange[0] &&
        p.price_per_night <= activeFilters.priceRange[1];

      const matchesBedrooms = activeFilters.bedrooms === null ||
        p.bedrooms >= parseInt(activeFilters.bedrooms);

      const matchesBathrooms = activeFilters.bathrooms === null ||
        p.bathrooms >= parseInt(activeFilters.bathrooms);

      return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms;
    });

    switch (activeFilters.sortBy) {
      case 'priceLow':
        return filtered.sort((a, b) => a.property.price_per_night - b.property.price_per_night);
      case 'priceHigh':
        return filtered.sort((a, b) => b.property.price_per_night - a.property.price_per_night);
      case 'rating':
        return filtered.sort((a, b) => (b.property.rating || 0) - (a.property.rating || 0));
      default:
        return filtered;
    }
  }, [type.properties, searchTerm, activeFilters]);

  const handlePropertyClick = useCallback((property) => {
    onPropertyClick(property);
  }, [onPropertyClick]);

  const PropertyCard = ({ item, idx }) => {
    const p = item.property;
    const h = item.host;
    const isFavorite = favorites.includes(p.id);

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.05 }}
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => handlePropertyClick(item)}
      >
        <div className="relative">
          <img
            src={p.photos && p.photos.length > 0 ? p.photos[0] : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80"}
            alt={p.title}
            className="w-full h-48 object-cover"
          />
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(p.id);
            }}
          >
            <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <div className="flex items-center">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{p.rating || '4.6'}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{p.city}, {p.country}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed size={14} className="mr-1" />
                <span>{p.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath size={14} className="mr-1" />
                <span>{p.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{p.guests}</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-lg">₹{p.price_per_night}</span>
              <span className="text-sm text-gray-600">/night</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-800 mb-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <h1 className="text-3xl font-bold">{type.name} Properties</h1>
            <p className="text-gray-600">{type.properties.length} properties available</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterPanelOpen ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <div className="flex bg-white rounded-lg p-1">
                <button
                  onClick={() => setViewMode(VIEW_MODES.GRID)}
                  className={`p-2 rounded ${viewMode === VIEW_MODES.GRID ? 'bg-gray-200' : ''}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode(VIEW_MODES.LIST)}
                  className={`p-2 rounded ${viewMode === VIEW_MODES.LIST ? 'bg-gray-200' : ''}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode(VIEW_MODES.MAP)}
                  className={`p-2 rounded ${viewMode === VIEW_MODES.MAP ? 'bg-gray-200' : ''}`}
                >
                  <Map size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-md p-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full p-2 border rounded"
                      value={activeFilters.priceRange[0]}
                      onChange={(e) => setActiveFilters({
                        ...activeFilters,
                        priceRange: [parseInt(e.target.value), activeFilters.priceRange[1]]
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full p-2 border rounded"
                      value={activeFilters.priceRange[1]}
                      onChange={(e) => setActiveFilters({
                        ...activeFilters,
                        priceRange: [activeFilters.priceRange[0], parseInt(e.target.value)]
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={activeFilters.bedrooms || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, bedrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={activeFilters.bathrooms || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, bathrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort By</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={activeFilters.sortBy}
                    onChange={(e) => setActiveFilters({ ...activeFilters, sortBy: e.target.value })}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setActiveFilters({
                    priceRange: [0, 10000],
                    bedrooms: null,
                    bathrooms: null,
                    sortBy: 'recommended'
                  })}
                  className="px-4 py-2 border rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterPanelOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties Display */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No properties found matching your criteria</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === VIEW_MODES.GRID ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProperties.map((item, idx) => <PropertyCard item={item} idx={idx} />)}
              </motion.div>
            ) : viewMode === VIEW_MODES.LIST ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredProperties.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex"
                    onClick={() => handlePropertyClick(item)}
                  >
                    <img
                      src={item.property.photos && item.property.photos.length > 0 ? item.property.photos[0] : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80"}
                      alt={item.property.title}
                      className="w-48 h-48 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.property.title}</h3>
                        <div className="flex items-center">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{item.property.rating || '4.6'}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin size={14} className="mr-1" />
                        <span className="text-sm">{item.property.city}, {item.property.country}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed size={14} className="mr-1" />
                            <span>{item.property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath size={14} className="mr-1" />
                            <span>{item.property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            <span>{item.property.guests}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-lg">₹{item.property.price_per_night}</span>
                          <span className="text-sm text-gray-600">/night</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow-md p-8 h-96 flex items-center justify-center"
              >
                <div className="text-center">
                  <Map size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Map View</h3>
                  <p className="text-gray-500">Map view would be displayed here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PropertyList;