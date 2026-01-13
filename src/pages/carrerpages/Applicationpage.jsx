import React, { useState } from 'react';
import {
    MagnifyingGlassIcon, EyeIcon, EnvelopeIcon, CheckCircleIcon, XCircleIcon,
    UserGroupIcon, ChartBarIcon, DocumentTextIcon, ArrowDownTrayIcon, CalendarIcon,
    XMarkIcon, PaperAirplaneIcon, ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';

const ApplicationsTab = ({ applications, searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [emailTemplate, setEmailTemplate] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'reviewing': return 'bg-blue-100 text-blue-800';
            case 'shortlisted': return 'bg-purple-100 text-purple-800';
            case 'interview': return 'bg-yellow-100 text-yellow-800';
            case 'offered': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'reviewing': case 'interview': return <PendingIcon className="h-4 w-4" />;
            case 'shortlisted': case 'offered': return <CheckCircleIcon className="h-4 w-4" />;
            case 'rejected': return <XCircleIcon className="h-4 w-4" />;
            default: return <PendingIcon className="h-4 w-4" />;
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Applications Management</h2>
                <p className="text-sm text-gray-500 mt-1">Review and process job applications</p>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Search applications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                            <option value="all">All Status</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interview</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto">Export CSV</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Job Applied</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Experience</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Applied</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">{app.name.split(' ').map(n => n[0]).join('')}</div>
                                            <div className="ml-3 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                                                <div className="text-xs text-gray-500 truncate hidden lg:block">{app.email}</div>
                                                <div className="text-xs text-gray-500 lg:hidden">{app.jobTitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                        <div className="text-sm text-gray-900 truncate">{app.jobTitle}</div>
                                        <div className="text-xs text-gray-500">via {app.source}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{app.experience}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{app.score}%</div>
                                            <div className="ml-2 w-12 sm:w-16 bg-gray-200 rounded-full h-2 hidden sm:block">
                                                <div className={`h-2 rounded-full ${app.score >= 80 ? 'bg-green-500' : app.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${app.score}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>{getStatusIcon(app.status)} <span className="ml-1 hidden sm:inline">{app.status}</span></span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{app.applied}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button onClick={() => { setSelectedApplication(app); setShowApplicationModal(true); }} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"><EyeIcon className="h-4 w-4" /></button>
                                            <button onClick={() => { setSelectedApplication(app); setShowEmailModal(true); }} className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded hidden sm:block"><EnvelopeIcon className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Details Modal */}
            {showApplicationModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-gray-200 flex justify-between items-start">
                            <div className="flex items-center"><div className="bg-white bg-opacity-20 rounded-full p-2 mr-3"><DocumentTextIcon className="h-6 w-6 text-white" /></div><div><h3 className="text-xl font-semibold text-white">Application Details</h3><p className="text-blue-100 text-sm mt-1">{selectedApplication.jobTitle}</p></div></div>
                            <button onClick={() => setShowApplicationModal(false)} className="text-white hover:text-blue-100 p-1 hover:bg-white hover:bg-opacity-10 rounded-full"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="mb-6 flex items-center justify-between">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>{selectedApplication.status}</span>
                                <p className="text-sm text-gray-500">Applied on {selectedApplication.applied}</p>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" /> Candidate Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">{selectedApplication.name.split(' ').map(n => n[0]).join('')}</div>
                                        <div className="flex-1"><h5 className="text-lg font-medium text-gray-900">{selectedApplication.name}</h5><p className="text-gray-600">{selectedApplication.email}</p><p className="text-gray-600">{selectedApplication.phone}</p></div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><p className="text-sm text-gray-500">Experience</p><p className="text-base font-medium text-gray-900">{selectedApplication.experience}</p></div><div><p className="text-sm text-gray-500">Source</p><p className="text-base font-medium text-gray-900">{selectedApplication.source}</p></div></div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" /> Match Score</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200"><div className="flex items-center"><div className="text-3xl font-bold text-gray-900 mr-4">{selectedApplication.score}%</div><div className="flex-1"><div className="bg-gray-200 rounded-full h-4"><div className={`h-4 rounded-full ${selectedApplication.score >= 80 ? 'bg-green-500' : selectedApplication.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selectedApplication.score}%` }} /></div><p className="text-sm text-gray-500 mt-1">{selectedApplication.score >= 80 ? 'Excellent match' : selectedApplication.score >= 60 ? 'Good match' : 'Poor match'}</p></div></div></div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" /> Resume</h4>
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-900 font-medium mb-2">{selectedApplication.resume}</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"><ArrowDownTrayIcon className="h-4 w-4 mr-2" /> Download Resume</button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="text-sm text-gray-500">Application ID: <span className="font-medium text-gray-700">#{selectedApplication.id.toString().padStart(5, '0')}</span></div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium">Reject</button>
                                <button className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 font-medium">Schedule</button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Make Offer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-gray-200 flex justify-between items-start">
                            <div className="flex items-center"><div className="bg-white bg-opacity-20 rounded-full p-2 mr-3"><EnvelopeIcon className="h-6 w-6 text-white" /></div><div><h3 className="text-lg font-semibold text-white">Compose Email</h3><p className="text-blue-100 text-sm">To: {selectedApplication.name}</p></div></div>
                            <button onClick={() => setShowEmailModal(false)} className="text-white hover:text-blue-100 p-1 hover:bg-white hover:bg-opacity-10 rounded-full"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                            <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">{selectedApplication.name.split(' ').map(n => n[0]).join('')}</div>
                                <div className="flex-1"><p className="font-medium text-gray-900">{selectedApplication.name}</p><p className="text-sm text-gray-500">{selectedApplication.email}</p></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Subject</label><input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter email subject" /></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                                <select value={emailTemplate} onChange={(e) => { setEmailTemplate(e.target.value); if (e.target.value === 'shortlisted') { setEmailSubject(`Update on your application for ${selectedApplication.jobTitle}`); setEmailBody(`Dear ${selectedApplication.name},\n\nWe are pleased to inform you that your application for the ${selectedApplication.jobTitle} position has been shortlisted...`); } }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select a template</option>
                                    <option value="shortlisted">Shortlisted Candidate</option>
                                    <option value="interview">Interview Invitation</option>
                                    <option value="rejected">Rejection</option>
                                    <option value="custom">Custom Message</option>
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Message</label><textarea rows={10} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Type your message here..." /></div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">To: <span className="font-medium text-gray-700">{selectedApplication.email}</span></div>
                            <div className="flex space-x-3"><button onClick={() => setShowEmailModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">Cancel</button><button onClick={() => { alert('Email sent!'); setShowEmailModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"><PaperAirplaneIcon className="h-4 w-4 mr-2" /> Send Email</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsTab;