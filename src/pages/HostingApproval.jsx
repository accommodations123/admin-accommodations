import React, { useState } from 'react';
import {
  CheckCircle, XCircle, User, Home, MapPin, Calendar, Mail, Phone, Star, Eye, Play, Pause, Volume2, Clock, DollarSign, Bed, Users, Wifi, Car, Coffee, Dumbbell, Filter, Search, ChevronLeft, ChevronRight, Download, FileText, Camera, Video, Shield, AlertCircle, Check, X, Upload, Edit, Trash2, ExternalLink, CheckCheck, Sparkles, Info, Award, FileCheck, HomeIcon
} from 'lucide-react';

const HostingApproval = () => {
  // State for managing accommodations and UI
  const [pendingAccommodations, setPendingAccommodations] = useState([
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      category: "Family Accommodation",
      propertyType: "Villa",
      placeType: "Entire Place",
      area: "1800",
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      petsAllowed: true,
      status: "pending",
      submittedDate: "2023-11-15",
      price: 250,
      currency: "USD",
      pricingModel: "nightly",
      additionalFees: {
        cleaning: 50,
        service: 3,
        security: 200
      },
      discounts: {
        weekly: 10,
        monthly: 20
      },
      videoUrl: "https://example.com/video1.mp4",
      images: [
        "https://picsum.photos/seed/villa1/800/600.jpg", 
        "https://picsum.photos/seed/villa2/800/600.jpg",
        "https://picsum.photos/seed/villa3/800/600.jpg",
        "https://picsum.photos/seed/villa4/800/600.jpg",
        "https://picsum.photos/seed/villa5/800/600.jpg"
      ],
      amenities: ["WiFi", "Parking", "Pool", "Gym", "Air Conditioning", "Kitchen", "Washer", "Dryer", "TV", "Workspace"],
      description: "Stunning beachfront villa with panoramic ocean views, private pool, and modern amenities.",
      address: {
        street: "123 Ocean Drive",
        city: "Miami Beach",
        state: "FL",
        zipCode: "33139",
        country: "United States"
      },
      owner: {
        id: "owner123",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "https://picsum.photos/seed/john/200/200.jpg",
        verified: true,
        joinDate: "2022-05-10",
        listingsCount: 3,
        rating: 4.8
      },
      rules: ["No smoking", "No pets", "No parties", "Check-in after 3 PM"],
      cancellationPolicy: "Flexible",
      documents: [
        { name: "Government ID", status: "verified" },
        { name: "Property Ownership", status: "verified" },
        { name: "Insurance Certificate", status: "verified" }
      ],
      safetyChecklist: [
        { item: "Smoke Alarm", status: "verified" },
        { item: "Carbon Monoxide Detector", status: "verified" },
        { item: "Fire Extinguisher", status: "verified" },
        { item: "First Aid Kit", status: "verified" },
        { item: "Emergency Exit Route", status: "pending" }
      ]
    },
    {
      id: 2,
      title: "Cozy Downtown Apartment",
      category: "Family Accommodation",
      propertyType: "Apartment",
      placeType: "Private Room",
      area: "550",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      petsAllowed: false,
      status: "pending",
      submittedDate: "2023-11-14",
      price: 85,
      currency: "USD",
      pricingModel: "nightly",
      additionalFees: {
        cleaning: 30,
        service: 3,
        security: 100
      },
      discounts: {
        weekly: 5,
        monthly: 15
      },
      videoUrl: "https://example.com/video2.mp4",
      images: [
        "https://picsum.photos/seed/apt1/800/600.jpg", 
        "https://picsum.photos/seed/apt2/800/600.jpg",
        "https://picsum.photos/seed/apt3/800/600.jpg",
        "https://picsum.photos/seed/apt4/800/600.jpg"
      ],
      amenities: ["WiFi", "Kitchen", "Washer", "Heating"],
      description: "Modern apartment in city center, perfect for students or young professionals.",
      address: {
        street: "456 University Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02115",
        country: "United States"
      },
      owner: {
        id: "owner456",
        name: "Emily Johnson",
        email: "emily.j@example.com",
        phone: "+1 (555) 987-6543",
        avatar: "https://picsum.photos/seed/emily/200/200.jpg",
        verified: false,
        joinDate: "2023-01-22",
        listingsCount: 1,
        rating: 0
      },
      rules: ["No smoking", "Quiet hours after 10 PM"],
      cancellationPolicy: "Moderate",
      documents: [
        { name: "Government ID", status: "verified" },
        { name: "Property Ownership", status: "pending" }
      ],
      safetyChecklist: [
        { item: "Smoke Alarm", status: "verified" },
        { item: "Carbon Monoxide Detector", status: "pending" },
        { item: "Fire Extinguisher", status: "verified" },
        { item: "First Aid Kit", status: "pending" }
      ]
    },
    {
      id: 3,
      title: "Mountain Cabin Retreat",
      category: "Family Accommodation",
      propertyType: "House",
      placeType: "Entire Place",
      area: "2200",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      petsAllowed: true,
      status: "pending",
      submittedDate: "2023-11-13",
      price: 175,
      currency: "USD",
      pricingModel: "nightly",
      additionalFees: {
        cleaning: 75,
        service: 3,
        security: 300
      },
      discounts: {
        weekly: 15,
        monthly: 25
      },
      videoUrl: "https://example.com/video3.mp4",
      images: [
        "https://picsum.photos/seed/cabin1/800/600.jpg", 
        "https://picsum.photos/seed/cabin2/800/600.jpg",
        "https://picsum.photos/seed/cabin3/800/600.jpg",
        "https://picsum.photos/seed/cabin4/800/600.jpg",
        "https://picsum.photos/seed/cabin5/800/600.jpg",
        "https://picsum.photos/seed/cabin6/800/600.jpg"
      ],
      amenities: ["WiFi", "Parking", "Fireplace", "BBQ Grill", "Hot Tub"],
      description: "Spacious mountain cabin with stunning views, perfect for family getaways.",
      address: {
        street: "789 Pine Ridge Road",
        city: "Aspen",
        state: "CO",
        zipCode: "81611",
        country: "United States"
      },
      owner: {
        id: "owner789",
        name: "Michael Davis",
        email: "m.davis@example.com",
        phone: "+1 (555) 246-8135",
        avatar: "https://picsum.photos/seed/michael/200/200.jpg",
        verified: true,
        joinDate: "2021-09-15",
        listingsCount: 5,
        rating: 4.9
      },
      rules: ["No smoking inside", "Pets allowed with fee", "Check-out before 11 AM"],
      cancellationPolicy: "Strict",
      documents: [
        { name: "Government ID", status: "verified" },
        { name: "Property Ownership", status: "verified" },
        { name: "Insurance Certificate", status: "verified" },
        { name: "Pet Policy", status: "verified" }
      ],
      safetyChecklist: [
        { item: "Smoke Alarm", status: "verified" },
        { item: "Carbon Monoxide Detector", status: "verified" },
        { item: "Fire Extinguisher", status: "verified" },
        { item: "First Aid Kit", status: "verified" },
        { item: "Emergency Exit Route", status: "verified" }
      ]
    }
  ]);

  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showApprovalToast, setShowApprovalToast] = useState(false);
  const [showRejectionToast, setShowRejectionToast] = useState(false);
  const [approvedAccommodation, setApprovedAccommodation] = useState(null);
  const [rejectedAccommodation, setRejectedAccommodation] = useState(null);
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  // Filter accommodations based on search term and type
  const filteredAccommodations = pendingAccommodations.filter(acc => {
    const matchesSearch = acc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || acc.propertyType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Handle approval
  const handleApprove = (id) => {
    const accommodation = pendingAccommodations.find(acc => acc.id === id);
    setApprovedAccommodation(accommodation);
    setShowApprovalToast(true);
    
    // In a real app, this would make an API call
    setTimeout(() => {
      setPendingAccommodations(prev => 
        prev.filter(acc => acc.id !== id)
      );
      setShowApprovalToast(false);
      if (selectedAccommodation && selectedAccommodation.id === id) {
        setSelectedAccommodation(null);
      }
    }, 3000); // Keep showing toast for 3 seconds
  };

  // Handle rejection
  const handleReject = (id) => {
    setRejectionTarget(id);
    setShowRejectionModal(true);
  };

  const confirmRejection = () => {
    const accommodation = pendingAccommodations.find(acc => acc.id === rejectionTarget);
    setRejectedAccommodation({
      ...accommodation,
      rejectionReason
    });
    
    // In a real app, this would make an API call with rejection reason
    setPendingAccommodations(prev => 
      prev.map(acc => 
        acc.id === rejectionTarget 
          ? { ...acc, status: 'rejected', rejectionReason }
          : acc
      )
    );
    
    // Show rejection toast
    setShowRejectionToast(true);
    
    // Reset modal state
    setShowRejectionModal(false);
    setRejectionReason('');
    setRejectionTarget(null);
    
    // Reset selected accommodation if it was one rejected
    if (selectedAccommodation && selectedAccommodation.id === rejectionTarget) {
      setSelectedAccommodation(null);
    }
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowRejectionToast(false);
    }, 3000);
  };

  // Handle image navigation
  const nextImage = () => {
    if (selectedAccommodation) {
      setCurrentImageIndex((prev) => 
        prev === selectedAccommodation.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedAccommodation) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedAccommodation.images.length - 1 : prev - 1
      );
    }
  };

  // Render verification status badge
  const renderVerificationBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="flex items-center text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
          <CheckCircle size={12} className="mr-1" />
          Verified
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center text-xs font-medium text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full">
          <AlertCircle size={12} className="mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-xs font-medium text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
          <XCircle size={12} className="mr-1" />
          Not Verified
        </span>
      );
    }
  };

  // Render verification status icon
  const renderVerificationIcon = (status) => {
    if (status === 'verified') {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (status === 'pending') {
      return <AlertCircle size={16} className="text-yellow-500" />;
    } else {
      return <XCircle size={16} className="text-red-500" />;
    }
  };

  // If no accommodation is selected, show list
  if (!selectedAccommodation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hosting Approval</h1>
            <p className="text-gray-600">Review and verify accommodation submissions before they go live.</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by title, owner, or location..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926] focus:border-transparent" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926] focus:border-transparent bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Guest Suite">Guest Suite</option>
                </select>
                <Filter size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Pending Accommodations List */}
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {filteredAccommodations.length > 0 ? (
              filteredAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={accommodation.images[0]} 
                        alt={accommodation.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{accommodation.title}</h3>
                        <div className="flex items-center gap-2">
                          {renderVerificationBadge(accommodation.owner.verified ? 'verified' : 'pending')}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{accommodation.address.city}, {accommodation.address.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>Submitted: {accommodation.submittedDate}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{accommodation.description}</p>
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} className="text-blue-600" />
                          <span className="font-semibold">${accommodation.price}/night</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{accommodation.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed size={16} />
                          <span>{accommodation.bedrooms} bedrooms</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm font-medium">Owner: {accommodation.owner.name}</span>
                        {accommodation.owner.verified ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Not Verified</span>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedAccommodation(accommodation)}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                        <button 
                          onClick={() => handleApprove(accommodation.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button 
                          onClick={() => handleReject(accommodation.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No pending accommodations found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reason for Rejection</h3>
              <p className="text-sm text-gray-600 mb-4">This reason will be sent to the host via email.</p>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                rows="4"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRejection}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Approval Toast */}
        {showApprovalToast && approvedAccommodation && (
          <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
            <CheckCircle size={24} />
            <div>
              <p className="font-semibold">Accommodation Approved!</p>
              <p className="text-sm">{approvedAccommodation.title} has been approved and is now live.</p>
            </div>
          </div>
        )}
        
        {/* Rejection Toast */}
        {showRejectionToast && rejectedAccommodation && (
          <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
            <XCircle size={24} />
            <div>
              <p className="font-semibold">Accommodation Rejected</p>
              <p className="text-sm">{rejectedAccommodation.title} has been rejected. Email sent to host.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If an accommodation is selected, show detailed view
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => setSelectedAccommodation(null)}
            className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronLeft size={20} />
            <span>Back to List</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Accommodation Details</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === 'overview'
                    ? 'text-[#00162d] border-b-2 border-[#00162d]'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === 'verification'
                    ? 'text-[#00162d] border-b-2 border-[#00162d]'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === 'pricing'
                    ? 'text-[#00162d] border-b-2 border-[#00162d]'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Pricing
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Image Gallery */}
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={selectedAccommodation.images[currentImageIndex]} 
                          alt={selectedAccommodation.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedAccommodation.images.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {currentImageIndex + 1} / {selectedAccommodation.images.length}
                      </div>
                    </div>
                    
                    {/* Property Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAccommodation.title}</h2>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 bg-[#00162d] text-white rounded-full text-sm font-medium">
                            {selectedAccommodation.propertyType}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {selectedAccommodation.placeType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="font-semibold">{selectedAccommodation.guests}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Bedrooms</p>
                            <p className="font-semibold">{selectedAccommodation.bedrooms}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Bathrooms</p>
                            <p className="font-semibold">{selectedAccommodation.bathrooms}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="font-semibold">{selectedAccommodation.area} sq ft</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{selectedAccommodation.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedAccommodation.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check size={16} className="text-green-500" />
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">House Rules</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {selectedAccommodation.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-700">
                          {selectedAccommodation.address.street}<br />
                          {selectedAccommodation.address.city}, {selectedAccommodation.address.state} {selectedAccommodation.address.zipCode}<br />
                          {selectedAccommodation.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'verification' && (
                  <div className="space-y-6">
                    {/* Documents Verification */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText size={20} className="text-[#cb2926] mr-2" />
                        Documents Verification
                      </h3>
                      <div className="space-y-3">
                        {selectedAccommodation.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {renderVerificationIcon(doc.status)}
                              <span className="font-medium">{doc.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderVerificationBadge(doc.status)}
                              <button className="text-[#00162d] hover:text-[#cb2926]">
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Safety Checklist */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield size={20} className="text-[#cb2926] mr-2" />
                        Safety Checklist
                      </h3>
                      <div className="space-y-3">
                        {selectedAccommodation.safetyChecklist.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {renderVerificationIcon(item.status)}
                              <span className="font-medium">{item.item}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderVerificationBadge(item.status)}
                              <button className="text-[#00162d] hover:text-[#cb2926]">
                                <Edit size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Base Pricing */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Base Pricing</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700">Pricing Model</span>
                          <span className="font-medium capitalize">{selectedAccommodation.pricingModel}</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700">Base Price per Night</span>
                          <span className="font-medium text-xl">{selectedAccommodation.currency} ${selectedAccommodation.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Currency</span>
                          <span className="font-medium">{selectedAccommodation.currency}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Fees */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Additional Fees</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Cleaning Fee</span>
                          <span className="font-medium">{selectedAccommodation.currency} ${selectedAccommodation.additionalFees.cleaning}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Service Fee (%)</span>
                          <span className="font-medium">{selectedAccommodation.additionalFees.service}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Security Deposit</span>
                          <span className="font-medium">{selectedAccommodation.currency} ${selectedAccommodation.additionalFees.security}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Discounts */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Discounts</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Weekly Discount (%)</span>
                          <span className="font-medium">{selectedAccommodation.discounts.weekly}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Monthly Discount (%)</span>
                          <span className="font-medium">{selectedAccommodation.discounts.monthly}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Video Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <Video size={20} className="text-[#cb2926] mr-2" />
                  Property Video
                </h3>
              </div>
              <div className="aspect-video bg-black relative">
                <video 
                  className="w-full h-full"
                  controls
                  poster={selectedAccommodation.images[0]}
                >
                  <source src={selectedAccommodation.videoUrl} type="video/mp4" />
                  Your browser does not support video tag.
                </video>
              </div>
            </div>
          </div>
          
          {/* Right Column - Owner Info & Actions */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Owner Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={selectedAccommodation.owner.avatar} 
                  alt={selectedAccommodation.owner.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">{selectedAccommodation.owner.name}</h4>
                  <div className="flex items-center gap-2">
                    {renderVerificationBadge(selectedAccommodation.owner.verified ? 'verified' : 'pending')}
                    {selectedAccommodation.owner.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{selectedAccommodation.owner.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedAccommodation.owner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedAccommodation.owner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Member since {selectedAccommodation.owner.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedAccommodation.owner.listingsCount} listings</span>
                </div>
              </div>
            </div>
            
            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Submission Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Submission Date:</span>
                  <span className="text-sm font-medium">{selectedAccommodation.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-yellow-600">Pending Approval</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Property ID:</span>
                  <span className="text-sm font-medium">#{selectedAccommodation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Owner ID:</span>
                  <span className="text-sm font-medium">{selectedAccommodation.owner.id}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Review Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleApprove(selectedAccommodation.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle size={20} />
                  <span>Approve Listing</span>
                </button>
                <button 
                  onClick={() => handleReject(selectedAccommodation.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <XCircle size={20} />
                  <span>Reject Listing</span>
                </button>
                <button 
                  onClick={() => window.open(`mailto:${selectedAccommodation.owner.email}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <Mail size={20} />
                  <span>Contact Owner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reason for Rejection</h3>
            <p className="text-sm text-gray-600 mb-4">This reason will be sent to the host via email.</p>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
              rows="4"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Approval Toast */}
      {showApprovalToast && approvedAccommodation && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <CheckCircle size={24} />
          <div>
            <p className="font-semibold">Accommodation Approved!</p>
            <p className="text-sm">{approvedAccommodation.title} has been approved and is now live.</p>
          </div>
        </div>
      )}
      
      {/* Rejection Toast */}
      {showRejectionToast && rejectedAccommodation && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <XCircle size={24} />
          <div>
            <p className="font-semibold">Accommodation Rejected</p>
            <p className="text-sm">{rejectedAccommodation.title} has been rejected. Email sent to host.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostingApproval;