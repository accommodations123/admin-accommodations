import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Building,
  Briefcase,
  CheckCircle,
  LogOut,
  ShoppingBag, // Added this icon for Buy and Sell
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
    { name: 'Buy and Sell', path: '/dashboard/buy-and-sell', icon: ShoppingBag }, // Changed path and icon
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 mt-2 transition-colors duration-200 rounded-lg ${isActive
      ? 'bg-[#cb2926] text-white shadow-lg'
      : 'text-blue-200 hover:bg-[#cb2926] hover:text-white'
    }`;

  const handleLogout = () => {
    localStorage.removeItem("admin-auth"); // remove token
    navigate("/login"); // redirect to login
  };

  return (
    <aside className="w-64 bg-[#00162d] text-white flex-shrink-0 h-screen sticky top-0 flex flex-col justify-between">

      {/* LOGO */}
      <div>
        <div className="p-6 flex justify-center items-center">
          <img
            src={logo}
            alt="NextKinLife Logo"
            className="h-24 w-auto object-contain"
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
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div className="p-4 mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 bg-[#cb2926] text-white rounded-lg hover:bg-[#a71f1c] transition-all"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;