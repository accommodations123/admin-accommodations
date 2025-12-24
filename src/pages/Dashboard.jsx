import React, { useState, useEffect } from 'react';
import {
  Home, TrendingUp, DollarSign, Star, Eye, Edit, Trash2, Bell, ChevronDown,
  ArrowUp, ArrowDown, User, Activity, RefreshCw, Download, BarChart3, PieChart,
  Calendar, MapPin, Users, Building, Clock, AlertCircle, CheckCircle, Zap,
  Target, Award, Headphones, MessageSquare, CreditCard, ShoppingBag, Search, FileText, Settings,
  Globe, TrendingDown, Filter, MoreHorizontal, UserPlus, Mail, Phone, Briefcase, GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const [timeGreeting, setTimeGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateRange, setDateRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Good morning');
    else if (hour < 18) setTimeGreeting('Good afternoon');
    else setTimeGreeting('Good evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Platform Overview Stats
  const platformStats = [
    {
      title: 'Total Revenue',
      value: '$125,700',
      change: '+12.5%',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '12,345',
      change: '+15.3%',
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '+0.5%',
      icon: Target,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: 'up'
    },
    {
      title: 'Platform Engagement',
      value: '78%',
      change: '-2.1%',
      icon: Activity,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: 'down'
    },
  ];

  const websiteAnalytics = [
    { month: 'Jan', visitors: 15420 },
    { month: 'Feb', visitors: 17890 },
    { month: 'Mar', visitors: 19870 },
    { month: 'Apr', visitors: 22100 },
    { month: 'May', visitors: 24560 },
    { month: 'Jun', visitors: 26780 },
  ];

  const activities = [
    { id: 1, user: 'John Doe', action: 'completed booking for Luxury Villa', time: '2 minutes ago', type: 'booking', status: 'success' },
    { id: 2, user: 'Sarah Smith', action: 'registered for Tech Conference', time: '15 minutes ago', type: 'event', status: 'info' },
    { id: 3, user: 'Mike Johnson', action: 'applied for Senior Developer position', time: '1 hour ago', type: 'career', status: 'info' },
    { id: 4, user: 'Emily Davis', action: 'left a 5-star review', time: '2 hours ago', type: 'review', status: 'success' },
    { id: 5, user: 'System', action: 'scheduled maintenance at 2 AM', time: '3 hours ago', type: 'system', status: 'warning' },
  ];

  const alerts = [
    { id: 1, title: 'Server CPU Usage High', message: 'CPU usage exceeded 80% threshold', time: '5 minutes ago', type: 'warning' },
    { id: 2, title: 'New Feature Deployed', message: 'Version 2.1.0 successfully deployed', time: '2 hours ago', type: 'success' },
    { id: 3, title: 'Database Backup Complete', message: 'Daily backup completed successfully', time: '6 hours ago', type: 'info' },
  ];

  const geoData = [
    { country: 'United States', users: 4523, percentage: 36.6 },
    { country: 'United Kingdom', users: 2341, percentage: 18.9 },
    { country: 'Canada', users: 1567, percentage: 12.7 },
    { country: 'Australia', users: 1234, percentage: 10.0 },
    { country: 'Germany', users: 987, percentage: 8.0 },
    { country: 'Others', users: 1693, percentage: 13.8 },
  ];

  const moduleStats = [
    { name: 'Accommodations', count: 1456, change: '+12%', icon: Building, color: 'text-blue-600' },
    { name: 'Events', count: 234, change: '+8%', icon: Calendar, color: 'text-green-600' },
    { name: 'Careers', count: 89, change: '+23%', icon: Briefcase, color: 'text-purple-600' },
    { name: 'Users', count: 12345, change: '+15%', icon: Users, color: 'text-orange-600' },
  ];

  // accommodation types now use lucide icons (components)
  const accommodationTypes = [
    { id: 1, name: 'Student', icon: GraduationCap, description: 'Affordable housing near educational institutions.', count: 156, avgPrice: 45, occupancyRate: 78 },
    { id: 2, name: 'Family', icon: Users, description: 'Spacious accommodations suitable for families.', count: 243, avgPrice: 120, occupancyRate: 82 },
    { id: 3, name: 'Luxury', icon: Award, description: 'Premium stays with high-end amenities.', count: 89, avgPrice: 350, occupancyRate: 65 },
    { id: 4, name: 'Business', icon: Briefcase, description: 'Professional stays with business amenities.', count: 127, avgPrice: 180, occupancyRate: 70 },
    { id: 5, name: 'Short Term', icon: Clock, description: 'Flexible stays for days to a few weeks.', count: 234, avgPrice: 85, occupancyRate: 75 },
    { id: 6, name: 'Long Term', icon: Calendar, description: 'Extended stay options with monthly rates.', count: 67, avgPrice: 900, occupancyRate: 85 },
  ];

  const recentBookings = [
    { id: 1, property: 'Luxury Villa Miami', guest: 'John Doe', checkIn: 'Oct 15, 2023', checkOut: 'Oct 20, 2023', status: 'completed', revenue: '$900', image: 'https://picsum.photos/seed/villa1/80/60' },
    { id: 2, property: 'Downtown NYC Apartment', guest: 'Sarah Smith', checkIn: 'Oct 18, 2023', checkOut: 'Oct 23, 2023', status: 'completed', revenue: '$560', image: 'https://picsum.photos/seed/apartment1/80/60' },
    { id: 3, property: 'Beach House California', guest: 'Mike Johnson', checkIn: 'Oct 20, 2023', checkOut: 'Oct 25, 2023', status: 'completed', revenue: '$1,050', image: 'https://picsum.photos/seed/beach1/80/60' },
    { id: 4, property: 'Student Dorm NYC', guest: 'Emily Davis', checkIn: 'Oct 22, 2023', checkOut: 'Oct 29, 2023', status: 'cancelled', revenue: '$0', image: 'https://picsum.photos/seed/dorm1/80/60' },
  ];

  const topProperties = [
    { id: 1, name: 'Luxury Villa Miami', type: 'Luxury', rating: 4.9, revenue: '$12,450', bookings: 128, image: 'https://picsum.photos/seed/villa1/300/200' },
    { id: 2, name: 'Downtown NYC Apartment', type: 'Short Term', rating: 4.7, revenue: '$8,900', bookings: 95, image: 'https://picsum.photos/seed/apartment1/300/200' },
    { id: 3, name: 'Beach House California', type: 'Family', rating: 4.8, revenue: '$15,750', bookings: 87, image: 'https://picsum.photos/seed/beach1/300/200' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar size={16} className="text-blue-500" />;
      case 'event': return <Calendar size={16} className="text-green-500" />;
      case 'career': return <Briefcase size={16} className="text-purple-500" />;
      case 'payment': return <CreditCard size={16} className="text-green-500" />;
      case 'user': return <User size={16} className="text-purple-500" />;
      case 'review': return <Star size={16} className="text-yellow-500" />;
      case 'system': return <AlertCircle size={16} className="text-orange-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={16} className="text-orange-500" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'info': return <MessageSquare size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-0 bg-gradient-to-r from-[#00162d] to-[#002a4d] rounded-xl p-6 text-white shadow-lg">
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
              <button className="bg-[#cb2926] rounded-lg px-4 py-2 text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
                <Zap size={16} className="mr-2" />
                Quick Actions
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-2 mt-10 bg-white rounded-xl shadow-sm p-2">
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
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${dateRange === range ? 'bg-[#00162d] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cb2926] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-500 hover:text-gray-700 rounded-lg ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT: Overview */}
        {activeSection === 'overview' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platformStats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`${stat.textColor}`} size={24} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.bgColor} ${stat.textColor} flex items-center`}>
                      {stat.trend === 'up' ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Website Analytics */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Website Analytics</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700"><BarChart3 size={18} /></button>
                  <button className="text-gray-500 hover:text-gray-700"><Download size={18} /></button>
                </div>
              </div>

              {/* STATIC IMAGE */}
              <div className="w-full h-56 bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/preview.jpg"
                  alt="Analytics Chart"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>


              {/* STATIC STATS */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Visitors</p>
                  <p className="text-lg font-bold text-gray-800">126,620</p>
                  <p className="text-xs text-green-600 mt-1">+12.5%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Page Views</p>
                  <p className="text-lg font-bold text-gray-800">381,690</p>
                  <p className="text-xs text-green-600 mt-1">+15.3%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Bounce Rate</p>
                  <p className="text-lg font-bold text-gray-800">28.2%</p>
                  <p className="text-xs text-green-600 mt-1">-3.1%</p>
                </div>
              </div>
            </div>


            {/* Geographic + Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Geographic Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
                <div className="space-y-3">
                  {geoData.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <span className="text-sm text-gray-700 w-24 truncate">{c.country}</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-[#00162d] to-[#cb2926] h-2 rounded-full" style={{ width: `${c.percentage}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-12 text-right">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold text-gray-800">12,345</span>
                  </div>
                </div>
              </div>

              {/* Platform Modules */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Platform Modules</h3>
                  <button className="text-sm text-[#00162d] hover:text-[#cb2926]">View All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moduleStats.map((m, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <m.icon className={`${m.color}`} size={20} />
                        <span className="text-xs font-semibold text-green-600">{m.change}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">{m.count}</h4>
                      <p className="text-sm text-gray-600">{m.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                  <a href="#" className="text-sm text-[#00162d] hover:text-[#cb2926]">View All</a>
                </div>
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start">
                      <div className={`w-10 h-10 rounded-full ${act.status === 'success' ? 'bg-green-100' : act.status === 'error' ? 'bg-red-100' : act.status === 'warning' ? 'bg-orange-100' : 'bg-blue-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800"><span className="font-medium">{act.user}</span> {act.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">System Alerts</h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">3 Active</span>
                </div>
                <div className="space-y-3">
                  {alerts.map((a) => (
                    <div key={a.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="mr-3 mt-0.5">{getAlertIcon(a.type)}</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800">{a.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{a.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ACCOMMODATIONS Section */}
        {activeSection === 'accommodations' && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00162d] mb-2">Accommodations</h2>
                <p className="text-gray-600">Manage all listed accommodations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-[#00162d] to-[#002a4d] rounded-xl p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">1,456</h3>
                    <p className="text-blue-100">Total Properties</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#cb2926] to-[#00162d] rounded-xl p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">89</h3>
                    <p className="text-blue-100">Average Rating</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">78%</h3>
                    <p className="text-green-100">Occupancy Rate</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">$125,700</h3>
                    <p className="text-blue-100">Monthly Revenue</p>
                  </div>
                </div>
              </div>


              {/* Recent Bookings */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#00162d] to-[#002a4d] text-white">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Check-In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Check-Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                <img src={b.image} alt={b.property} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{b.property}</div>
                                <div className="text-xs text-gray-500">{b.guest}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{b.checkIn}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{b.checkOut}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.status === 'completed' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right"><span className="font-medium text-gray-800">{b.revenue}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Properties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Performing Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topProperties.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{p.name}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Star className="text-yellow-400 mr-1" size={14} />
                            <span>{p.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">{p.revenue}</div>
                        <div className="text-sm text-gray-500">{p.bookings} bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
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
    </div>
  );
};

export default Dashboard;
