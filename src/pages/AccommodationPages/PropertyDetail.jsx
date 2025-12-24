// src/PropertyDetail.jsx
import React from "react";
import { ArrowLeft, MapPin, Check, X } from "lucide-react";

const PropertyDetail = ({ property, onBack }) => {
    const p = property.property;
    const h = property.host;

    return (
        <div className="min-h-screen bg-[#00162d] text-white p-6">
            <button onClick={onBack} className="mb-4 flex gap-2">
                <ArrowLeft /> Back
            </button>

            <img
                src={p.photos[0]}
                alt={p.title}
                className="w-full h-64 object-cover rounded"
            />

            <h1 className="text-2xl font-bold mt-4">{p.title}</h1>

            <p className="text-sm flex gap-1">
                <MapPin size={14} />
                {p.address}, {p.city}, {p.country}
            </p>

            <div className="mt-4 space-y-1">
                <p>Guests: {p.guests}</p>
                <p>Bedrooms: {p.bedrooms}</p>
                <p>Bathrooms: {p.bathrooms}</p>
                <p>Area: {p.area} sq ft</p>
            </div>

            <div className="mt-4">
                <p>Night: ₹{p.price_per_night}</p>
                <p>Month: ₹{p.price_per_month}</p>
                <p>Hour: ₹{p.price_per_hour}</p>
            </div>

            <div className="mt-6">
                <h3 className="font-bold">Amenities</h3>
                {p.amenities.map((a, i) => (
                    <div key={i} className="flex gap-1 text-sm">
                        <Check size={14} /> {a}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <h3 className="font-bold">Rules</h3>
                {p.rules.length === 0 ? (
                    <p>No rules specified</p>
                ) : (
                    p.rules.map((r, i) => (
                        <div key={i} className="flex gap-1 text-sm">
                            <X size={14} /> {r}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 border-t pt-4">
                <h3 className="font-bold">Host</h3>
                <p>{h.full_name}</p>
                <p>{h.email}</p>
                <p>{h.phone}</p>
            </div>
        </div>
    );
};

export default PropertyDetail;
