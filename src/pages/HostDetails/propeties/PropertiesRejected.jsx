import React, { useState, useEffect } from 'react';

const PropertyRejected = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const BASE_URL = "https://accomodation.api.test.nextkinlife.live";

    const getAuthHeaders = () => {
        const token = localStorage.getItem("admin-auth");
        if (!token) console.error("No token found");
        return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    };

    useEffect(() => {
        const fetchRejected = async () => {
            try {
                const response = await fetch(`${BASE_URL}/adminproperty/admin/properties/rejected`, {
                    method: 'GET',
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // --- DEFENSIVE DATA HANDLING ---
                if (Array.isArray(data)) {
                    setProperties(data);
                } else if (data && Array.isArray(data.data)) {
                    setProperties(data.data);
                } else if (data && Array.isArray(data.properties)) {
                    setProperties(data.properties);
                } else {
                    console.error("Unexpected API Data Format:", data);
                    setProperties([]); // Fallback
                }

            } catch (err) {
                console.error("Error fetching rejected properties:", err);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRejected();
    }, [BASE_URL]);

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading Rejected Properties...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* ADDED SAFETY CHECK: Array.isArray(properties) */}
                            {Array.isArray(properties) && properties.length > 0 ? (
                                properties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded object-cover" src={prop.photos?.[0]} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{prop.title || `Property #${prop.id}`}</div>
                                                    <div className="text-sm text-gray-500">{prop.city}, {prop.country}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{prop.Host?.full_name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate" title={prop.rejection_reason}>
                                            {prop.rejection_reason || "No reason"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedProperty(prop)}
                                                className="text-gray-600 hover:text-indigo-900 bg-gray-50 px-3 py-1 rounded hover:bg-gray-100"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No rejected properties found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- MODAL --- */}
            {selectedProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Rejected Property Details</h2>
                                <span className="text-xs text-red-600 font-bold uppercase tracking-wide">Listing Declined</span>
                            </div>
                            <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                <p className="font-bold">Rejection Reason:</p>
                                <p className="text-sm">{selectedProperty.rejection_reason || "No reason provided."}</p>
                            </div>
                            {selectedProperty.photos && selectedProperty.photos.length > 0 && (
                                <div className="mb-6">
                                    <img src={selectedProperty.photos[0]} alt="Property" className="w-full h-64 object-cover rounded-lg shadow-md grayscale" />
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.title || `Property #${selectedProperty.id}`}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{selectedProperty.description || "No description provided."}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded border grid grid-cols-3 gap-2">
                                        <div><span className="font-bold">ID:</span> {selectedProperty.id}</div>
                                        <div><span className="font-bold">User ID:</span> {selectedProperty.user_id}</div>
                                        <div><span className="font-bold">Host ID:</span> {selectedProperty.host_id}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-medium text-gray-500">Category:</span> {selectedProperty.category_id}</div>
                                        <div><span className="font-medium text-gray-500">Type:</span> {selectedProperty.property_type}</div>
                                        <div><span className="font-medium text-gray-500">Privacy:</span> {selectedProperty.privacy_type}</div>
                                        <div><span className="font-medium text-gray-500">Area:</span> {selectedProperty.area} sqft</div>
                                        <div><span className="font-medium text-gray-500">Guests:</span> {selectedProperty.guests}</div>
                                        <div><span className="font-medium text-gray-500">Bedrooms:</span> {selectedProperty.bedrooms}</div>
                                        <div><span className="font-medium text-gray-500">Bathrooms:</span> {selectedProperty.bathrooms}</div>
                                        <div><span className="font-medium text-gray-500">Pets:</span> {selectedProperty.pets_allowed}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-1">Status</h4>
                                        <p className="text-red-700 font-bold capitalize">{selectedProperty.status}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Host</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs">
                                                {selectedProperty.Host?.full_name?.charAt(0)}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{selectedProperty.Host?.full_name}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{selectedProperty.Host?.User?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6 border-t pt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                                <p className="text-sm text-gray-600">
                                    {selectedProperty.street_address}<br />
                                    {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip_code}<br />
                                    {selectedProperty.country}
                                </p>
                            </div>
                            <div className="mb-6 border-t pt-4 grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-xs text-gray-500">Per Hour</div>
                                    <div className="font-bold text-gray-700">{selectedProperty.currency} {selectedProperty.price_per_hour}</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg text-center border">
                                    <div className="text-xs text-gray-500">Per Night</div>
                                    <div className="font-bold text-gray-700">{selectedProperty.currency} {selectedProperty.price_per_night}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-xs text-gray-500">Per Month</div>
                                    <div className="font-bold text-gray-700">{selectedProperty.currency} {selectedProperty.price_per_month}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mb-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProperty.amenities?.map((a, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border">{a}</span>
                                        ))}
                                        {(!selectedProperty.amenities || selectedProperty.amenities.length === 0) && <span className="text-gray-400 text-sm">None</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Rules</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {selectedProperty.rules?.map((r, i) => <li key={i}>{r}</li>)}
                                        {(!selectedProperty.rules || selectedProperty.rules.length === 0) && <li className="text-gray-400 text-sm">None</li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 pt-4 border-t grid grid-cols-2 gap-2">
                                <p>Created: {new Date(selectedProperty.createdAt).toLocaleString()}</p>
                                <p>Updated: {new Date(selectedProperty.updatedAt).toLocaleString()}</p>
                                <p>Expires: {new Date(selectedProperty.listing_expires_at).toLocaleString()}</p>
                                <p>Deleted: {selectedProperty.is_deleted ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyRejected;