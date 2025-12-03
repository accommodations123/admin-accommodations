// src/PropertyList.js

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Search, X, Filter } from 'lucide-react';

// Static data for all properties with owner information
const allProperties = {
    Student: [
        {
            id: 101,
            name: 'Boston University Dorms',
            image: 'https://images.unsplash.com/photo-1556020685-1a7c7b23e704?q=80&w=2070&auto=format&fit=crop',
            city: 'Boston',
            country: 'USA',
            propertyType: 'Dormitory',
            price: '$450',
            date: '2023-08-15',
            detailedDescription: 'A modern and vibrant student dormitory located in the heart of the city, offering a safe and convenient living experience. Close to major universities and public transport.',
            amenities: ['High-Speed Wi-Fi', 'Free Parking', 'Gym Access', 'Common Room'],
            stats: { occupancy: '85%', avgRating: 4.2 },
            owner: {
                name: 'John Smith',
                email: 'john.smith@buhousing.edu',
                phone: '+1 (617) 555-0101'
            }
        },
        {
            id: 102,
            name: 'MIT Student Housing',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
            city: 'Cambridge',
            country: 'USA',
            propertyType: 'Shared Apartment',
            price: '$650',
            date: '2023-09-01',
            detailedDescription: 'Modern shared apartments designed for student living. Each room is fully furnished with access to study lounges and a fitness center.',
            amenities: ['High-Speed Wi-Fi', 'Laundry', 'Study Lounge', 'Security'],
            stats: { occupancy: '92%', avgRating: 4.5 },
            owner: {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@mithousing.edu',
                phone: '+1 (617) 555-0102'
            }
        },
    ],
    Family: [
        {
            id: 201,
            name: 'Suburban Family Home',
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
            city: 'Austin',
            country: 'USA',
            propertyType: 'House',
            price: '$2500',
            date: 'Available Now',
            detailedDescription: 'Spacious 4-bedroom home with a large backyard, perfect for families. Located in a quiet neighborhood with good schools nearby.',
            amenities: ['Free Parking', 'Garden', 'Pet-Friendly', 'High-Speed Wi-Fi'],
            stats: { occupancy: 'N/A', avgRating: 4.8 },
            owner: {
                name: 'Michael Davis',
                email: 'michael.davis@familyhomes.com',
                phone: '+1 (512) 555-0201'
            }
        },
        {
            id: 202,
            name: 'Lakeside Family Villa',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop',
            city: 'Orlando',
            country: 'USA',
            propertyType: 'Villa',
            price: '$3200',
            date: 'Available Now',
            detailedDescription: 'A beautiful 5-bedroom villa with a private pool and lake access. Ideal for a large family vacation, close to theme parks.',
            amenities: ['Private Pool', 'Free Parking', 'Game Room', 'High-Speed Wi-Fi'],
            stats: { occupancy: 'N/A', avgRating: 4.9 },
            owner: {
                name: 'Jennifer Wilson',
                email: 'jennifer.wilson@lakesidevillas.com',
                phone: '+1 (407) 555-0301'
            }
        },
    ],
    // ... add all other property categories here
};

const PropertyList = ({ type, onBack, onPropertyClick }) => {
    const properties = allProperties[type.name] || [];

    // State for filters
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        phone: '',
        country: ''
    });

    // State for filtered properties
    const [filteredProperties, setFilteredProperties] = useState(properties);

    // Apply filters whenever filter values change
    useEffect(() => {
        let filtered = [...properties];

        if (filters.name) {
            filtered = filtered.filter(property =>
                property.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.email) {
            filtered = filtered.filter(property =>
                property.owner.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        }

        if (filters.phone) {
            filtered = filtered.filter(property =>
                property.owner.phone.includes(filters.phone)
            );
        }

        if (filters.country) {
            filtered = filtered.filter(property =>
                property.country.toLowerCase().includes(filters.country.toLowerCase())
            );
        }

        setFilteredProperties(filtered);
    }, [filters, properties]);

    // Handle filter input changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            name: '',
            email: '',
            phone: '',
            country: ''
        });
    };

    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBack} className="flex items-center gap-2 text-[#00162d] font-medium hover:text-[#cb2926] transition-colors">
                        <ArrowLeft size={20} />
                        Back to Categories
                    </button>
                    <h1 className="text-3xl font-bold text-[#00162d]">{type.name} Accommodations</h1>
                    <div className="w-24"></div> {/* Spacer for alignment */}
                </div>

                {/* Filters Section - Always Visible */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#00162d] font-medium">
                            <Filter size={18} />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-[#cb2926] text-white rounded-full">
                                    {Object.values(filters).filter(value => value !== '').length}
                                </span>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#cb2926] transition-colors"
                            >
                                <X size={16} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Filter Fields - Always Visible */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    placeholder="Search by email"
                                    value={filters.email}
                                    onChange={(e) => handleFilterChange('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by phone"
                                    value={filters.phone}
                                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by country"
                                    value={filters.country}
                                    onChange={(e) => handleFilterChange('country', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-4 text-gray-600">
                    Showing {filteredProperties.length} of {properties.length} properties
                    {hasActiveFilters && ' (filtered)'}
                </div>

                {/* Property Cards */}
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300" onClick={() => onPropertyClick(property)}>
                                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${property.image})` }}></div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-[#00162d] mb-1">{property.name}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <MapPin size={16} className="mr-1" />
                                        {property.city}, {property.country}
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl font-bold text-[#cb2926]">{property.price} <span className="text-sm text-gray-500 font-normal">/ month</span></span>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Star size={16} className="text-yellow-500" fill="currentColor" />
                                            {property.stats.avgRating}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 border-t pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Owner:</span>
                                            <span>{property.owner.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="font-medium">Email:</span>
                                            <span className="truncate ml-2">{property.owner.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-gray-500 mb-4">No properties match your filters.</div>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-[#cb2926] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyList;