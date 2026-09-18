import React, { useState } from 'react';
import { Search, Bell, Menu, User, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

interface TopbarProps {
  onToggleSidebar: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  globalSearch,
  setGlobalSearch,
}) => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleNotificationClick = () => {
    setHasUnreadNotifications(false);
    showAlert('System update: All financial ledgers reconciled successfully.', 'info');
  };

  return (
    <header className="h-20 bg-penta-bg/95 backdrop-blur-md sticky top-0 z-30 border-b border-penta-border/40 px-6 lg:px-10 flex items-center justify-between">
      {/* Left side: Hamburger button + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 lg:hidden text-penta-muted hover:text-white rounded-lg hover:bg-penta-card"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
      </div>

      {/* Right side: Search, Notification, User Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Search input pill matching Figma */}
        <div className="relative hidden sm:block w-48 md:w-64 lg:w-72">
          <input
            type="text"
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-penta-card border border-penta-border/70 rounded-full py-2 pl-9 pr-4 text-sm text-penta-text placeholder-penta-dim focus:outline-none focus:border-penta-green/60 focus:ring-1 focus:ring-penta-green/40 transition-all"
          />
          <Search className="w-4 h-4 text-penta-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notifications Icon */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2.5 rounded-full bg-penta-card border border-penta-border/60 text-penta-muted hover:text-white hover:border-penta-border transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-penta-yellow rounded-full ring-2 ring-penta-card" />
          )}
        </button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-full hover:ring-2 hover:ring-penta-green/40 transition-all"
            aria-label="User profile menu"
          >
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'Analyst'}
              className="w-10 h-10 rounded-full object-cover border border-penta-border ring-1 ring-penta-green/30"
            />
          </button>

          {/* Profile dropdown */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-3 w-56 bg-penta-card border border-penta-border rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
              onClick={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2.5 border-b border-penta-border/60">
                <p className="text-sm font-semibold text-white">{user?.name || 'Alex Vance'}</p>
                <p className="text-xs text-penta-muted truncate">{user?.email || 'analyst@penta.io'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-penta-green/10 text-penta-green rounded-md border border-penta-green/20">
                  {user?.role || 'Financial Analyst'}
                </span>
              </div>

              <div className="pt-1.5 space-y-1">
                <button
                  onClick={() => showAlert('Profile settings updated', 'success')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-penta-text hover:bg-penta-border/40 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-penta-muted" />
                  Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
