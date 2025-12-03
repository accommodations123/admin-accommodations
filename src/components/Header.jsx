import { Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#00162d] shadow-md border-l-4 border-[#cb2926] sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">

        {/* LEFT SIDE TITLE */}
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          NextKinLife Admin Panel
        </h1>

        {/* RIGHT SIDE ICON MENU */}
        <div className="flex items-center space-x-6">

          {/* NOTIFICATION ICON */}
          <button className="relative text-blue-100 hover:text-white transition">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#cb2926] rounded-full"></span>
          </button>

          {/* PROFILE ICON */}
          <button className="flex items-center space-x-2 text-blue-100 hover:text-white transition">
            <User size={22} />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
