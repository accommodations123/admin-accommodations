import React from 'react';
import { Users } from "lucide-react";

const UsersSection = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00162d] mb-2">Users</h2>
                <p className="text-gray-600">Manage platform users and their activities.</p>
            </div>
            <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Users module data will be integrated here</p>
            </div>
        </div>
    );
};

export default UsersSection;
