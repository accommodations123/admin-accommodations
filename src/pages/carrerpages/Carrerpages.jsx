
import React, { useState } from 'react';
import {
    LayoutDashboard, // Matches LayoutDashboard below
    Briefcase,      // Matches Briefcase below
    FileText,       // Matches FileText below
    Send,
    Search,
    Plus,
    Settings,
    Clock,
    Bell,
    LogOut,
    Menu,
    X,
    MoreHorizontal,
} from 'lucide-react';

// Import the 4 separate tab components
// Ensure these paths match where you saved the files from the previous step
import DashboardTab from '../carrerpages/Dashboardpage';
import JobsTab from '../carrerpages/Jobposting';
import ApplicationsTab from '../carrerpages/Applicationpage';
import OffersTab from '../carrerpages/Offerspage';

// --- STATIC DATA ---

const jobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experience: '5+ years',
        salary: '$150k - $200k',
        status: 'active',
        posted: '2024-01-15',
        applicants: 45,
        views: 1250,
        deadline: '2024-02-15',
        description: 'We are looking for a talented Senior Frontend Developer to join our engineering team and help build amazing user experiences for our platform.',
        requirements: [
            '5+ years of experience with React/Next.js',
            'Strong proficiency in TypeScript',
            'Experience with state management (Redux, Zustand)',
            'Knowledge of modern CSS (Tailwind, CSS-in-JS)',
            'Experience with testing frameworks (Jest, Cypress)'
        ],
        responsibilities: [
            'Develop and maintain responsive web applications',
            'Collaborate with design and backend teams',
            'Write clean, maintainable, and testable code',
            'Mentor junior developers',
            'Participate in code reviews and architectural decisions'
        ],
        benefits: ['Health insurance', '401(k)', 'Remote work', 'Stock options']
    },
    {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '$120k - $160k',
        status: 'active',
        posted: '2024-01-10',
        applicants: 32,
        views: 890,
        deadline: '2024-02-10',
        description: 'Join our product team to shape the future of our platform and deliver exceptional value to our customers.',
        requirements: [
            '3-5 years of product management experience',
            'Strong analytical and problem-solving skills',
            'Experience with agile methodologies',
            'Excellent communication and leadership skills',
            'Technical background or experience with SaaS products'
        ],
        responsibilities: [
            'Define product roadmap and strategy',
            'Work closely with engineering and design teams',
            'Conduct market research and user interviews',
            'Analyze product metrics and user feedback',
            'Manage product lifecycle from conception to launch'
        ],
        benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Professional development']
    },
    {
        id: 3,
        title: 'UX/UI Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-time',
        experience: '3+ years',
        salary: '$100k - $140k',
        status: 'draft',
        posted: '2024-01-20',
        applicants: 0,
        views: 0,
        deadline: '2024-03-01',
        description: 'We are seeking a creative UX/UI Designer to create beautiful and intuitive user interfaces for our products.',
        requirements: [
            '3+ years of UX/UI design experience',
            'Proficiency in Figma, Sketch, or Adobe XD',
            'Strong portfolio demonstrating design process',
            'Understanding of user-centered design principles',
            'Experience with design systems'
        ],
        responsibilities: [
            'Create wireframes, mockups, and prototypes',
            'Conduct user research and usability testing',
            'Collaborate with product and engineering teams',
            'Maintain and evolve our design system',
            'Ensure consistent design across all platforms'
        ],
        benefits: ['Health insurance', '401(k)', 'Fully remote', 'Creative freedom']
    },
    {
        id: 4,
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Austin, TX',
        type: 'Full-time',
        experience: '4+ years',
        salary: '$130k - $170k',
        status: 'closed',
        posted: '2023-12-01',
        applicants: 67,
        views: 2100,
        deadline: '2024-01-15',
        description: 'Join our backend team to build scalable and robust server-side applications.',
        requirements: [
            '4+ years of backend development experience',
            'Proficiency in Node.js, Python, or Go',
            'Experience with cloud platforms (AWS, GCP)',
            'Knowledge of databases (PostgreSQL, MongoDB)',
            'Understanding of microservices architecture'
        ],
        responsibilities: [
            'Design and develop RESTful APIs',
            'Optimize database queries and performance',
            'Implement security best practices',
            'Collaborate with frontend team',
            'Participate in system architecture design'
        ],
        benefits: ['Health insurance', '401(k)', 'Remote options', 'Tech budget']
    },
    {
        id: 5,
        title: 'Data Analyst',
        department: 'Analytics',
        location: 'Boston, MA',
        type: 'Contract',
        experience: '2-3 years',
        salary: '$80k - $100k',
        status: 'active',
        posted: '2024-01-18',
        applicants: 28,
        views: 650,
        deadline: '2024-02-28',
        description: 'We are looking for a detail-oriented Data Analyst to help us make data-driven decisions.',
        requirements: [
            '2-3 years of data analysis experience',
            'Proficiency in SQL and data visualization tools',
            'Experience with Python or R for data analysis',
            'Strong analytical and problem-solving skills',
            'Ability to communicate complex data insights'
        ],
        responsibilities: [
            'Analyze complex datasets to extract insights',
            'Create reports and dashboards for stakeholders',
            'Collaborate with cross-functional teams',
            'Identify trends and patterns in data',
            'Present findings to leadership'
        ],
        benefits: ['Health insurance', '401(k)', 'Flexible schedule', 'Learning opportunities']
    },
    {
        id: 6,
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Seattle, WA',
        type: 'Full-time',
        experience: '4+ years',
        salary: '$140k - $180k',
        status: 'active',
        posted: '2024-01-22',
        applicants: 18,
        views: 420,
        deadline: '2024-03-15',
        description: 'Seeking an experienced DevOps Engineer to help build and maintain our cloud infrastructure.',
        requirements: [
            '4+ years of DevOps experience',
            'Experience with AWS or Azure',
            'Knowledge of CI/CD pipelines',
            'Containerization with Docker/Kubernetes',
            'Infrastructure as Code (Terraform)'
        ],
        responsibilities: [
            'Design and implement CI/CD pipelines',
            'Manage cloud infrastructure',
            'Monitor system performance',
            'Automate deployment processes',
            'Ensure system security and reliability'
        ],
        benefits: ['Health insurance', '401(k)', 'Remote work', 'Conference budget']
    },
    {
        id: 7,
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        experience: '5+ years',
        salary: '$110k - $150k',
        status: 'active',
        posted: '2024-01-25',
        applicants: 22,
        views: 580,
        deadline: '2024-03-01',
        description: 'Lead our marketing efforts and drive brand awareness and customer acquisition.',
        requirements: [
            '5+ years of marketing experience',
            'Digital marketing expertise',
            'Team leadership experience',
            'Analytics and data-driven approach',
            'Excellent communication skills'
        ],
        responsibilities: [
            'Develop marketing strategies',
            'Manage marketing team',
            'Oversee digital campaigns',
            'Analyze marketing metrics',
            'Collaborate with sales team'
        ],
        benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Marketing budget']
    }
];

