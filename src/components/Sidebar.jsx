import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Building,
  Briefcase,
  CheckCircle,
  LogOut,
  ShoppingBag,
  ChevronRight,
  Users // <--- Added this import
} from 'lucide-react';

import logo from '/nextkinlife-logo.jpeg';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, end: true },
    { name: 'Hosting Approval', path: '/dashboard/hosting-approval', icon: CheckCircle },
    { name: 'Accommodation', path: '/dashboard/accommodation', icon: Building },
    { name: 'Events', path: '/dashboard/events', icon: Calendar },
    { name: 'Career', path: '/dashboard/career', icon: Briefcase },
    { name: 'Community', path: '/dashboard/community', icon: Users }, // <--- Added this line
    { name: 'Buy and Sell', path: '/dashboard/buy-and-sell', icon: ShoppingBag },
  ];

  // Premium Link Styling using your colors
  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 mt-1.5 transition-all duration-300 rounded-lg border border-transparent ${isActive
      ? 'bg-gradient-to-r from-[#cb2926] to-[#a71f1c] text-white shadow-lg shadow-red-900/40 font-medium'
      : 'text-blue-200 hover:bg-[#001f3d] hover:border-[#001f3d] hover:text-white'
    }`;

  const handleLogout = () => {
    // Optional: Add a confirmation modal here
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) { // Fixed syntax here
      localStorage.removeItem("admin-auth");
      navigate("/login");
    }
  };

  return (
    <aside className="w-72 bg-[#00162d] text-white flex-shrink-0 h-screen sticky top-0 flex flex-col justify-between font-sans border-r border-white/5">

      {/* TOP SECTION: LOGO */}
      <div>
        <div className="h-20 flex items-center justify-center border-b border-white/5 shadow-lg shadow-black/20 backdrop-blur-md">
          <img
            src={logo}
            alt="NextKinLife Logo"
            className="h-12 w-auto object-contain drop-shadow-md" 
          />
        </div>

        {/* MENU ITEMS */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={linkClasses}
              end={item.end || false}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {/* Subtle Arrow on hover */}
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${linkClasses({isActive: false}).includes('bg-gradient') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BOTTOM SECTION: USER PROFILE & LOGOUT */}
      <div className="p-4 mb-2">
        
        {/* Mini User Profile Card for Premium Look */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#001f3d]/50 border border-white/5 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#cb2926] flex items-center justify-center text-white font-bold text-sm shadow-md">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Admin User</span>
            <span className="text-xs text-blue-300">Super Admin</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 text-red-300 hover:text-white hover:bg-[#cb2926] hover:shadow-lg hover:shadow-red-900/40 rounded-lg transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;