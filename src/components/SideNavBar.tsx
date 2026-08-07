import React, { useState } from 'react';
import { NavScreen, ProjectInfo } from '../types';

interface SideNavBarProps {
  currentScreen: NavScreen;
  onSelectScreen: (screen: NavScreen) => void;
  onOpenAutoOptimize: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  projects: ProjectInfo[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenCreateProject: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenAutoOptimize,
  mobileOpen,
  onCloseMobile,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCreateProject,
}) => {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const navItems: { id: NavScreen; label: string; icon: string }[] = [
    { id: 'optimization', label: 'Dashboard', icon: 'dashboard' },
    { id: 'gantt', label: 'Gantt Chart', icon: 'timeline' },
    { id: 'task-board', label: 'Task Board', icon: 'view_kanban' },
    { id: 'resource-allocation', label: 'Resource Allocation', icon: 'group_work' },
    { id: 'resource-management', label: 'Resource Management', icon: 'account_balance_wallet' },
    { id: 'settings', label: 'Project Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <nav
        className={`fixed left-0 top-0 h-full w-[240px] flex flex-col z-50 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Project Selector Toggle */}
        <div className="relative border-b border-slate-800 shrink-0">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="w-full h-16 flex items-center justify-between px-4 hover:bg-slate-800/80 transition-colors text-left group"
            title="Click to switch projects or create a new project"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">dataset</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xs font-bold text-white truncate leading-tight flex items-center gap-1">
                  <span className="truncate">{activeProject?.name || 'Project'}</span>
                </h1>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {activeProject?.sprintName || 'Active Sprint'}
                </p>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-slate-400 group-hover:text-white transition-transform text-[18px] shrink-0 ml-1 ${
                showProjectDropdown ? 'rotate-180' : ''
              }`}
            >
              unfold_more
            </span>
          </button>

          {/* Project Toggle Dropdown */}
          {showProjectDropdown && (
            <div className="absolute left-2 right-2 top-[68px] z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 bg-slate-900/80 border-b border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Project ({projects.length})
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto p-1.5 space-y-1">
                {projects.map((proj) => {
                  const isSelected = proj.id === activeProjectId;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj.id);
                        setShowProjectDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold truncate">{proj.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {proj.clientSponsor || 'Internal Workspace'}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-blue-400 text-[18px] shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* + New Project Button inside Project Selector */}
              <div className="p-2 border-t border-slate-700/60 bg-slate-900/60">
                <button
                  onClick={() => {
                    setShowProjectDropdown(false);
                    onOpenCreateProject();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  New Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Views & Navigation
          </div>
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScreen(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center h-9 px-3 rounded-md transition-all text-xs font-semibold text-left group ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined mr-3 text-[18px] transition-transform group-hover:scale-105 ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto-Optimize Action Button */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              onOpenAutoOptimize();
              onCloseMobile();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs tracking-wide h-9 rounded-md flex items-center justify-center transition-all shadow-xs"
          >
            <span className="material-symbols-outlined mr-2 text-[16px] animate-pulse">
              auto_awesome
            </span>
            Auto-Optimize
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto px-3 py-3 space-y-1 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => alert('OptiPlan Pro Help Center & Documentation loaded!')}
            className="w-full flex items-center h-8 text-slate-400 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined mr-3 text-[18px]">help</span>
            Help Center
          </button>
          <button
            onClick={() => alert('Logged out successfully.')}
            className="w-full flex items-center h-8 text-slate-400 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined mr-3 text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};
