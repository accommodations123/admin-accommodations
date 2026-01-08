import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp
} from 'lucide-react';

const Community = () => {
  // Mock Data
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: 'Digital Nomads of Berlin',
      slug: 'digital-nomads-berlin',
      members: 1240,
      admin: 'Sarah Jenkins',
      status: 'Active',
      created: 'Oct 24, 2023',
      avatar: 'D'
    },
    {
      id: 2,
      name: 'Remote Workers Global',
      slug: 'remote-workers-global',
      members: 850,
      admin: 'Mike Ross',
      status: 'Pending',
      created: 'Nov 01, 2023',
      avatar: 'R'
    },
    {
      id: 3,
      name: 'Expats in Thailand',
      slug: 'expats-thailand',
      members: 5420,
      admin: 'Suki Wang',
      status: 'Active',
      created: 'Sep 12, 2023',
      avatar: 'E'
    },
    {
      id: 4,
      name: 'Travel Buddies India',
      slug: 'travel-buddies-india',
      members: 320,
      admin: 'Raj Kumar',
      status: 'Suspended',
      created: 'Dec 05, 2023',
      avatar: 'T'
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Suspended':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#00162d] text-white font-sans p-6 lg:p-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Community</h1>
          <p className="text-slate-400 mt-2">Manage all user groups and communities.</p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-[#cb2926] to-[#a71f1c] hover:from-[#d93a37] hover:to-[#b72626] text-white px-6 py-3 rounded-xl shadow-lg shadow-red-900/20 transition-all duration-300 font-medium">
          <Plus className="w-5 h-5" />
          Create Community
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-[#001f3d] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-[#cb2926]" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Communities</p>
            <h3 className="text-3xl font-bold text-white">1,245</h3>
            <div className="flex items-center mt-4 text-green-400 text-sm bg-green-500/10 w-max px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#001f3d] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Members</p>
            <h3 className="text-3xl font-bold text-white">54.2K</h3>
             <div className="flex items-center mt-4 text-green-400 text-sm bg-green-500/10 w-max px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2%
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#001f3d] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-purple-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Active Groups</p>
            <h3 className="text-3xl font-bold text-white">890</h3>
             <div className="flex items-center mt-4 text-slate-500 text-sm bg-slate-500/10 w-max px-2 py-1 rounded-md">
              Stable
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search communities by name or admin..."
            className="w-full bg-[#001f3d] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#cb2926] focus:ring-1 focus:ring-[#cb2926]/50 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#001f3d] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#002547] text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4 font-semibold">Community Name</th>
                <th className="px-6 py-4 font-semibold">Admin</th>
                <th className="px-6 py-4 font-semibold">Members</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {communities.map((community) => (
                <tr key={community.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cb2926] to-[#a71f1c] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {community.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{community.name}</p>
                        <p className="text-slate-500 text-xs">{community.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{community.admin}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{community.members.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(community.status)}`}>
                      {community.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{community.created}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-[#cb2926] hover:text-white text-slate-300 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-red-500 hover:text-white text-slate-300 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#002547]/50">
          <p className="text-slate-400 text-sm">Showing 1 to 4 of 1245 communities</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors">Prev</button>
            <button className="px-3 py-1 rounded-md bg-[#cb2926] text-white shadow-lg shadow-red-900/20">1</button>
            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors">2</button>
            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors">3</button>
            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Community;