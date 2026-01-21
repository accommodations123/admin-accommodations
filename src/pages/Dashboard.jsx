import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  RefreshCw,
  AlertCircle,
  Settings,
  Search,
  ArrowUp,
  ArrowDown,
  User,
  FileText,
  CheckCircle,
  Calendar,
  Building,
  Briefcase,
  UserPlus,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  Edit,
  Trash2,
  Bell,
  ChevronDown,
  Activity,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Users,
  Clock,
  Zap,
  Target,
  Award,
  Headphones,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  Globe,
  TrendingDown,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  GraduationCap,
  Send,
} from "lucide-react";

// Import chart components
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";

/* ======================================================
   AXIOS INSTANCE
====================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://accomodation.api.test.nextkinlife.live";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin-auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin-auth");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

/* ======================================================
   DASHBOARD API
====================================================== */

const dashboardAPI = {
  getAnalyticsSummary: () =>
    api.get("/analytics/summary").then((r) => r.data),

  getAnalyticsTimeseries: (event, range) =>
    api
      .get(`/analytics/timeseries?event=${event}&range=${range}`)
      .then((r) => r.data),

  getAnalyticsByLocation: (event) =>
    api
      .get(`/analytics/by-location?event=${event}`)
      .then((r) => r.data),

  getEventAnalyticsSummary: () =>
    api.get("/eventanalytics/summary").then((r) => r.data),

  getEventEngagementTimeseries: (type, days) =>
    api
      .get(`/eventanalytics/engagement?type=${type}&days=${days}`)
      .then((r) => r.data),

  getEventAnalyticsByLocation: () =>
    api.get("/eventanalytics/by-location").then((r) => r.data),
};

/* ======================================================
   useApi HOOK
====================================================== */

