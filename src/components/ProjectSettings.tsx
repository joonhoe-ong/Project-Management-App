import React, { useState } from 'react';
import { ProjectInfo, NavScreen } from '../types';
import { SubscriptionPricing } from './SubscriptionPricing';

interface ProjectSettingsProps {
  project: ProjectInfo;
  onUpdateProject: (p: Partial<ProjectInfo>) => void;
  initialTab?: 'general' | 'subscription';
  onSelectScreen?: (screen: NavScreen) => void;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  project,
  onUpdateProject,
  initialTab = 'general',
  onSelectScreen,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription'>(initialTab);
  const [name, setName] = useState(project.name);
  const [sprintName, setSprintName] = useState(project.sprintName);
  const [client, setClient] = useState(project.clientSponsor || '');
  const [projectedCost, setProjectedCost] = useState(String(project.projectedCost));
  const [disqusShortname, setDisqusShortname] = useState(project.disqusShortname || 'optiplan-pro');
  const [overallocThreshold, setOverallocThreshold] = useState('110');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject({
      name,
      sprintName,
      clientSponsor: client,
      projectedCost: parseFloat(projectedCost) || 150000,
      disqusShortname: disqusShortname.trim().toLowerCase() || 'optiplan-pro',
    });

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Settings & Workspace Administration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage project metadata, AI risk parameters, comment integrations, and workspace subscription plans.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>General & AI Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'subscription'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          <span>Subscription Plans & Billing</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            Pro Active
          </span>
        </button>
      </div>

      {/* Tab Content 1: General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {savedAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Project configuration saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Workspace Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Workspace Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sprint / Active Phase Name
                  </label>
                  <input
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client / Sponsor
                  </label>
                  <input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Budget Allocation ($)
                  </label>
                  <input
                    type="number"
                    value={projectedCost}
                    onChange={(e) => setProjectedCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Risk Thresholds & AI Parameters */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                AI Optimization & Risk Thresholds
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Over-allocation Alert Threshold (%)
                  </label>
                  <select
                    value={overallocThreshold}
                    onChange={(e) => setOverallocThreshold(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="100">100% Capacity</option>
                    <option value="110">110% Capacity (Default)</option>
                    <option value="120">120% Capacity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Auto-Reschedule Conflict Resolution
                  </label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:bg-white focus:outline-none">
                    <option value="balanced">Balanced (Prioritize Critical Path)</option>
                    <option value="cost">Cost-Minimizing</option>
                    <option value="speed">Speed-Fastest Completion</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Disqus Integration */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">forum</span>
                  Disqus Platform Comments Configuration
                </h3>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Active Widget
                </span>
              </div>

              <div className="text-xs space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Disqus Forum Shortname
                  </label>
                  <input
                    type="text"
                    value={disqusShortname}
                    onChange={(e) => setDisqusShortname(e.target.value)}
                    placeholder="e.g. optiplan-pro"
                    className="w-full sm:w-80 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your unique Disqus forum shortname (from <a href="https://disqus.com/admin" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">disqus.com/admin</a>). Used for project discussions and task comment threads.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs transition-all active:scale-95"
              >
                Save Project Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content 2: Subscription Pricing */}
      {activeTab === 'subscription' && (
        <div className="bg-slate-50/50 rounded-2xl p-2 border border-slate-200/80">
          <SubscriptionPricing onSelectScreen={onSelectScreen} />
        </div>
      )}
    </div>
  );
};
