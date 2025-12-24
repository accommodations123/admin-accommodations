const Header = () => {
  return (
    <header className="bg-[#00162d] shadow-sm border-l border-[#cb2926]">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Welcome to NextKinlife</h1>
        <div className="flex items-center space-x-4">
          {/* <span className="text-0">Admin User</span> */}
          <button className="bg-[#cb2926] text-white px-4 py-2 rounded-md ">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;