const useApi = (apiFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFn();
      setData(result);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

/* ======================================================
   DASHBOARD COMPONENT
====================================================== */

const Dashboard = () => {
  const [timeGreeting, setTimeGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedEvent, setSelectedEvent] = useState("HOST_CREATED");
  const [selectedRange, setSelectedRange] = useState("30d");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    data: analyticsSummary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useApi(() => dashboardAPI.getAnalyticsSummary(), []);

  const {
    data: analyticsTimeseries,
    loading: timeseriesLoading,
    refetch: refetchTimeseries,
  } = useApi(
    () =>
      dashboardAPI.getAnalyticsTimeseries(
        selectedEvent,
        selectedRange
      ),
    [selectedEvent, selectedRange]
  );

  const {
    data: analyticsByLocation,
    loading: locationLoading,
    refetch: refetchLocation,
  } = useApi(
    () => dashboardAPI.getAnalyticsByLocation(selectedEvent),
    [selectedEvent]
  );

  const {
    data: eventAnalyticsSummary,
    loading: eventSummaryLoading,
    refetch: refetchEventSummary,
  } = useApi(() => dashboardAPI.getEventAnalyticsSummary(), []);

  const {
    data: eventEngagementTimeseries,
    loading: eventEngagementLoading,
    refetch: refetchEventEngagement,
  } = useApi(
    () =>
      dashboardAPI.getEventEngagementTimeseries(
        "EVENT_JOINED",
        30
      ),
    []
  );

  const {
    data: eventAnalyticsByLocation,
    loading: eventLocationLoading,
    refetch: refetchEventLocation,
  } = useApi(() => dashboardAPI.getEventAnalyticsByLocation(), []);

  const hasError = summaryError;

  const handleRefresh = () => {
    setRefreshing(true);
    refetchSummary();
    refetchTimeseries();
    refetchLocation();
    refetchEventSummary();
    refetchEventEngagement();
    refetchEventLocation();

    setTimeout(() => setRefreshing(false), 1200);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good morning");
    else if (hour < 18) setTimeGreeting("Good afternoon");
    else setTimeGreeting("Good evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Transform analytics summary data for display
  const getHostStats = () => {
    if (!analyticsSummary?.hosts) return [];

    return [

      {
        title: "Hosts Created",
        value: analyticsSummary.hosts.created || 0,
        icon: User,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Hosts Approved",
        value: analyticsSummary.hosts.approved || 0,
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Hosts Rejected",
        value: analyticsSummary.hosts.rejected || 0,
        icon: AlertCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    ];

  };

  const getPropertyStats = () => {
    if (!analyticsSummary?.properties) return [];

    return [

      {
        title: "Properties Drafted",
        value: analyticsSummary.properties.drafted || 0,
        icon: FileText,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Properties Submitted",
        value: analyticsSummary.properties.submitted || 0,
        icon: Send,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
      },
      {
        title: "Properties Approved",
        value: analyticsSummary.properties.approved || 0,
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Properties Rejected",
        value: analyticsSummary.properties.rejected || 0,
        icon: AlertCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    ];

  };

  // Transform event analytics summary data for display
  const getEventStats = () => {
    if (!eventAnalyticsSummary?.stats) return [];

    return [

      {
        title: "Event Drafts",
        value: eventAnalyticsSummary.stats.drafts || 0,
        icon: FileText,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Events Submitted",
        value: eventAnalyticsSummary.stats.submitted || 0,
        icon: Calendar,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Events Approved",
        value: eventAnalyticsSummary.stats.approved || 0,
        icon: CheckCircle,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Events Rejected",
        value: eventAnalyticsSummary.stats.rejected || 0,
        icon: AlertCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    ];

  };

  // Transform location data for charts
  const getLocationDataForChart = () => {
    if (!analyticsByLocation?.length) return { labels: [], values: [] };

    return {
      labels: analyticsByLocation.slice(0, 10).map(item => `${item.country}, ${item.state}`),
      values: analyticsByLocation.slice(0, 10).map(item => item.count)
    };
  };

  // Transform event location data for charts
  const getEventLocationDataForChart = () => {
    if (!eventAnalyticsByLocation?.length) return { labels: [], values: [] };

    return {
      labels: eventAnalyticsByLocation.slice(0, 10).map(item => `${item.country}, ${item.state}`),
      values: eventAnalyticsByLocation.slice(0, 10).map(item => item.total)
    };
  };

  // Transform property status data for pie chart
  const getPropertyStatusData = () => {
    if (!analyticsSummary?.properties) return { labels: [], values: [] };

    return {
      labels: ['Drafted', 'Submitted', 'Approved', 'Rejected'],
      values: [
        analyticsSummary.properties.drafted || 0,
        analyticsSummary.properties.submitted || 0,
        analyticsSummary.properties.approved || 0,
        analyticsSummary.properties.rejected || 0
      ]
    };
  };

  // Transform host status data for pie chart
  const getHostStatusData = () => {
    if (!analyticsSummary?.hosts) return { labels: [], values: [] };

    return {
      labels: ['Created', 'Approved', 'Rejected'],
      values: [
        analyticsSummary.hosts.created || 0,
        analyticsSummary.hosts.approved || 0,
        analyticsSummary.hosts.rejected || 0
      ]
    };
  };

  const isLoading = summaryLoading || timeseriesLoading || locationLoading ||
    eventSummaryLoading || eventEngagementLoading || eventLocationLoading;

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#00162d] to-[#002a4d] rounded-xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">{timeGreeting}, Admin!</h1>
                <p className="text-blue-100">Here's your platform overview and key insights.</p>
                <p className="text-sm text-blue-200 mt-2">
                  {currentTime.toLocaleDateString()} at {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex space-x-3">
                <button className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors flex items-center">
                  <Download size={16} className="mr-2" />
                  Export Report
                </button>
                <button
                  onClick={handleRefresh}
                  className={`bg-[#cb2926] rounded-lg px-4 py-2 text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center ${refreshing ? 'opacity-70' : ''}`}
                >
                  <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {hasError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
              <AlertCircle size={18} />
              {summaryError}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex space-x-1">
              {['overview', 'accommodations', 'events', 'careers', 'users'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeSection === section ? 'bg-[#00162d] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range === 'day' ? '7d' : range === 'week' ? '7d' : range === 'month' ? '30d' : '90d')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedRange.includes(range.slice(0, -1)) ? 'bg-[#00162d] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT: Overview */}
          {activeSection === 'overview' && (
            <>
              {/* Host Analytics */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Host Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {summaryLoading ? (
                    Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
                  ) : getHostStats().length > 0 ? (
                    getHostStats().map((stat, i) => <StatCard key={i} stat={stat} />)
                  ) : (
                    <div className="col-span-3">
                      <ErrorCard message="No host data available" />
                    </div>
                  )}
                </div>
              </div>

              {/* Property Analytics */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Property Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {summaryLoading ? (
                    Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)
                  ) : getPropertyStats().length > 0 ? (
                    getPropertyStats().map((stat, i) => <StatCard key={i} stat={stat} />)
                  ) : (
                    <div className="col-span-4">
                      <ErrorCard message="No property data available" />
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Analytics Timeseries Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Analytics Timeseries</h3>
                    <div className="flex space-x-2">
                      <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#cb2926]"
                      >
                        <option value="HOST_CREATED">Host Created</option>
                        <option value="HOST_APPROVED">Host Approved</option>
                        <option value="HOST_REJECTED">Host Rejected</option>
                        <option value="PROPERTY_DRAFT_CREATED">Property Draft Created</option>
                        <option value="PROPERTY_SUBMITTED">Property Submitted</option>
                        <option value="PROPERTY_APPROVED">Property Approved</option>
                        <option value="PROPERTY_REJECTED">Property Rejected</option>
                      </select>
                    </div>
                  </div>
                  {timeseriesLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                    </div>
                  ) : analyticsTimeseries?.labels?.length > 0 ? (
                    <LineChart
                      data={analyticsTimeseries}
                      title={`${selectedEvent.replace(/_/g, ' ')} Events`}
                      height={300}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                  )}
                </div>

                {/* Analytics By Location Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Analytics By Location</h3>
                  </div>
                  {locationLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                    </div>
                  ) : analyticsByLocation?.length > 0 ? (
                    <BarChart
                      data={getLocationDataForChart()}
                      title={`${selectedEvent.replace(/_/g, ' ')} By Location`}
                      height={300}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* EVENTS Section */}
          {activeSection === 'events' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#00162d] mb-2">Events Analytics</h2>
                  <p className="text-gray-600">Manage and analyze all platform events.</p>
                </div>

                {/* Event Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {eventSummaryLoading ? (
                    Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)
                  ) : getEventStats().length > 0 ? (
                    getEventStats().map((stat, i) => <StatCard key={i} stat={stat} />)
                  ) : (
                    <div className="col-span-4">
                      <ErrorCard message="No event data available" />
                    </div>
                  )}
                </div>

                {/* Event Engagement Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Event Engagement Timeseries</h3>
                    </div>
                    {eventEngagementLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                      </div>
                    ) : eventEngagementTimeseries?.labels?.length > 0 ? (
                      <LineChart
                        data={eventEngagementTimeseries}
                        title="Event Engagement"
                        height={300}
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Event Analytics By Location</h3>
                    </div>
                    {eventLocationLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                      </div>
                    ) : eventAnalyticsByLocation?.length > 0 ? (
                      <PieChart
                        data={getEventLocationDataForChart()}
                        title="Events By Location"
                        height={300}
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ACCOMMODATIONS Section */}
          {activeSection === 'accommodations' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00162d] mb-2">Accommodations</h2>
                <p className="text-gray-600">Manage all listed accommodations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {summaryLoading ? (
                  Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)
                ) : getPropertyStats().length > 0 ? (
                  getPropertyStats().map((stat, i) => <StatCard key={i} stat={stat} />)
                ) : (
                  <div className="col-span-4">
                    <ErrorCard message="No accommodation data available" />
                  </div>
                )}
              </div>

              {/* Property Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Property Status Distribution</h3>
                  </div>
                  {summaryLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                    </div>
                  ) : getPropertyStatusData().labels.length > 0 ? (
                    <PieChart
                      data={getPropertyStatusData()}
                      title="Property Status"
                      height={300}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Host Status Distribution</h3>
                  </div>
                  {summaryLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00162d]"></div>
                    </div>
                  ) : getHostStatusData().labels.length > 0 ? (
                    <PieChart
                      data={getHostStatusData()}
                      title="Host Status"
                      height={300}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CAREERS Section */}
          {activeSection === 'careers' && (
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
          )}

          {/* USERS Section */}
          {activeSection === 'users' && (
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
          )}

          {/* QUICK ACTIONS (common to all sections) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Building className="text-blue-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Add Property</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="text-green-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Create Event</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Briefcase className="text-purple-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Post Job</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <UserPlus className="text-orange-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Add User</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FileText className="text-red-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Reports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings className="text-gray-500 mb-2" size={24} />
                <span className="text-xs text-gray-700">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ======================================================
   STAT CARD COMPONENT
====================================================== */

const StatCard = ({ stat }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
        <stat.icon className={stat.textColor} size={24} />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{stat.title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
      </div>
    </div>
  </div>
);

/* ======================================================
   LOADING CARD COMPONENT
====================================================== */

const LoadingCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

/* ======================================================
   ERROR CARD COMPONENT
====================================================== */

const ErrorCard = ({ message }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
    <div className="flex items-center text-red-600">
      <AlertCircle size={20} className="mr-2" />
      <span className="text-sm">{message || 'Failed to load data'}</span>
    </div>
  </div>
);

export default Dashboard;