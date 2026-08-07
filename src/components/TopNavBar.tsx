import React, { useState } from 'react';

interface TopNavBarProps {
  onToggleMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateProject?: () => void;
  unreadNotificationsCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onToggleMobile,
  searchQuery,
  onSearchChange,
  unreadNotificationsCount = 2
}) => {
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Bottleneck Detected',
      desc: 'Database Schema Design is blocking 8 tasks',
      time: '10m ago',
      unread: true
    },
    {
      id: 'n2',
      title: 'Resource Overallocated',
      desc: 'Alex D. is at 115% average capacity',
      time: '1h ago',
      unread: true
    },
    {
      id: 'n3',
      title: 'Sprint 42 Status',
      desc: '12 tasks completed this week',
      time: '3h ago',
      unread: false
    }
  ];

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 h-14 bg-white border-b border-slate-200 z-30 shrink-0 sticky top-0 shadow-xs">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobile}
          className="md:hidden text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors"
          title="Toggle Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>OptiPlan Pro</span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            Enterprise
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 md:mx-8 hidden sm:block relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
          search
        </span>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 bg-slate-100 rounded-full border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
          placeholder="Search tasks, resources, bottlenecks..."
          type="text"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-semibold text-xs text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      n.unread ? 'bg-blue-50/70 border border-blue-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 flex justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => alert('OptiPlan Pro v2.4 - Optimization Engine Active')}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
          title="Help"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>

        <button
          onClick={() => alert('Global Preferences & Optimization Rules')}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        {/* User Profile */}
        <div
          className="ml-1 w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 ring-indigo-500 transition-all shrink-0"
          title="Sarah Connor (Project Lead)"
        >
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsK8q1GY7ygiqmCM-T_EubIS8yQyPTujqbDGfiTVPSJ0XFUUUeknhkyk6hARg7DOfa35n-kN6h09gXkmwR6uS028Xox2p61A6xKVhQ8fGQcOav9flsqqz5EDv4wjYHDHuC9mQFiNr334JqWHDgIdOGLeyl2yBQeDLZbb6_Ept7Ea5jmmpy9vA7lXNhJmcUjhwig8reDdf952lVfDs38dy6IxPfMdLSt6CERLe48FIln73PujGeEYY"
          />
        </div>
      </div>
    </header>
  );
};
