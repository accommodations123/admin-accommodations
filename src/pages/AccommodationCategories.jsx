// src/AccommodationCategories.js

import React, { useState } from 'react';
import {
  GraduationCap, Users, MapPin, Briefcase, Backpack, Calendar, Clock, Users2, Crown, Tent, Building, Plus, Search, Filter, Grid, List, X, CheckCircle, Circle
} from 'lucide-react';
import PropertyList from './PropertyList';
import PropertyDetail from './PropertyDetail';
import UnbookedProperties from './UnbookedProperties';
import BookedProperties from './PropertyList'; // Add this import

const AccommodationCategories = () => {
  // State for managing current view and selected items
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('categories'); // 'categories', 'properties', 'details', 'booked', 'unbooked'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // State for inline form
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [formData, setFormData] = useState({
    listType: '',
    propertyType: '',
    guests: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: '',
  });

  // Static data for accommodation categories
  const accommodationTypes = [
    { id: 1, name: 'Student', icon: GraduationCap, description: 'Affordable housing near educational institutions.', count: 156 },
    { id: 2, name: 'Family', icon: Users, description: 'Spacious accommodations suitable for families.', count: 243 },
    { id: 3, name: 'Traveller', icon: MapPin, description: 'Convenient locations for tourists and visitors.', count: 189 },
    { id: 4, name: 'Business', icon: Briefcase, description: 'Professional stays with business amenities.', count: 127 },
    { id: 5, name: 'Backpacker', icon: Backpack, description: 'Budget-friendly options for solo travelers.', count: 98 },
    { id: 6, name: 'Long Term', icon: Calendar, description: 'Extended stay options with monthly rates.', count: 67 },
    { id: 7, name: 'Short Term', icon: Clock, description: 'Flexible stays for days to a few weeks.', count: 234 },
    { id: 8, name: 'Sharing', icon: Users2, description: 'Shared spaces with common areas and private rooms.', count: 145 },
    { id: 9, name: 'Luxury', icon: Crown, description: 'Premium stays with high-end amenities.', count: 89 },
    { id: 10, name: 'Camping', icon: Tent, description: 'Outdoor sites for nature lovers.', count: 54 },
    { id: 11, name: 'Motel', icon: Building, description: 'Roadside motels with parking and accessibility.', count: 112 },
  ];

  // --- Navigation Handlers ---
  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedType(null);
    setSelectedProperty(null);
  };

  const handleViewProperties = (type) => {
    setSelectedType(type);
    setCurrentView('properties');
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setCurrentView('details');
  };

  const handleBackToProperties = () => {
    setCurrentView('properties');
    setSelectedProperty(null);
  };

  const handleViewBooked = (type) => {
    setSelectedType(type);
    setCurrentView('booked');
  };

  const handleViewUnbooked = (type) => {
    setSelectedType(type);
    setCurrentView('unbooked');
  };

  // --- Form Handlers ---
  const handlePropertyFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setFormData({ listType: '', propertyType: '', guests: '', streetAddress: '', city: '', zipCode: '', country: '' });
    setShowPropertyForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // --- Filtering Logic ---
  const filteredTypes = accommodationTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Conditional Rendering based on currentView ---
  if (currentView === 'details' && selectedProperty) {
    return <PropertyDetail property={selectedProperty} onBack={handleBackToProperties} />;
  }

  if (currentView === 'properties' && selectedType) {
    return <PropertyList type={selectedType} onBack={handleBackToCategories} onPropertyClick={handleViewProperty} />;
  }

  if (currentView === 'booked') {
    return <BookedProperties onBack={handleBackToCategories} type={selectedType} onPropertyClick={handleViewProperty} />;
  }

  if (currentView === 'unbooked') {
    return <UnbookedProperties onBack={handleBackToCategories} type={selectedType} onPropertyClick={handleViewProperty} />;
  }

  // Default View: Categories
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00162d] mb-2">Accommodation</h1>
          <p className="text-gray-600">Manage all listed accommodations.</p>
        </div>

        {/* Conditionally render() form or header with controls */}
        {showPropertyForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#00162d]">Add New Property</h2>
              <button onClick={() => setShowPropertyForm(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handlePropertyFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields here */}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">List Type</label><input type="text" name="listType" value={formData.listType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label><input type="text" name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Guests</label><input type="number" name="guests" value={formData.guests} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]" required /></div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowPropertyForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#cb2926] text-white rounded-lg hover:bg-opacity-90 transition-colors">Save Property</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search accommodation types..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926] focus:border-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00162d] text-white rounded-lg hover:bg-opacity-90 transition-colors"><Filter size={18} /><span>Filter</span></button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`} aria-label="Grid view"><Grid size={18} className={viewMode === 'grid' ? 'text-[#cb2926]' : 'text-gray-600'} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`} aria-label="List view"><List size={18} className={viewMode === 'list' ? 'text-[#cb2926]' : 'text-gray-600'} /></button>
              </div>
              <button onClick={() => setShowPropertyForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#cb2926] text-white rounded-lg hover:bg-opacity-90 transition-colors"><Plus size={18} /><span>Add New</span></button>
            </div>
          </div>
        )}

        {!showPropertyForm && currentView === 'categories' && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTypes.map((type) => (
                  <div key={type.id} className="relative bg-white rounded-xl shadow-md transition-all duration-300 ease-out cursor-pointer overflow-hidden group hover:shadow-2xl hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-[#00162d] to-[#002a4d] p-6 text-center relative">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-3"><type.icon className="text-white" size={32} /></div>
                      <h3 className="text-xl font-bold text-white">{type.name}</h3>
                      <span className="absolute top-0 right-0 bg-[#cb2926] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{type.count}</span>
                    </div>
                    <div className="p-5"><p className="text-gray-600 text-sm leading-relaxed">{type.description}</p></div>
                    <div className="px-5 pb-5 flex justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleViewBooked(type); }} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#00162d] hover:text-white transition-colors">
                        <CheckCircle size={14} />
                        <span className="text-sm font-medium">Booked</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleViewUnbooked(type); }} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#cb2926] hover:text-white transition-colors">
                        <Circle size={14} />
                        <span className="text-sm font-medium">Unbooked</span>
                      </button>
                    </div>
                    <div className="h-1 bg-[#cb2926] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                {filteredTypes.map((type) => (
                  <div key={type.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="flex-shrink-0 bg-gradient-to-br from-[#00162d] to-[#002a4d] p-3 rounded-lg"><type.icon className="text-white" size={24} /></div>
                      <div><h3 className="text-lg font-bold text-[#00162d]">{type.name}</h3><p className="text-gray-600 text-sm">{type.description}</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-[#cb2926] text-white text-xs font-bold px-3 py-1 rounded-full mr-4">{type.count} Properties</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewBooked(type)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#00162d] hover:text-white transition-colors">
                          <CheckCircle size={14} />
                          <span className="text-sm font-medium">Booked</span>
                        </button>
                        <button onClick={() => handleViewUnbooked(type)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#cb2926] hover:text-white transition-colors">
                          <Circle size={14} />
                          <span className="text-sm font-medium">Unbooked</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AccommodationCategories;