const applications = [
    {
        id: 1,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        experience: '6 years',
        status: 'reviewing',
        applied: '2024-01-20',
        resume: 'john_smith_resume.pdf',
        score: 85,
        source: 'LinkedIn'
    },
    {
        id: 2,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        experience: '4 years',
        status: 'shortlisted',
        applied: '2024-01-19',
        resume: 'sarah_johnson_cv.pdf',
        score: 92,
        source: 'Company Website'
    },
    {
        id: 3,
        jobId: 2,
        jobTitle: 'Product Manager',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+1 (555) 345-6789',
        experience: '5 years',
        status: 'interview',
        applied: '2024-01-18',
        resume: 'michael_chen_resume.pdf',
        score: 88,
        source: 'Indeed'
    },
    {
        id: 4,
        jobId: 3,
        jobTitle: 'UX/UI Designer',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1 (555) 456-7890',
        experience: '3 years',
        status: 'rejected',
        applied: '2024-01-17',
        resume: 'emily_davis_portfolio.pdf',
        score: 65,
        source: 'Referral'
    },
    {
        id: 5,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        name: 'Robert Wilson',
        email: 'r.wilson@email.com',
        phone: '+1 (555) 567-8901',
        experience: '7 years',
        status: 'offered',
        applied: '2024-01-16',
        resume: 'robert_wilson_cv.pdf',
        score: 94,
        source: 'GitHub'
    },
    {
        id: 6,
        jobId: 6,
        jobTitle: 'DevOps Engineer',
        name: 'Alex Thompson',
        email: 'alex.t@email.com',
        phone: '+1 (555) 678-9012',
        experience: '5 years',
        status: 'interview',
        applied: '2024-01-24',
        resume: 'alex_thompson_resume.pdf',
        score: 90,
        source: 'LinkedIn'
    },
    {
        id: 7,
        jobId: 7,
        jobTitle: 'Marketing Manager',
        name: 'Jessica Martinez',
        email: 'j.martinez@email.com',
        phone: '+1 (555) 789-0123',
        experience: '6 years',
        status: 'shortlisted',
        applied: '2024-01-26',
        resume: 'jessica_martinez_cv.pdf',
        score: 87,
        source: 'Referral'
    },
    {
        id: 8,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        name: 'David Kim',
        email: 'd.kim@email.com',
        phone: '+1 (555) 890-1234',
        experience: '8 years',
        status: 'reviewing',
        applied: '2024-01-27',
        resume: 'david_kim_resume.pdf',
        score: 91,
        source: 'AngelList'
    }
];

