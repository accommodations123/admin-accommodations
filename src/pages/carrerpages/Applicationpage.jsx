import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    MagnifyingGlassIcon, EyeIcon, EnvelopeIcon, CheckCircleIcon, XCircleIcon,
    UserGroupIcon, DocumentTextIcon, ArrowDownTrayIcon,
    XMarkIcon, PaperAirplaneIcon, ClockIcon as PendingIcon,
    ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';

/* =====================================================
   AXIOS INSTANCE & BASE URL CONFIGURATION
===================================================== */
const api = axios.create({
    baseURL: "https://accomodation.api.test.nextkinlife.live",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin-auth");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* =====================================================
   COMPONENT
===================================================== */
const ApplicationsTab = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
    // State
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // 5 Job Titles (Groups) per page

    // Expand/Collapse state for Job Groups
    const [expandedJobs, setExpandedJobs] = useState({});

    // Modal States
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // Email States
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [emailTemplate, setEmailTemplate] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    // Helper: Show Notification Toast
    const showNotification = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Reset page when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    /* =====================================================
       HELPER: DATA FORMATTER
    ===================================================== */
    const formatApplicationData = (raw) => {
        const candidateInfo = raw.candidate || raw.user || raw.applicant || {};
        const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

        let name = '';
        if (raw.name) name = raw.name;
        else if (candidateInfo.name) name = candidateInfo.name;
        if (!name) {
            const firstName = raw.first_name || candidateInfo.first_name || getNestedValue(raw, 'profile.first_name') || '';
            const lastName = raw.last_name || candidateInfo.last_name || getNestedValue(raw, 'profile.last_name') || '';
            if (firstName || lastName) name = `${firstName} ${lastName}`.trim();
        }
        if (!name) {
            name = raw.full_name || candidateInfo.full_name || raw.display_name || candidateInfo.display_name || raw.username || candidateInfo.username || '';
        }
        if (!name) {
            const email = raw.email || candidateInfo.email || '';
            name = email ? email.split('@')[0] : `Applicant #${raw.id || 'Unknown'}`;
        }

        let experienceValue = null;
        const experienceFields = ['experience', 'total_experience', 'exp', 'experience_years', 'work_experience', 'years_of_experience'];
        for (const field of experienceFields) {
            if (raw[field] !== undefined) { experienceValue = raw[field]; break; }
            if (candidateInfo[field] !== undefined) { experienceValue = candidateInfo[field]; break; }
        }

        let displayExp = 'N/A';
        if (experienceValue !== null && experienceValue !== undefined && experienceValue !== '') {
            if (Array.isArray(experienceValue)) {
                if (experienceValue.length > 0) displayExp = `${experienceValue.length} Position${experienceValue.length !== 1 ? 's' : ''}`;
            } else if (typeof experienceValue === 'object') {
                const val = parseFloat(experienceValue.years || experienceValue.total || experienceValue.duration || 0);
                displayExp = !isNaN(val) ? `${val} year${val !== 1 ? 's' : ''}` : 'N/A';
            } else {
                const expString = String(experienceValue).trim();
                const matches = expString.match(/(\d+(?:\.\d+)?)\s*(?:year|years|yr|yrs)/i);
                if (matches) displayExp = `${matches[1]} year${parseFloat(matches[1]) !== 1 ? 's' : ''}`;
                else {
                    const num = parseFloat(expString);
                    displayExp = (!isNaN(num) && num >= 0 && num <= 50) ? `${num} year${num !== 1 ? 's' : ''}` : 'N/A';
                }
            }
        }

        const email = raw.email || candidateInfo.email || getNestedValue(raw, 'contact.email') || 'N/A';
        const phone = raw.phone || candidateInfo.phone || getNestedValue(raw, 'contact.phone') || 'N/A';

        let jobTitle = '';
        if (raw.job && typeof raw.job === 'object') {
            jobTitle = raw.job.title || raw.job.name || raw.job.position || '';
        } else {
            jobTitle = raw.job_title || raw.job || raw.position || raw.role || '';
        }
        if (!jobTitle && raw.job_id) jobTitle = `Job ID: ${raw.job_id}`;

        const resume = raw.resume_url || raw.resume || raw.cv || raw.cv_url || '';
        const applied = raw.createdAt || raw.created_at || raw.application_date || raw.date_applied || new Date().toISOString();

        return {
            ...raw,
            name: name,
            email: email,
            jobTitle: jobTitle || 'Unknown Job',
            resume: resume,
            applied: applied,
            experience: displayExp,
            score: raw.score || 0,
            phone: phone,
            source: raw.source || 'Direct'
        };
    };

    /* =====================================================
       FETCH APPLICATIONS
    ===================================================== */
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const endpoint = "/carrer/admin/applications?t=" + new Date().getTime();
                const res = await api.get(endpoint);

                let rawData = [];
                if (res.data.applications && Array.isArray(res.data.applications)) rawData = res.data.applications;
                else if (Array.isArray(res.data)) rawData = res.data;
                else if (res.data.data && Array.isArray(res.data.data)) rawData = res.data.data;

                const formattedData = rawData.map(formatApplicationData);
                setApplications(formattedData);

            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.response?.data?.message || err.message);
                showNotification("Failed to load data", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    /* =====================================================
       DATA GROUPING LOGIC (Group by Job Title)
    ===================================================== */
    // 1. Filter the flat list first
    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const searchLower = searchTerm.toLowerCase();
            const name = (app.name || '').toLowerCase();
            const jobTitle = (app.jobTitle || '').toLowerCase(); // Job Applied search
            const email = (app.email || '').toLowerCase();

            // Matches if search is in Name, Job Title, OR Email
            const matchesSearch = name.includes(searchLower) || jobTitle.includes(searchLower) || email.includes(searchLower);
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [applications, searchTerm, statusFilter]);

    // 2. Group the filtered list by Job Title
    const groupedApplications = useMemo(() => {
        const groups = filteredApplications.reduce((acc, app) => {
            const title = app.jobTitle || 'Unknown Job';
            if (!acc[title]) {
                acc[title] = [];
            }
            acc[title].push(app);
            return acc;
        }, {});

        // Return sorted keys (A-Z) and the groups
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredApplications]);

    /* =====================================================
       PAGINATION LOGIC
    ===================================================== */
    const totalGroups = groupedApplications.length;
    const totalPages = Math.ceil(totalGroups / itemsPerPage);

    // Slice the groups based on current page
    const paginatedGroups = groupedApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */
    const fetchApplicationDetails = async (id) => {
        setModalLoading(true);
        setShowApplicationModal(true);
        setSelectedApplication(null);
        try {
            const res = await api.get("/carrer/admin/applications/" + id);
            const formatted = formatApplicationData(res.data.application || res.data.data || res.data);
            setSelectedApplication(formatted);
        } catch (err) {
            showNotification("Failed to load details", "error");
            setShowApplicationModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const updateStatus = async (appId, newStatus) => {
        const originalApps = [...applications];
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        setShowApplicationModal(false);

        try {
            await api.patch(`/carrer/admin/applications/${appId}/status`, { status: newStatus });
            showNotification(`Status updated to ${newStatus}`);
        } catch (err) {
            setApplications(originalApps);
            showNotification("Failed to update status", "error");
        }
    };

    const handleExportCSV = () => {
        if (filteredApplications.length === 0) return showNotification("No data to export", "error");
        const headers = ["Name", "Email", "Job Title", "Status", "Experience", "Applied Date"];
        const csvRows = [headers.join(",")];
        filteredApplications.forEach(app => {
            csvRows.push([
                `"${(app.name || '').replace(/"/g, '""')}"`,
                `"${app.email || ''}"`,
                `"${app.jobTitle || ''}"`,
                `"${app.status || ''}"`,
                app.experience || 'N/A',
                app.applied ? new Date(app.applied).toLocaleDateString() : 'N/A'
            ].join(","));
        });
        const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'applications.csv';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const handleSendEmail = async () => {
        if (!emailSubject || !emailBody) return showNotification("Please fill in email details", "error");
        setSendingEmail(true);
        try {
            await api.post(`/carrer/applications/${selectedApplication.id}/notify`, {
                subject: emailSubject, message: emailBody, template: emailTemplate,
                status: emailTemplate === 'hired' ? 'offer' : (emailTemplate === 'rejected' ? 'rejected' : null)
            });
            showNotification("Email sent successfully!");
            setShowEmailModal(false);
        } catch (err) {
            showNotification("Failed to send email", "error");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleTemplateChange = (e) => {
        const tmpl = e.target.value;
        setEmailTemplate(tmpl);
        const cName = selectedApplication.name;
        const jTitle = selectedApplication.jobTitle;
        if (tmpl === 'hired') { setEmailSubject(`Offer for ${jTitle}`); setEmailBody(`Dear ${cName},\n\nCongratulations! We are delighted to offer you the role of ${jTitle}...\n\nBest regards,\nHiring Team`); }
        else if (tmpl === 'interview') { setEmailSubject(`Interview Invitation: ${jTitle}`); setEmailBody(`Dear ${cName},\n\nWe would like to invite you for an interview...\n\nBest regards,\nHiring Team`); }
        else if (tmpl === 'rejected') { setEmailSubject(`Update: Application for ${jTitle}`); setEmailBody(`Dear ${cName},\n\nThank you for your interest. We regret to inform you...\n\nBest regards,\nHiring Team`); }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'reviewing': case 'viewed': return 'bg-blue-100 text-blue-800';
            case 'shortlisted': return 'bg-purple-100 text-purple-800';
            case 'interview': return 'bg-yellow-100 text-yellow-800';
            case 'offered': case 'hired': case 'offer': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'reviewing': case 'viewed': case 'interview': return <PendingIcon className="h-4 w-4" />;
            case 'shortlisted': case 'offered': case 'hired': case 'offer': return <CheckCircleIcon className="h-4 w-4" />;
            case 'rejected': return <XCircleIcon className="h-4 w-4" />;
            default: return <PendingIcon className="h-4 w-4" />;
        }
    };

    /* =====================================================
       JSX
    ===================================================== */
    return (
        <div className="relative">
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
                    {notification.msg}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Applications by Job</h2>
                <p className="text-sm text-gray-500 mt-1">Manage applications grouped by position</p>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Job Title, Name or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                            <option value="all">All Status</option>
                            <option value="viewed">Viewed</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interview</option>
                            <option value="hired">Hired</option>
                            <option value="offer">Offered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto flex items-center justify-center gap-2">
                        <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* JOB GROUPS LIST */}
            <div className="space-y-6 min-h-[500px]">
                {loading ? (
                    <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">Loading applications...</div>
                ) : error ? (
                    <div className="bg-white p-10 rounded-lg shadow text-center text-red-500">Error: {error}</div>
                ) : paginatedGroups.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">No applications found matching your criteria.</div>
                ) : (
                    paginatedGroups.map(([title, apps]) => {
                        const isExpanded = expandedJobs[title] !== false; // Default expanded

                        return (
                            <div key={title} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                {/* GROUP HEADER */}
                                <div
                                    onClick={() => setExpandedJobs((prev) => ({ ...prev, [title]: !prev[title] }))}
                                    className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {apps.length} Applicants
                                        </span>
                                    </div>
                                    <button className="text-gray-500 hover:text-gray-700">
                                        {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* GROUP TABLE */}
                                {isExpanded && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Applied</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {apps.map((app) => (
                                                    <tr key={app.id} className="hover:bg-gray-50">
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                                                                    {app.name ? app.name.split(' ').map(n => n[0]).join('') : 'NA'}
                                                                </div>
                                                                <div className="ml-3 min-w-0 flex-1">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                                                                    <div className="text-xs text-gray-500 truncate hidden lg:block">{app.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <p className="text-sm font-medium text-gray-900">{app.experience}</p>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                                                {getStatusIcon(app.status)} <span className="ml-1 hidden sm:inline">{app.status}</span>
                                                            </span>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                                            {app.applied ? new Date(app.applied).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                                <button onClick={() => fetchApplicationDetails(app.id)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                                                    <EyeIcon className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => { setSelectedApplication(app); setShowEmailModal(true); }} className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded hidden sm:block">
                                                                    <EnvelopeIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalGroups)}</span> of <span className="font-medium">{totalGroups}</span> Job Groups
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {/* Simple Page Number Display */}
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                    {/* Mobile Pagination */}
                    <div className="flex justify-between w-full sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Application Details Modal */}
            {showApplicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {modalLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-500">Loading...</div>
                        ) : selectedApplication && (
                            <>
                                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-gray-200 flex justify-between items-start">
                                    <div className="flex items-center">
                                        <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3"><DocumentTextIcon className="h-6 w-6 text-white" /></div>
                                        <div><h3 className="text-xl font-semibold text-white">Application Details</h3><p className="text-blue-100 text-sm mt-1">{selectedApplication.jobTitle}</p></div>
                                    </div>
                                    <button onClick={() => setShowApplicationModal(false)} className="text-white hover:text-blue-100 p-1 hover:bg-white hover:bg-opacity-10 rounded-full"><XMarkIcon className="h-6 w-6" /></button>
                                </div>
                                <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                                    <div className="mb-6 flex items-center justify-between">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>{selectedApplication.status}</span>
                                        <p className="text-sm text-gray-500">Applied on {selectedApplication.applied ? new Date(selectedApplication.applied).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" /> Candidate Information</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center mb-4">
                                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">{selectedApplication.name ? selectedApplication.name.split(' ').map(n => n[0]).join('') : 'NA'}</div>
                                                <div className="flex-1"><h5 className="text-lg font-medium text-gray-900">{selectedApplication.name}</h5><p className="text-gray-600">{selectedApplication.email}</p><p className="text-gray-600">{selectedApplication.phone}</p></div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div><p className="text-sm text-gray-500">Experience</p><p className="text-base font-medium text-gray-900">{selectedApplication.experience}</p></div>
                                                <div><p className="text-sm text-gray-500">Source</p><p className="text-base font-medium text-gray-900">{selectedApplication.source}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" /> Resume</h4>
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-900 font-medium mb-2">{selectedApplication.resume ? 'Download Resume' : 'No Resume Uploaded'}</p>
                                            {selectedApplication.resume && (
                                                <a href={selectedApplication.resume} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"><ArrowDownTrayIcon className="h-4 w-4 mr-2" /> Download Resume</a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="text-sm text-gray-500">Application ID: <span className="font-medium text-gray-700">#{selectedApplication.id ? selectedApplication.id.toString().padStart(5, '0') : 'N/A'}</span></div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button onClick={() => updateStatus(selectedApplication.id, 'rejected')} className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium">Reject</button>
                                        <button onClick={() => updateStatus(selectedApplication.id, 'interview')} className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 font-medium">Schedule</button>
                                        <button onClick={() => updateStatus(selectedApplication.id, 'offer')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Hire / Make Offer</button>
                                    </div>
                                </div>
                            </>
                        )}
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
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">{selectedApplication.name ? selectedApplication.name.split(' ').map(n => n[0]).join('') : 'NA'}</div>
                                <div className="flex-1"><p className="font-medium text-gray-900">{selectedApplication.name}</p><p className="text-sm text-gray-500">{selectedApplication.email}</p></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Subject</label><input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter email subject" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label><select value={emailTemplate} onChange={handleTemplateChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="">Select a template</option><option value="hired">Offer / Hired</option><option value="interview">Interview Invitation</option><option value="shortlisted">Shortlisted Candidate</option><option value="rejected">Rejection</option><option value="custom">Custom Message</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Message</label><textarea rows={10} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Type your message here..."></textarea></div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">To: <span className="font-medium text-gray-700">{selectedApplication.email}</span></div>
                            <div className="flex space-x-3">
                                <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">Cancel</button>
                                <button onClick={handleSendEmail} disabled={sendingEmail} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center disabled:opacity-50">{sendingEmail ? 'Sending...' : <><PaperAirplaneIcon className="h-4 w-4 mr-2" /> Send Email</>}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApplicationsTab;