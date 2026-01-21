import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    PlusIcon,
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

/* =====================================================
   AXIOS INSTANCE
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
const JobsTab = () => {
    const [jobsData, setJobsData] = useState([]);
    const [showJobModal, setShowJobModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "",
        employment_type: "",
        work_style: "",
        experience_level: "",
        description: "",
    });

    /* =====================================================
       FETCH JOBS (GET) - Persists on Refresh
    ===================================================== */
    const fetchJobs = async () => {
        try {
            // Assuming a GET route exists at the same endpoint or similar
            const res = await api.get("/carrer/admin/jobs");

            // Handle response based on structure (usually { jobs: [...] } or just [...])
            if (res.data.success && res.data.jobs) {
                setJobsData(res.data.jobs);
            } else if (Array.isArray(res.data)) {
                setJobsData(res.data);
            }
        } catch (err) {
            console.error("FETCH JOBS ERROR", err.response?.data || err.message);
        }
    };

    // Load jobs when component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    /* =====================================================
       CREATE JOB (POST → DRAFT)
    ===================================================== */
    const handleCreateJob = async () => {
        try {
            setLoading(true);

            const res = await api.post("/carrer/admin/jobs", {
                title: formData.title,
                company: "NextKin Life",
                department: formData.department,
                location: formData.location,
                employment_type: formData.employment_type,
                work_style: formData.work_style,
                experience_level: formData.experience_level,
                description: formData.description,
            });

            const job = res.data.job;

            if (!job?.id) {
                console.error("❌ Backend did not return job.id", job);
                return;
            }

            // Add new job to the top of the list
            setJobsData((prev) => [job, ...prev]);

            // Close and Reset
            setShowJobModal(false);
            setFormData({
                title: "",
                department: "",
                location: "",
                employment_type: "",
                work_style: "",
                experience_level: "",
                description: "",
            });
        } catch (err) {
            console.error("CREATE JOB ERROR", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       UPDATE STATUS (PATCH) - Matches Backend Route
    ===================================================== */
    const updateJobStatus = async (jobId, status) => {
        if (!jobId) {
            console.error("❌ Missing job id");
            return;
        }

        try {
            // URL matches: router.patch("/carrer/admin/jobs/:id/status", ...)
            const res = await api.patch(
                `/carrer/admin/jobs/${jobId}/status`,
                { status }
            );

            const updatedJob = res.data.job;

            // Optimistic UI update or update based on server response
            setJobsData((prev) =>
                prev.map((job) =>
                    job.id === jobId ? { ...job, status: updatedJob.status } : job
                )
            );
        } catch (err) {
            console.error(
                "UPDATE STATUS ERROR",
                err.response?.data || err.message
            );
        }
    };

    /* =====================================================
       STATUS BADGE
    ===================================================== */
    const statusBadge = (status) => {
        if (status === "active") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-4 w-4 mr-1" /> Active
                </span>
            );
        }
        if (status === "closed") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="h-4 w-4 mr-1" /> Closed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <ClockIcon className="h-4 w-4 mr-1" /> Draft
            </span>
        );
    };

    /* =====================================================
       JSX
    ===================================================== */
    return (
        <div>
            {/* HEADER */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Job Postings</h2>
                <button
                    onClick={() => setShowJobModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> New Job
                </button>
            </div>

            {/* JOB TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {jobsData.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                <td className="px-6 py-4">{statusBadge(job.status)}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    {/* If Draft -> Show Activate Button */}
                                    {job.status === "draft" && (
                                        <button
                                            onClick={() =>
                                                updateJobStatus(job.id, "active")
                                            }
                                            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition"
                                        >
                                            Activate
                                        </button>
                                    )}

                                    {/* If Active -> Show Close Button */}
                                    {job.status === "active" && (
                                        <button
                                            onClick={() =>
                                                updateJobStatus(job.id, "closed")
                                            }
                                            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition"
                                        >
                                            Close
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {jobsData.length === 0 && (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    No jobs found. Create a new job to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CREATE JOB MODAL */}
            {showJobModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Job</h3>
                            <button
                                onClick={() => setShowJobModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Inputs */}
                        {["title", "department", "location"].map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace('_', ' ')}</label>
                                <input
                                    key={key}
                                    value={formData[key]}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [key]: e.target.value })
                                    }
                                    placeholder={`Enter ${key}`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                <select
                                    value={formData.employment_type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            employment_type: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Type</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Style</label>
                                <select
                                    value={formData.work_style}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            work_style: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Style</option>
                                    <option value="office">Office</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                            <select
                                value={formData.experience_level}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experience_level: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Level</option>
                                <option value="entry">Entry</option>
                                <option value="mid">Mid</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Job description details..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowJobModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateJob}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Job"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsTab;