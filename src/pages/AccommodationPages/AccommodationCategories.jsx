// src/AccommodationCategories.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, Plus, Search, Filter, Grid, List, X, Home, Bell, Map, Eye, Edit, Trash2, Copy, Mail, Phone, CalendarDays, Wifi, Car, Coffee, Dumbbell, Tv, Wind
} from 'lucide-react';
import PropertyList from "./PropertyList";
import PropertyDetail from "./PropertyDetail";

const API_URL = "https://accomodation.api.test.nextkinlife.live/admin/approved/approved-host-details";

// Constants for view modes
const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
  MAP: 'map'
};

const VIEWS = {
  CATEGORIES: 'categories',
  PROPERTIES: 'properties',
  DETAILS: 'details'
};

// Icon mapping for accommodation types
const TYPE_ICONS = {
  'apartment': Building,
  'house': Home,
  'studio': Building,
  'villa': Home,
  'condo': Building,
  'loft': Home,
  'cabin': Home,
  'bungalow': Home,
  'townhouse': Building,
  'guesthouse': Home,
  'hotel': Building,
  'resort': Home,
  'hostel': Building,
  'motel': Building,
  'camping': Home,
  'other': Building
};

// Category display names mapping
const CATEGORY_NAMES = {
  'apartment': 'Apartment',
  'house': 'House',
  'studio': 'Studio',
  'villa': 'Villa',
  'condo': 'Condo',
  'loft': 'Loft',
  'cabin': 'Cabin',
  'bungalow': 'Bungalow',
  'townhouse': 'Townhouse',
  'guesthouse': 'Guesthouse',
  'hotel': 'Hotel',
  'resort': 'Resort',
  'hostel': 'Hostel',
  'motel': 'Motel',
  'camping': 'Camping',
  'other': 'Other'
};

const AccommodationCategories = () => {
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'New Booking', message: 'A new booking has been made', time: '5 minutes ago', read: false },
    { id: 2, type: 'warning', title: 'Payment Pending', message: 'Payment is pending for booking #12345', time: '1 hour ago', read: false },
    { id: 3, type: 'success', title: 'Property Listed', message: 'Your new property has been successfully listed', time: '3 hours ago', read: true }
  ]);

  // State for filters
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    amenities: [],
    rating: 0,
    availability: null,
    propertySize: null,
    bedrooms: null,
    bathrooms: null
  });

  // State for form data
  const [formData, setFormData] = useState({
    listType: '',
    propertyType: '',
    guests: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: '',
    propertyName: '',
    propertyDescription: '',
    propertySize: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    pricePerNight: '',
    images: [],
    availability: []
  });

  // Ref for search input
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("admin-auth");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          }
          throw new Error("Failed to fetch accommodation data");
        }

        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error("Invalid API response format");
        }

        const grouped = {};

        json.data.forEach((item) => {
          const normalized = {
            property: {
              id: item.id,
              category_id: item.category_id,
              property_type: item.property_type,
              privacy_type: item.privacy_type,
              guests: item.guests,
              bedrooms: item.bedrooms,
              bathrooms: item.bathrooms,
              pets_allowed: item.pets_allowed,
              area: item.area,
              title: item.title || `${item.property_type} in ${item.city}`,
              description: item.description,
              country: item.country,
              city: item.city,
              address: item.address,
              photos: item.photos || [],
              video: item.video,
              amenities: item.amenities || [],
              rules: item.rules || [],
              legal_docs: item.legal_docs || [],
              price_per_hour: item.price_per_hour,
              price_per_night: item.price_per_night,
              price_per_month: item.price_per_month,
              currency: item.currency,
              status: item.status,
              createdAt: item.createdAt,
            },
            host: {
              id: item.Host?.id,
              full_name: item.Host?.full_name,
              phone: item.Host?.phone,
              email: item.Host?.User?.email,
            },
          };

          if (!grouped[item.category_id]) {
            grouped[item.category_id] = {
              id: item.category_id,
              name: CATEGORY_NAMES[item.category_id] || item.category_id.toUpperCase(),
              icon: TYPE_ICONS[item.category_id] || Building,
              description: `Browse all ${CATEGORY_NAMES[item.category_id] || item.category_id} properties`,
              properties: [],
              count: 0,
            };
          }

          grouped[item.category_id].properties.push(normalized);
          grouped[item.category_id].count += 1;
        });

        setCategories(Object.values(grouped));
        setError(null);
      } catch (err) {
        console.error("Error fetching accommodation data:", err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Navigation Handlers ---
  const handleBackToCategories = useCallback(() => {
    setView(VIEWS.CATEGORIES);
    setSelectedCategory(null);
    setSelectedProperty(null);
  }, []);

  const handleViewProperties = useCallback((category) => {
    setSelectedCategory(category);
    setView(VIEWS.PROPERTIES);
  }, []);

  const handleViewProperty = useCallback((property) => {
    setSelectedProperty(property);
    setView(VIEWS.DETAILS);
  }, []);

  const handleBackToProperties = useCallback(() => {
    setView(VIEWS.PROPERTIES);
    setSelectedProperty(null);
  }, []);

  // --- Property Management Handlers ---
  const handlePropertyFormSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    // Reset form
    setFormData({
      listType: '',
      propertyType: '',
      guests: '',
      streetAddress: '',
      city: '',
      zipCode: '',
      country: '',
      propertyName: '',
      propertyDescription: '',
      propertySize: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      pricePerNight: '',
      images: [],
      availability: []
    });
    setShowPropertyForm(false);

    // Add a success notification
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'success',
        title: 'Property Added',
        message: `${formData.propertyName} has been successfully added.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  // --- Search Handlers ---
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // --- Notification Handlers ---
  const handleNotificationClick = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // --- Filtering Logic ---
  const filteredCategories = useMemo(() =>
    categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }), [categories, searchTerm]);

  // --- Conditional Rendering based on currentView ---
  if (view === VIEWS.DETAILS && selectedProperty) {
    return <PropertyDetail property={selectedProperty} onBack={handleBackToProperties} />;
  }

  if (view === VIEWS.PROPERTIES && selectedCategory) {
    return (
      <PropertyList
        type={selectedCategory}
        onBack={handleBackToCategories}
        onPropertyClick={handleViewProperty}
      />
    );
  }

  // Default View: Categories
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#00162d" }}>Accommodation</h1>
            <p className="text-gray-600">Manage all listed accommodations.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Notification Panel */}
        <AnimatePresence>
          {notificationPanelOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed right-6 top-20 w-80 bg-white rounded-xl shadow-lg z-50 max-h-96 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold" style={{ color: "#00162d" }}>Notifications</h3>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-sm hover:underline"
                  style={{ color: "#00162d" }}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium" style={{ color: "#00162d" }}>{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#00162d" }}></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-gray-600">There are no approved properties at the moment.</p>
          </div>
        )}

        {/* Conditionally render form or header with controls */}
        <AnimatePresence>
          {showPropertyForm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#00162d" }}>Add New Property</h2>
                <button
                  onClick={() => setShowPropertyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close form"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePropertyFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form fields... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  >
                    <option value="">Select Type</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Size (sq ft)</label>
                  <input
                    type="number"
                    name="propertySize"
                    value={formData.propertySize}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
                  <textarea
                    name="propertyDescription"
                    value={formData.propertyDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['WiFi', 'Parking', 'Pool', 'Gym', 'Kitchen', 'Air Conditioning', 'Workspace', 'Pet Friendly'].map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          name="amenities"
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                            } else {
                              setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPropertyForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#00162d" }}
                  >
                    Save Property
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search accommodation types..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: "#00162d" }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${filterPanelOpen
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  style={filterPanelOpen ? { backgroundColor: "#00162d" } : {}}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode(VIEW_MODES.GRID)}
                    className={`p-2 rounded ${viewMode === VIEW_MODES.GRID ? 'bg-white shadow-sm' : ''}`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} className={viewMode === VIEW_MODES.GRID ? '' : 'text-gray-600'} style={viewMode === VIEW_MODES.GRID ? { color: "#00162d" } : {}} />
                  </button>
                  <button
                    onClick={() => setViewMode(VIEW_MODES.LIST)}
                    className={`p-2 rounded ${viewMode === VIEW_MODES.LIST ? 'bg-white shadow-sm' : ''}`}
                    aria-label="List view"
                  >
                    <List size={18} className={viewMode === VIEW_MODES.LIST ? '' : 'text-gray-600'} style={viewMode === VIEW_MODES.LIST ? { color: "#00162d" } : {}} />
                  </button>
                  <button
                    onClick={() => setViewMode(VIEW_MODES.MAP)}
                    className={`p-2 rounded ${viewMode === VIEW_MODES.MAP ? 'bg-white shadow-sm' : ''}`}
                    aria-label="Map view"
                  >
                    <Map size={18} className={viewMode === VIEW_MODES.MAP ? '' : 'text-gray-600'} style={viewMode === VIEW_MODES.MAP ? { color: "#00162d" } : {}} />
                  </button>
                </div>
                <button
                  onClick={() => setShowPropertyForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00162d" }}
                >
                  <Plus size={18} />
                  <span>Add New</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterPanelOpen && !showPropertyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6 overflow-hidden"
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#00162d" }}>Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      style={{ focusRingColor: "#00162d" }}
                      value={activeFilters.priceRange[0]}
                      onChange={(e) => setActiveFilters({ ...activeFilters, priceRange: [parseInt(e.target.value), activeFilters.priceRange[1]] })}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      style={{ focusRingColor: "#00162d" }}
                      value={activeFilters.priceRange[1]}
                      onChange={(e) => setActiveFilters({ ...activeFilters, priceRange: [activeFilters.priceRange[0], parseInt(e.target.value)] })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    value={activeFilters.rating}
                    onChange={(e) => setActiveFilters({ ...activeFilters, rating: parseInt(e.target.value) })}
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    value={activeFilters.availability || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, availability: e.target.value })}
                  >
                    <option value="">Any Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Size</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    value={activeFilters.propertySize || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, propertySize: e.target.value })}
                  >
                    <option value="">Any Size</option>
                    <option value="small">Small (&lt;1000 sq ft)</option>
                    <option value="medium">Medium (1000-2000 sq ft)</option>
                    <option value="large">Large (&gt;2000 sq ft)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    value={activeFilters.bedrooms || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, bedrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#00162d" }}
                    value={activeFilters.bathrooms || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, bathrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4+ Bathrooms</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setActiveFilters({
                    priceRange: [0, 1000],
                    amenities: [],
                    rating: 0,
                    availability: null,
                    propertySize: null,
                    bedrooms: null,
                    bathrooms: null
                  })}
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                  style={{ color: "#00162d" }}
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setFilterPanelOpen(false)}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00162d" }}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h1 className="text-4xl font-bold mt-10" style={{ color: "#00162d" }}>Accommodation Categories</h1>
        </div>

        {/* Categories Grid/List/Map */}
        {!showPropertyForm && !loading && (
          <AnimatePresence>
            {viewMode === VIEW_MODES.GRID ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-12"
              >
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="relative bg-white rounded-xl shadow-md transition-all duration-300 ease-out cursor-pointer overflow-hidden group"
                    onClick={() => handleViewProperties(category)}
                  >
                    <div className="p-6 text-center relative" style={{ backgroundColor: "#00162d" }}>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-3">
                        <category.icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      <span className="absolute top-0 right-0 bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{category.count}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                    </div>
                    {/* Fixed the duplicate className attribute here */}
                    <div
                      className="h-1 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                      style={{ backgroundColor: "#00162d", transform: "scaleX(0)", transformOrigin: "left" }}
                    ></div>
                  </motion.div>
                ))}
              </motion.div>
            ) : viewMode === VIEW_MODES.LIST ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md divide-y divide-gray-200"
              >
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewProperties(category)}
                  >
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: "#00162d" }}>
                        <category.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "#00162d" }}>{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-bold px-3 py-1 rounded-full mr-4" style={{ backgroundColor: "#00162d" }}>{category.count} Properties</span>
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
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 h-96"
              >
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <Map size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Map View</h3>
                    <p className="text-gray-500">Interactive map showing property locations</p>
                    <p className="text-sm text-gray-500 mt-2">This feature requires integration with a mapping service</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AccommodationCategories;