const offers = [
    {
        id: 1,
        applicationId: 5,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        candidateName: 'Robert Wilson',
        candidateEmail: 'r.wilson@email.com',
        candidatePhone: '+1 (555) 567-8901',
        status: 'pending',
        offeredDate: '2024-01-25',
        responseDeadline: '2024-02-05',
        salary: '$165,000',
        bonus: '$10,000',
        startDate: '2024-02-15',
        benefits: ['Health insurance', '401(k)', 'Stock options', 'Remote work options'],
        notes: 'Strong technical skills and cultural fit. Approved by engineering lead.',
        sentBy: 'HR Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    },
    {
        id: 2,
        applicationId: 3,
        jobId: 2,
        jobTitle: 'Product Manager',
        candidateName: 'Michael Chen',
        candidateEmail: 'm.chen@email.com',
        candidatePhone: '+1 (555) 345-6789',
        status: 'accepted',
        offeredDate: '2024-01-20',
        responseDeadline: '2024-01-30',
        salary: '$145,000',
        bonus: '$15,000',
        startDate: '2024-02-20',
        benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Professional development'],
        notes: 'Excellent product vision and leadership skills. Team is excited to work with him.',
        sentBy: 'Product Director',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf', 'welcome_kit.pdf']
    },
    {
        id: 3,
        applicationId: 2,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        candidateName: 'Sarah Johnson',
        candidateEmail: 'sarah.j@email.com',
        candidatePhone: '+1 (555) 234-5678',
        status: 'declined',
        offeredDate: '2024-01-15',
        responseDeadline: '2024-01-25',
        salary: '$155,000',
        bonus: '$10,000',
        startDate: '2024-02-10',
        benefits: ['Health insurance', '401(k)', 'Stock options', 'Remote work options'],
        notes: 'Candidate declined due to better compensation package from competitor.',
        sentBy: 'HR Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    },
    {
        id: 4,
        applicationId: 1,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        candidateName: 'John Smith',
        candidateEmail: 'john.smith@email.com',
        candidatePhone: '+1 (555) 123-4567',
        status: 'draft',
        offeredDate: '',
        responseDeadline: '',
        salary: '$160,000',
        bonus: '$10,000',
        startDate: '2024-02-20',
        benefits: ['Health insurance', '401(k)', 'Stock options', 'Remote work options'],
        notes: 'Waiting for final approval from finance department.',
        sentBy: '',
        documents: []
    },
    {
        id: 5,
        applicationId: 6,
        jobId: 6,
        jobTitle: 'DevOps Engineer',
        candidateName: 'Alex Thompson',
        candidateEmail: 'alex.t@email.com',
        candidatePhone: '+1 (555) 678-9012',
        status: 'pending',
        offeredDate: '2024-01-28',
        responseDeadline: '2024-02-08',
        salary: '$155,000',
        bonus: '$12,000',
        startDate: '2024-02-25',
        benefits: ['Health insurance', '401(k)', 'Remote work', 'Conference budget'],
        notes: 'Excellent cloud infrastructure knowledge. Team lead highly recommends.',
        sentBy: 'Engineering Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    },
    {
        id: 6,
        applicationId: 7,
        jobId: 7,
        jobTitle: 'Marketing Manager',
        candidateName: 'Jessica Martinez',
        candidateEmail: 'j.martinez@email.com',
        candidatePhone: '+1 (555) 789-0123',
        status: 'accepted',
        offeredDate: '2024-01-22',
        responseDeadline: '2024-02-01',
        salary: '$135,000',
        bonus: '$8,000',
        startDate: '2024-02-12',
        benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Marketing budget'],
        notes: 'Strong marketing background with proven track record. Perfect fit for our team.',
        sentBy: 'VP of Marketing',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf', 'marketing_plan.pdf']
    },
    {
        id: 7,
        applicationId: 8,
        jobId: 1,
        jobTitle: 'Senior Frontend Developer',
        candidateName: 'David Kim',
        candidateEmail: 'd.kim@email.com',
        candidatePhone: '+1 (555) 890-1234',
        status: 'pending',
        offeredDate: '2024-01-29',
        responseDeadline: '2024-02-09',
        salary: '$170,000',
        bonus: '$15,000',
        startDate: '2024-03-01',
        benefits: ['Health insurance', '401(k)', 'Stock options', 'Remote work options', 'Relocation package'],
        notes: 'Senior candidate with extensive experience. Negotiated higher compensation.',
        sentBy: 'HR Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf', 'relocation_policy.pdf']
    },
    {
        id: 8,
        applicationId: 9,
        jobId: 4,
        jobTitle: 'Backend Developer',
        candidateName: 'Maria Garcia',
        candidateEmail: 'm.garcia@email.com',
        candidatePhone: '+1 (555) 901-2345',
        status: 'declined',
        offeredDate: '2023-12-20',
        responseDeadline: '2024-01-05',
        salary: '$140,000',
        bonus: '$8,000',
        startDate: '2024-01-15',
        benefits: ['Health insurance', '401(k)', 'Remote options', 'Tech budget'],
        notes: 'Candidate accepted offer from another company with better work-life balance.',
        sentBy: 'HR Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    },
    {
        id: 9,
        applicationId: 10,
        jobId: 5,
        jobTitle: 'Data Analyst',
        candidateName: 'James Wilson',
        candidateEmail: 'j.wilson@email.com',
        candidatePhone: '+1 (555) 012-3456',
        status: 'accepted',
        offeredDate: '2024-01-18',
        responseDeadline: '2024-01-28',
        salary: '$95,000',
        bonus: '$5,000',
        startDate: '2024-02-05',
        benefits: ['Health insurance', '401(k)', 'Flexible schedule', 'Learning opportunities'],
        notes: 'Strong analytical skills with data visualization expertise.',
        sentBy: 'Analytics Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    },
    {
        id: 10,
        applicationId: 11,
        jobId: 3,
        jobTitle: 'UX/UI Designer',
        candidateName: 'Sophie Anderson',
        candidateEmail: 's.anderson@email.com',
        candidatePhone: '+1 (555) 123-4568',
        status: 'draft',
        offeredDate: '',
        responseDeadline: '',
        salary: '$125,000',
        bonus: '$7,000',
        startDate: '2024-03-10',
        benefits: ['Health insurance', '401(k)', 'Fully remote', 'Creative freedom', 'Equipment budget'],
        notes: 'Outstanding portfolio. Waiting for budget approval from finance.',
        sentBy: '',
        documents: []
    },
    {
        id: 11,
        applicationId: 12,
        jobId: 6,
        jobTitle: 'DevOps Engineer',
        candidateName: 'Ryan Park',
        candidateEmail: 'r.park@email.com',
        candidatePhone: '+1 (555) 234-5679',
        status: 'pending',
        offeredDate: '2024-01-30',
        responseDeadline: '2024-02-10',
        salary: '$150,000',
        bonus: '$10,000',
        startDate: '2024-02-28',
        benefits: ['Health insurance', '401(k)', 'Remote work', 'Conference budget', 'Certification support'],
        notes: 'Strong Kubernetes and AWS experience. Multiple certifications.',
        sentBy: 'Engineering Manager',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf', 'certification_policy.pdf']
    },
    {
        id: 12,
        applicationId: 13,
        jobId: 7,
        jobTitle: 'Marketing Manager',
        candidateName: 'Lisa Chen',
        candidateEmail: 'l.chen@email.com',
        candidatePhone: '+1 (555) 345-6780',
        status: 'declined',
        offeredDate: '2024-01-12',
        responseDeadline: '2024-01-22',
        salary: '$130,000',
        bonus: '$8,000',
        startDate: '2024-02-01',
        benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Marketing budget'],
        notes: 'Candidate decided to pursue entrepreneurship opportunity.',
        sentBy: 'VP of Marketing',
        documents: ['offer_letter.pdf', 'employment_agreement.pdf']
    }
];

const stats = [
    {
        label: 'Total Jobs',
        value: '12',
        change: '+2',
        changeType: 'increase',
        icon: Briefcase, // Changed from BriefcaseIcon
    },
    {
        label: 'Active Jobs',
        value: '8',
        change: '+1',
        changeType: 'increase',
        icon: LayoutDashboard, // Changed from LayoutDashboardIcon
    },
    {
        label: 'Total Applications',
        value: '342',
        change: '+45',
        changeType: 'increase',
        icon: FileText, // Changed from FileTextIcon
    },
    {
        label: 'Pending Review',
        value: '28',
        change: '-5',
        changeType: 'decrease',
        icon: Clock, // Use the imported Clock
    }
];

// --- MAIN COMPONENT ---

function CareerPages() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Render the specific tab component based on activeTab state
    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <DashboardTab
                        stats={stats}
                        applications={applications}
                        offers={offers}
                    />
                );
            case 'jobs':
                return (
                    <JobsTab
                        jobs={jobs}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                );
            case 'applications':
                return (
                    <ApplicationsTab
                        applications={applications}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                );
            case 'offers':
                return (
                    <OffersTab
                        offers={offers}
                        jobs={jobs}
                        applications={applications}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Admin Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center">
                            <div className="bg-red-500 p-2 rounded-lg mr-3">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Career Admin</h1>
                                <p className="text-sm text-gray-500 mt-1">Recruitment & Hiring Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-8xl mx-auto px-4 py-6">
                {/* Tab Navigation with Rounded Bar (Matching BuySell Style) */}
                <div className="mb-6">
                    <div className="bg-white rounded-full p-1 flex justify-center shadow-sm">
                        <div className="bg-white rounded-full p-1 flex space-x-3">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center ${activeTab === 'dashboard'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </button>

                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center ${activeTab === 'jobs'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Briefcase className="w-4 h-4 mr-2" />
                                Jobs
                            </button>

                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center ${activeTab === 'applications'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Applications
                            </button>

                            <button
                                onClick={() => setActiveTab('offers')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center ${activeTab === 'offers'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Offers
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow p-6">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

export default CareerPages;