
import React, { useState } from 'react';
import {
    BriefcaseIcon,
    MapPinIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    PlusIcon,
    XMarkIcon,
    XCircleIcon, // <--- Make sure there is a comma here if there are more imports below
    ChartBarIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    SparklesIcon,
    HeartIcon,
    UserGroupIcon,
    ClockIcon,
    CalendarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const JobsTab = ({ jobs, searchTerm, setSearchTerm }) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircleIcon className="h-4 w-4" />;
            case 'draft': return <ClockIcon className="h-4 w-4" />;
            case 'closed': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewJob = (job) => {
        setSelectedJob(job);
        setShowJobDetailsModal(true);
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Postings Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor all job postings</p>
                </div>
                <button
                    onClick={() => setShowJobModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm w-full sm:w-auto justify-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> New Job
                </button>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                        <option>All Departments</option>
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Design</option>
                        <option>Marketing</option>
                        <option>Analytics</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Department</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Posted</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs sm:max-w-none">{job.title}</div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                            <span className="truncate">{job.location} • {job.type}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 sm:hidden mt-1">{job.department}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{job.department}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                                            {getStatusIcon(job.status)} <span className="ml-1">{job.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.applicants}</div>
                                        <div className="text-xs text-gray-500">{job.views} views</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{job.posted}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button onClick={() => handleViewJob(job)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"><EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Job Details Modal */}
            {showJobDetailsModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-gray-200 flex justify-between items-start">
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3"><BriefcaseIcon className="h-6 w-6 text-white" /></div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Job Details</h3>
                                    <p className="text-blue-100 text-sm mt-1">{selectedJob.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowJobDetailsModal(false)} className="text-white hover:text-blue-100 p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="mb-6 flex items-center justify-between">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedJob.status)}`}>{selectedJob.status}</span>
                                <p className="text-sm text-gray-500">Posted on {selectedJob.posted}</p>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" /> Job Overview</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Location', val: selectedJob.location, icon: MapPinIcon },
                                        { label: 'Job Type', val: selectedJob.type, icon: BriefcaseIcon },
                                        { label: 'Salary', val: selectedJob.salary, icon: DocumentTextIcon },
                                        { label: 'Experience', val: selectedJob.experience, icon: ClockIcon },
                                        { label: 'Deadline', val: selectedJob.deadline, icon: CalendarIcon },
                                        { label: 'Applicants', val: selectedJob.applicants, icon: UserGroupIcon },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center">
                                                <item.icon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-500">{item.label}</p>
                                                    <p className="text-sm font-medium text-gray-900 truncate">{item.val}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" /> Job Description</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200"><p className="text-gray-700">{selectedJob.description}</p></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" /> Requirements</h4>
                                    <ul className="space-y-2">{selectedJob.requirements.map((req, i) => <li key={i} className="flex items-start text-gray-700"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />{req}</li>)}</ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-blue-600" /> Responsibilities</h4>
                                    <ul className="space-y-2">{selectedJob.responsibilities.map((resp, i) => <li key={i} className="flex items-start text-gray-700"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />{resp}</li>)}</ul>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><HeartIcon className="h-5 w-5 mr-2 text-blue-600" /> Benefits</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.benefits.map((benefit, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{benefit}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="text-sm text-gray-500">Job ID: <span className="font-medium text-gray-700">#{selectedJob.id.toString().padStart(5, '0')}</span></div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Edit Job</button>
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">View Applicants</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Job Modal */}
            {showJobModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-gray-200 flex justify-between items-start">
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3"><PlusIcon className="h-6 w-6 text-white" /></div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Create New Job Posting</h3>
                                    <p className="text-blue-100 text-sm mt-1">Post a new job opportunity</p>
                                </div>
                            </div>
                            <button onClick={() => setShowJobModal(false)} className="text-white hover:text-blue-100 p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <form className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Senior Frontend Developer" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Department *</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option>Engineering</option><option>Product</option><option>Design</option><option>Marketing</option></select></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Location *</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option>Entry</option><option>Mid</option><option>Senior</option></select></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Description *</label><textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        </form>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-4">
                            <button onClick={() => setShowJobModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Create Job</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsTab;