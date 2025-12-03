// src/PropertyDetail.js

import React from 'react';
import {
    ArrowLeft, Star, Wifi, Car, Dumbbell, Coffee, Home, Shield, Utensils, Wind, Droplets, Baby, Ban, Clock as ClockIcon, CalendarX, MapPin,
    Users, Building, Crown, Briefcase, Users2, Tent, Check, X, ChevronRight, Phone, Mail, Globe, MessageCircle, Facebook, Twitter, Instagram
} from 'lucide-react';

// Icon mapping for amenities
const amenityIcons = {
    'High-Speed Wi-Fi': Wifi, 'Free Parking': Car, 'Gym Access': Dumbbell, 'Common Room': Coffee,
    'Laundry': Home, 'Study Lounge': Users, 'Security': Shield, 'Rooftop Terrace': Building,
    'Concierge': Crown, 'Garden': Tent, 'Pet-Friendly': Baby, 'Room Service': Utensils,
    'Business Center': Briefcase, 'Meeting Rooms': Users2, 'Private Pool': Dumbbell,
    'Butler Service': Crown, 'Infinity Pool': Dumbbell, 'Spa Services': Wind,
    'Tour Desk': MapPin, 'Game Room': Coffee, 'Shared Kitchen': Utensils, 'Fire Pit': Wind,
    'Picnic Table': Coffee, 'Heated Pool': Droplets, 'Mini-Fridge': Home, 'Air Conditioning': Wind,
    'Express Check-in': ClockIcon, 'Business Lounge': Briefcase, 'BBQ Area': Wind, 'Lounge': Coffee,
    'Bike Rental': Car, 'Lockers': Shield, 'Shared Bathroom': Droplets, 'Real Bed': Home,
    'Private Deck': Building, 'Restrooms': Droplets, 'Water Access': Droplets, 'Kitchenette': Utensils,
    'In-Unit Laundry': Home, 'Continental Breakfast': Utensils, 'Cleaning Service': Home,
    'Meeting Pods': Users2, 'Personal Chef': Utensils, 'Private Beach': Tent,
};

const PropertyDetail = ({ property, onBack }) => {
    // Sample owner data - in a real app, this would come from props or API
    const ownerDetails = {
        name: "Alexandra Chen",
        title: "Property Manager",
        email: "alexandra.chen@property.com",
        phone: "+1 (555) 987-6543",
        address: "1234 Oak Street, Suite 500",
        city: property.city,
        state: "CA",
        zipCode: "90210",
        responseRate: "98%",
        responseTime: "Within 1 hour",
        memberSince: "2019",
        languages: ["English", "Spanish", "Mandarin"],
        social: {
            facebook: "alexandra.chen.property",
            twitter: "@alexchen_property",
            instagram: "alexchen_properties"
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-slate-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            </div>

            {/* Header Navigation */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-red-700 font-medium transition-all duration-300 group relative"
                        >
                            <div className="absolute inset-0 bg-red-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                            <span className="relative flex items-center gap-2 px-3 py-1">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                <span>Back to Listings</span>
                            </span>
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <Phone size={20} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <Mail size={20} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <Globe size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Hero Section with Image and Price Side by Side */}
                <section className="mb-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Side */}
                            <div className="md:w-3/5 h-64 md:h-auto relative">
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                        <span className="font-semibold text-sm">{property.stats.avgRating}</span>
                                        <span className="text-gray-500 text-xs">({Math.floor(Math.random() * 200) + 50})</span>
                                    </div>
                                </div>

                                {/* Property Title Overlay on Image */}
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium transform transition-all duration-300 hover:bg-white/30">
                                            {property.propertyType}
                                        </span>
                                        <span className="px-2 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-xs font-medium transform transition-all duration-300 hover:bg-green-600/80">
                                            Available Now
                                        </span>
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold mb-1 transform transition-all duration-500 hover:translate-x-2">{property.name}</h1>
                                    <div className="flex items-center gap-2 text-xs">
                                        <MapPin size={14} />
                                        <span>{property.city}, {property.country}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Side */}
                            <div className="md:w-2/5 p-6 bg-[#cb2926]">
                                <div className="h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-white/80 text-sm font-medium mb-2">Pricing Details</h3>
                                        <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            {property.price}
                                            <span className="text-lg font-normal text-white/80">/month</span>
                                        </div>
                                        <p className="text-white/70 text-sm mb-6">All utilities included</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                                            <span className="text-white/80 text-sm">Security Deposit</span>
                                            <span className="font-semibold text-white">{parseInt(property.price) * 0.5}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                                            <span className="text-white/80 text-sm">Available From</span>
                                            <span className="font-semibold text-white">{property.date}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                                            <span className="text-white/80 text-sm">Minimum Stay</span>
                                            <span className="font-semibold text-white">3 months</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-white/80 text-sm">Property Type</span>
                                            <span className="font-semibold text-white">{property.propertyType}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description Section */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">About This Property</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                {property.detailedDescription}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center transform transition-all duration-300 hover:scale-110">
                                    <div className="text-2xl font-bold text-red-600 mb-1">{property.stats.occupancy}</div>
                                    <div className="text-xs text-gray-500">occupancy rate</div>
                                </div>
                                <div className="text-center transform transition-all duration-300 hover:scale-110">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
                                    <div className="text-xs text-gray-500">rating</div>
                                </div>
                                <div className="text-center transform transition-all duration-300 hover:scale-110">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                                    <div className="text-xs text-gray-500">support</div>
                                </div>
                                <div className="text-center transform transition-all duration-300 hover:scale-110">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{property.amenities.length}</div>
                                    <div className="text-xs text-gray-500">amenities</div>
                                </div>
                            </div>
                        </section>

                        {/* Amenities Section */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">Premium Amenities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {property.amenities.map((amenity, index) => {
                                    const Icon = amenityIcons[amenity];
                                    return (
                                        <div key={index} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-slate-50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md">
                                            <div className="p-2 bg-gradient-to-br from-red-50 to-slate-50 rounded-lg group-hover:from-red-100 group-hover:to-slate-100 transition-all duration-300 transform group-hover:rotate-6">
                                                {Icon && <Icon size={18} className="text-red-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm">{amenity}</h3>
                                                <p className="text-xs text-gray-500">Included with your stay</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-red-600 transition-all duration-300 group-hover:translate-x-1" />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Property Rules Section */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">House Rules & Policies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
                                            <ClockIcon size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">Check-in Time</h3>
                                            <p className="text-gray-600 text-xs">3:00 PM - 9:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
                                            <CalendarX size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">Cancellation Policy</h3>
                                            <p className="text-gray-600 text-xs">24 hours notice required</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105">
                                        <div className="p-1.5 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm">
                                            <Ban size={18} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">Smoking Policy</h3>
                                            <p className="text-gray-600 text-xs">Non-smoking property</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105">
                                        <div className="p-1.5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm">
                                            <Baby size={18} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">Pet Policy</h3>
                                            <p className="text-gray-600 text-xs">
                                                {property.amenities.includes('Pet-Friendly') ? 'Pets welcome' : 'No pets allowed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Details Card */}
                        <section className="bg-gradient-to-br from-white to-red-50/30 backdrop-blur-sm rounded-xl shadow-lg p-4 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-red-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">Property Owner</h3>
                                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                    Verified
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-base font-bold text-gray-900">{ownerDetails.name}</h4>
                                <p className="text-xs text-gray-600">{ownerDetails.title}</p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105">
                                    <Phone size={16} className="text-red-600" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium text-gray-900">{ownerDetails.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105">
                                    <Mail size={16} className="text-red-600" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{ownerDetails.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105">
                                    <MapPin size={16} className="text-red-600" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {ownerDetails.address}, {ownerDetails.city}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="text-center p-2 bg-red-50 rounded-lg">
                                    <p className="text-lg font-bold text-red-600">{ownerDetails.responseRate}</p>
                                    <p className="text-xs text-gray-600">Response Rate</p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-sm font-bold text-slate-700">{ownerDetails.responseTime}</p>
                                    <p className="text-xs text-gray-600">Response Time</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <button className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
                                    <MessageCircle size={16} />
                                    <span className="text-sm font-semibold">Message</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1 p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105">
                                    <Phone size={16} />
                                    <span className="text-sm font-semibold">Call</span>
                                </button>
                            </div>

                            <div className="flex justify-center gap-2 pt-3 border-t border-gray-100">
                                <button className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300 transform hover:scale-110">
                                    <Facebook size={16} />
                                </button>
                                <button className="p-1.5 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-all duration-300 transform hover:scale-110">
                                    <Twitter size={16} />
                                </button>
                                <button className="p-1.5 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-all duration-300 transform hover:scale-110">
                                    <Instagram size={16} />
                                </button>
                            </div>
                        </section>

                        {/* Location Card */}
                        <section className="bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl shadow-lg p-4 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-slate-100/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">Location Highlights</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
                                    <MapPin size={16} className="text-red-600" />
                                    <span className="text-xs text-gray-700">Prime location in {property.city}</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
                                    <Building size={16} className="text-slate-700" />
                                    <span className="text-xs text-gray-700">Walking distance to downtown</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
                                    <Coffee size={16} className="text-red-600" />
                                    <span className="text-xs text-gray-700">Near cafes and restaurants</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
                                    <Shield size={16} className="text-slate-700" />
                                    <span className="text-xs text-gray-700">Secure neighborhood</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PropertyDetail;