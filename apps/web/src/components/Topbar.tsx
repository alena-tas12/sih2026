import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Search, LogOut } from 'lucide-react';

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const path = location.pathname === '/' ? 'Overview' : 
               location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  const handleLogout = () => {
    localStorage.removeItem('genesis_auth');
    localStorage.removeItem('genesis_user');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Search feature triggered for: ${searchQuery}`);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#000', borderBottom: '1px solid #333', color: '#fff' }}>
      <div className="crumb text-sm text-gray-400">
        Genesis <span style={{ margin: '0 8px', color: '#666' }}>/</span> <b className="text-white">{path}</b>
      </div>
      
      <div className="top-actions flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input 
            className="search bg-neutral-900 border border-neutral-700 text-white rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-white transition-colors" 
            placeholder="Search cases, rules..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <button 
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors flex items-center" 
          onClick={() => navigate('/scan')}
        >
          📷 Scan
        </button>
        
        <button 
          className="text-gray-400 hover:text-white transition-colors p-1"
          onClick={() => alert('No new notifications')}
          title="Notifications"
        >
          <Bell size={20} />
        </button>
        
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setShowProfile(!showProfile)}
            title="Profile"
          >
            <User size={20} />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-md shadow-xl z-50">
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-sm text-white font-medium">System Administrator</p>
                <p className="text-xs text-gray-400">admin@genesis.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 flex items-center"
              >
                <LogOut size={16} className="mr-2" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
