// HostingApproval.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  CheckCircle, XCircle, User, Home, MapPin, Calendar, Mail, Phone, Star, Eye,
  ChevronLeft, ChevronRight, Filter, Search, RefreshCw, AlertCircle,
  DollarSign, Bed, Users, Bath, Wifi, Car, Coffee, Dumbbell, Shield,
  FileText, Video, Download
} from "lucide-react";

import AccomadationStats from "../pages/AccommodationPages/AccomadationStats";
/**
 * HostingApproval
 * Single-file React component for admin pending property approvals.
 *
 * Notes:
 * - Expects auth token stored in localStorage under "admin-auth"
 * - Pending endpoint (given): http://3.147.226.49:5000/adminproperty/pending
 * - Approve endpoint:   http://3.147.226.49:5000/adminproperty/approve/:id
 * - Reject endpoint:    http://3.147.226.49:5000/adminproperty/reject/:id
 *
 * Adjust token key or endpoints if your backend differs.
 */
const API = {
  PENDING: "http://3.147.226.49:5000/adminproperty/pending",
  APPROVE: (id) => `http://3.147.226.49:5000/adminproperty/approve/${id}`,
  REJECT: (id) => `http://3.147.226.49:5000/adminproperty/reject/${id}`,
};

const HostingApproval = () => {
  const [properties, setProperties] = useState([]); // normalized list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  const [showApprovalToast, setShowApprovalToast] = useState(false);
  const [approvedProperty, setApprovedProperty] = useState(null);

  const [showRejectionToast, setShowRejectionToast] = useState(false);
  const [rejectedProperty, setRejectedProperty] = useState(null);

  // State for viewing documents
  const [viewingDocument, setViewingDocument] = useState(null);

  const toastTimerRef = useRef(null);

  // Utility: normalize server item to a consistent property object
  const normalize = (item) => {
    // item may be { property: {...}, owner: {...} } or might already be property object
    const raw = item?.property || item;
    const owner = item?.owner || raw?.User || item?.owner || null;

    // determine id field (string)
    const rawId = raw?.id ?? raw?._id ?? raw?.property_id ?? null;
    const _id = rawId != null ? String(rawId) : Math.random().toString(36).slice(2, 9);

    // Normalize legal documents to ensure they have the proper structure
    const normalizeDocs = (docs) => {
      if (!Array.isArray(docs)) return [];

      return docs.map(doc => {
        // If doc is already a string, convert to object
        if (typeof doc === 'string') {
          return {
            url: doc,
            name: doc.split('/').pop() || 'Document',
            type: doc.includes('.') ? doc.split('.').pop().toLowerCase() : 'unknown'
          };
        }

        // If doc is an object but missing url, check other possible properties
        if (!doc.url && doc.path) {
          return {
            ...doc,
            url: doc.path,
            name: doc.name || doc.path.split('/').pop() || 'Document',
            type: doc.type || (doc.path.includes('.') ? doc.path.split('.').pop().toLowerCase() : 'unknown')
          };
        }

        // If doc is an object but missing name, extract from url
        if (doc.url && !doc.name) {
          return {
            ...doc,
            name: doc.url.split('/').pop() || 'Document',
            type: doc.type || (doc.url.includes('.') ? doc.url.split('.').pop().toLowerCase() : 'unknown')
          };
        }

        return doc;
      });
    };

    return {
      // keep server field names, but map to consistent keys
      _id,
      title: raw?.title || raw?.property_title || raw?.name || null,
      propertyType: raw?.property_type || raw?.propertyType || raw?.propertyTypeName || raw?.propertyType,
      categoryId: raw?.category_id || raw?.categoryId || null,
      privacyType: raw?.privacy_type || raw?.privacyType || null,
      guests: raw?.guests ?? raw?.guest_count ?? null,
      bedrooms: raw?.bedrooms ?? raw?.beds ?? null,
      bathrooms: raw?.bathrooms ?? raw?.baths ?? null,
      area: raw?.area ?? null,
      description: raw?.description ?? null,
      country: raw?.country ?? null,
      city: raw?.city ?? null,
      address: raw?.address ?? null,
      photos: Array.isArray(raw?.photos) ? raw.photos : (raw?.photos ? [raw.photos] : []),
      video: raw?.video ?? null,
      amenities: Array.isArray(raw?.amenities) ? raw.amenities : (raw?.amenities ? [raw.amenities] : []),
      rules: Array.isArray(raw?.rules) ? raw.rules : (raw?.rules ? [raw.rules] : []),
      legalDocs: normalizeDocs(raw?.legal_docs || raw?.legalDocs || []),
      pricePerNight: raw?.price_per_night ?? raw?.pricePerNight ?? raw?.price_per_hour ?? null,
      pricePerMonth: raw?.price_per_month ?? raw?.pricePerMonth ?? null,
      currency: raw?.currency ?? raw?.currency_code ?? "$",
      status: raw?.status ?? null,
      rejectionReason: raw?.rejection_reason ?? raw?.rejectionReason ?? null,
      createdAt: raw?.createdAt ?? raw?.created_at ?? null,
      updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
      owner: {
        id: owner?.userId ?? owner?.id ?? owner?.user_id ?? null,
        email: owner?.email ?? owner?.User?.email ?? null,
        phone: owner?.verification?.phone ?? owner?.phone ?? null,
        fullName: owner?.verification?.full_name ?? owner?.full_name ?? null,
      },
      raw,
    };
  };

  // Fetch pending properties
  useEffect(() => {
    let mounted = true;
    const fetchPending = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("admin-auth");
        const res = await axios.get(API.PENDING, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Expecting res.data.data = [ { property: {...}, owner: {...} }, ... ]
        const serverList = Array.isArray(res?.data?.data) ? res.data.data : [];

        const normalized = serverList.map(normalize);
        if (mounted) {
          setProperties(normalized);
        }
      } catch (err) {
        console.error("Fetch pending error:", err);
        if (mounted) setError("Failed to fetch pending properties.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPending();
    return () => (mounted = false);
  }, []);

  // Filters & search
  const filteredProperties = properties.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || [
      p.title,
      p.propertyType,
      p.city,
      p.country,
      p.owner?.email,
      p.owner?.fullName,
    ].some((v) => v && String(v).toLowerCase().includes(q));

    const matchesFilter = filterType === "all" || (p.propertyType && p.propertyType === filterType);

    return matchesSearch && matchesFilter;
  });

  // Unique property types for the filter select
  const propertyTypes = Array.from(new Set(properties.map((p) => p.propertyType).filter(Boolean)));

  // Approve action
  const handleApprove = async (id) => {
    if (actionInProgress) return;
    setActionInProgress(true);
    try {
      const token = localStorage.getItem("admin-auth");
      await axios.put(API.APPROVE(id), {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // find property & remove from list
      const prop = properties.find((p) => p._id === String(id));
      setApprovedProperty(prop || null);
      setShowApprovalToast(true);

      setProperties((prev) => prev.filter((p) => p._id !== String(id)));

      // auto-hide toast
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setShowApprovalToast(false);
        setApprovedProperty(null);
      }, 3000);

      if (selectedProperty && selectedProperty._id === String(id)) {
        setSelectedProperty(null);
      }
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve property. See console for details.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Open rejection modal for property id
  const handleReject = (id) => {
    const prop = properties.find((p) => p._id === String(id));
    setSelectedProperty(prop || null);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  // Confirm rejection (send reason)
  const confirmRejection = async () => {
    if (actionInProgress || !rejectionReason.trim() || !selectedProperty) return;
    setActionInProgress(true);
    try {
      const token = localStorage.getItem("admin-auth");
      await axios.put(API.REJECT(selectedProperty._id), {
        reason: rejectionReason.trim(),
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setRejectedProperty({ ...selectedProperty, rejectionReason });
      setProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));

      setShowRejectionToast(true);
      setShowRejectionModal(false);
      setRejectionReason("");
      setSelectedProperty(null);

      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setShowRejectionToast(false);
        setRejectedProperty(null);
      }, 3000);
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject property. See console for details.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Image navigation for details view
  const nextImage = () => {
    const photos = selectedProperty?.photos || [];
    if (!photos.length) return;
    setCurrentImageIndex((i) => (i + 1) % photos.length);
  };
  const prevImage = () => {
    const photos = selectedProperty?.photos || [];
    if (!photos.length) return;
    setCurrentImageIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  // Handle document viewing
  const handleViewDocument = (doc) => {
    setViewingDocument(doc);
  };

  // Function to determine document type and render appropriate view
  const renderDocumentContent = (doc) => {
    if (!doc) return <div className="p-8 text-center text-gray-500">No document data available</div>;

    const docUrl = doc.url || doc.path;
    const docType = doc.type || (docUrl && docUrl.includes('.') ? docUrl.split('.').pop().toLowerCase() : 'unknown');

    // If it's an image
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(docType)) {
      return (
        <div className="flex flex-col items-center">
          <img
            src={docUrl}
            alt={doc.name || 'Document'}
            className="max-w-full max-h-[70vh] object-contain"
          />
          <a
            href={docUrl}
            download={doc.name || 'document'}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      );
    }

    // If it's a PDF
    if (docType === 'pdf') {
      return (
        <div className="w-full h-[70vh]">
          <iframe
            src={`${docUrl}#view=FitV`}
            className="w-full h-full"
            title={doc.name || 'Document'}
          />
          <div className="mt-2 text-center">
            <a
              href={docUrl}
              download={doc.name || 'document'}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Download PDF
            </a>
          </div>
        </div>
      );
    }

    // If it's a text file or code file
    if (['txt', 'md', 'json', 'xml', 'csv', 'js', 'css', 'html', 'htm'].includes(docType)) {
      return (
        <div className="w-full h-[70vh] overflow-auto">
          <iframe
            src={docUrl}
            className="w-full h-full"
            title={doc.name || 'Document'}
          />
          <div className="mt-2 text-center">
            <a
              href={docUrl}
              download={doc.name || 'document'}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Download File
            </a>
          </div>
        </div>
      );
    }

    // For other document types, provide a download link
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FileText size={64} className="text-gray-400 mb-4" />
        <p className="text-gray-700 mb-4">Document type ({docType}) cannot be previewed</p>
        <p className="text-gray-500 mb-6">Name: {doc.name || 'Unknown'}</p>
        <a
          href={docUrl}
          download={doc.name || 'document'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          Download Document
        </a>
      </div>
    );
  };

  // Reset image index when selected property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProperty]);

  // Cleanup toast timer
  useEffect(() => {
    return () => clearTimeout(toastTimerRef.current);
  }, []);

  /* -------------------------
     Render: Loading / Error
     ------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#cb2926]" />
        <p className="mt-4 text-gray-600">Loading pending listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#cb2926] text-white rounded-lg hover:bg-[#a02120] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* -------------------------
     If no selectedProperty -> list view
     ------------------------- */
  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hosting Approval</h1>
            <p className="text-gray-600">Review and verify accommodation submissions before they go live.</p>
          </div>
          <AccomadationStats />
          {/* Search & Filter */}
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
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Filter size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <div key={property._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4">
                    {property.photos?.length > 0 ? (
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.photos[0]}
                          alt={property.title || property.propertyType || "property"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                        <Home size={40} />
                      </div>
                    )}

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {property.title || `${property.propertyType || "Property"} in ${property.city || "Unknown"}`}
                        </h3>
                        <div className="flex items-center gap-2">
                          {property.categoryId && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {property.categoryId}
                            </span>
                          )}
                          {property.privacyType && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                              {property.privacyType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {(property.city || property.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{[property.city, property.country].filter(Boolean).join(", ")}</span>
                          </div>
                        )}
                        {property.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Submitted: {new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {property.description && (
                        <p className="text-gray-700 mb-3 line-clamp-2">{property.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm mb-3">
                        {property.pricePerNight && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="text-blue-600" />
                            <span className="font-semibold">{property.currency || "₹"} {property.pricePerNight}/night</span>
                          </div>
                        )}
                        {property.guests && (
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{property.guests} guests</span>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed size={16} />
                            <span>{property.bedrooms} bedrooms</span>
                          </div>
                        )}
                      </div>

                      {property.owner?.email && (
                        <div className="flex items-center gap-2 mb-3">
                          <User size={16} className="text-gray-500" />
                          <span className="text-sm font-medium">Owner: {property.owner.fullName || property.owner.email}</span>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => handleApprove(property._id)}
                          disabled={actionInProgress}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          disabled={actionInProgress}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-gray-500 text-lg">No pending properties found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
     Details view (selectedProperty)
     ------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setSelectedProperty(null)}
            className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronLeft size={20} />
            <span>Back to List</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Property Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("verification")}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === "verification"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${activeTab === "pricing"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Pricing
                </button>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Gallery */}
                    {selectedProperty.photos?.length > 0 ? (
                      <div className="relative">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={selectedProperty.photos[currentImageIndex]}
                            alt={selectedProperty.title || selectedProperty.propertyType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedProperty.photos.length > 1 && (
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
                          {currentImageIndex + 1} / {selectedProperty.photos.length}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Home size={60} />
                      </div>
                    )}

                    {/* Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedProperty.title || `${selectedProperty.propertyType || "Property"} in ${selectedProperty.city || "Unknown"}`}
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                          {selectedProperty.propertyType && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {selectedProperty.propertyType}
                            </span>
                          )}
                          {selectedProperty.privacyType && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                              {selectedProperty.privacyType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProperty.guests && (
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Guests</p>
                              <p className="font-semibold">{selectedProperty.guests}</p>
                            </div>
                          </div>
                        )}
                        {selectedProperty.bedrooms && (
                          <div className="flex items-center gap-2">
                            <Bed size={18} className="text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Bedrooms</p>
                              <p className="font-semibold">{selectedProperty.bedrooms}</p>
                            </div>
                          </div>
                        )}
                        {selectedProperty.bathrooms && (
                          <div className="flex items-center gap-2">
                            <Bath size={18} className="text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Bathrooms</p>
                              <p className="font-semibold">{selectedProperty.bathrooms}</p>
                            </div>
                          </div>
                        )}
                        {selectedProperty.area && (
                          <div className="flex items-center gap-2">
                            <Home size={18} className="text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Area</p>
                              <p className="font-semibold">{selectedProperty.area} sq ft</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedProperty.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{selectedProperty.description}</p>
                      </div>
                    )}

                    {selectedProperty.amenities?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedProperty.amenities.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-green-500" />
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProperty.rules?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">House Rules</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {selectedProperty.rules.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    {(selectedProperty.address || selectedProperty.city || selectedProperty.country) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-700">
                          {selectedProperty.address && <>{selectedProperty.address}<br /></>}
                          {selectedProperty.city && selectedProperty.state && (
                            <>{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}<br /></>
                          )}
                          {selectedProperty.country && <>{selectedProperty.country}</>}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "verification" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText size={20} className="text-blue-600 mr-2" />
                        Documents Verification
                      </h3>
                      <div className="space-y-3">
                        {selectedProperty.legalDocs?.length > 0 ? (
                          selectedProperty.legalDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText size={18} />
                                <div>
                                  <span className="font-medium">{doc.name || `Document ${idx + 1}`}</span>
                                  {doc.type && (
                                    <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                      {doc.type.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{doc.status || "uploaded"}</span>
                                <button
                                  onClick={() => handleViewDocument(doc)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">No documents uploaded.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield size={20} className="text-blue-600 mr-2" />
                        Safety Checklist
                      </h3>
                      <div className="space-y-3">
                        {selectedProperty.safetyChecklist?.length > 0 ? (
                          selectedProperty.safetyChecklist.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Shield size={18} />
                                <span className="font-medium">{item.item || `Item ${idx + 1}`}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{item.status || "ok"}</span>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">No safety checklist items.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-6">
                    {(selectedProperty.pricePerNight || selectedProperty.pricePerMonth || selectedProperty.currency) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Base Pricing</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-700">Pricing Model</span>
                            <span className="font-medium capitalize">
                              {selectedProperty.pricePerMonth ? "monthly" : "nightly"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-700">Base Price</span>
                            <span className="font-medium text-xl">
                              {selectedProperty.currency || "$"} {selectedProperty.pricePerNight || selectedProperty.pricePerMonth}
                              {selectedProperty.pricePerMonth ? "/month" : "/night"}
                            </span>
                          </div>
                          {selectedProperty.currency && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Currency</span>
                              <span className="font-medium">{selectedProperty.currency}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(selectedProperty.cleaningFee || selectedProperty.serviceFee || selectedProperty.securityDeposit) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Additional Fees</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          {selectedProperty.cleaningFee && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Cleaning Fee</span>
                              <span className="font-medium">{selectedProperty.currency || "$"} {selectedProperty.cleaningFee}</span>
                            </div>
                          )}
                          {selectedProperty.serviceFee && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Service Fee (%)</span>
                              <span className="font-medium">{selectedProperty.serviceFee}%</span>
                            </div>
                          )}
                          {selectedProperty.securityDeposit && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Security Deposit</span>
                              <span className="font-medium">{selectedProperty.currency || "$"} {selectedProperty.securityDeposit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(selectedProperty.weeklyDiscount || selectedProperty.monthlyDiscount) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Discounts</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          {selectedProperty.weeklyDiscount && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Weekly Discount (%)</span>
                              <span className="font-medium">{selectedProperty.weeklyDiscount}%</span>
                            </div>
                          )}
                          {selectedProperty.monthlyDiscount && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Monthly Discount (%)</span>
                              <span className="font-medium">{selectedProperty.monthlyDiscount}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Video */}
            {selectedProperty.video && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Video size={20} className="text-blue-600 mr-2" />
                    Property Video
                  </h3>
                </div>
                <div className="aspect-video bg-black relative">
                  <video className="w-full h-full" controls poster={selectedProperty.photos?.[0]}>
                    <source src={selectedProperty.video} type="video/mp4" />
                    Your browser does not support video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Owner Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    {selectedProperty.owner?.fullName || "Property Owner"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedProperty.owner?.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedProperty.owner.email}</span>
                  </div>
                )}
                {selectedProperty.owner?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedProperty.owner.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Owner ID: {selectedProperty.owner?.id ?? "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Submission Details</h3>
              <div className="space-y-3">
                {selectedProperty.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submission Date:</span>
                    <span className="text-sm font-medium">{new Date(selectedProperty.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-yellow-600">Pending Approval</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Property ID:</span>
                  <span className="text-sm font-medium">#{selectedProperty._id}</span>
                </div>
                {selectedProperty.owner?.id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Owner ID:</span>
                    <span className="text-sm font-medium">{selectedProperty.owner.id}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Review Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleApprove(selectedProperty._id)}
                  disabled={actionInProgress}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={20} />
                  <span>Approve Listing</span>
                </button>
                <button
                  onClick={() => handleReject(selectedProperty._id)}
                  disabled={actionInProgress}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={20} />
                  <span>Reject Listing</span>
                </button>
                {selectedProperty.owner?.email && (
                  <button
                    onClick={() => window.open(`mailto:${selectedProperty.owner.email}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    <Mail size={20} />
                    <span>Contact Owner</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{viewingDocument.name || 'Document'}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {renderDocumentContent(viewingDocument)}
            </div>
          </div>
        </div>
      )}

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
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                disabled={!rejectionReason.trim() || actionInProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Toast */}
      {showApprovalToast && approvedProperty && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <CheckCircle size={24} />
          <div>
            <p className="font-semibold">Property Approved!</p>
            <p className="text-sm">
              {approvedProperty.title || `${approvedProperty.propertyType} in ${approvedProperty.city}`} has been approved and is now live.
            </p>
          </div>
        </div>
      )}

      {/* Rejection Toast */}
      {showRejectionToast && rejectedProperty && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <XCircle size={24} />
          <div>
            <p className="font-semibold">Property Rejected</p>
            <p className="text-sm">
              {rejectedProperty.title || `${rejectedProperty.propertyType} in ${rejectedProperty.city}`} has been rejected. Email will be sent to host.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostingApproval;