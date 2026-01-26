import React from 'react';
import { Briefcase } from "lucide-react";

const CareersSection = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00162d] mb-2">Careers</h2>
                <p className="text-gray-600">Manage job listings and applications.</p>
            </div>
            <div className="text-center py-12 text-gray-500">
                <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Careers module data will be integrated here</p>
            </div>
        </div>
    );
};

export default CareersSection;
