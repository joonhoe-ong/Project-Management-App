import React, { useState } from 'react';
import { Resource } from '../types';

interface ResourceManagementProps {
  resources: Resource[];
  onUpdateMonthlyCost: (resourceId: string, newCost: number) => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'capacityAvg'>) => void;
  onDeleteResource: (resourceId: string) => void;
  onUpdateResourceCapacity?: (resourceId: string, day: number, newCapacity: number) => void;
  onBalanceWorkload?: () => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  onUpdateMonthlyCost,
  onAddResource,
  onDeleteResource,
  onUpdateResourceCapacity,
  onBalanceWorkload,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'heatmap' | 'projects'>('roster');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  
  // Add Resource Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<'Engineering' | 'Design' | 'Management' | 'Marketing' | 'QA'>('Engineering');
  const [cost, setCost] = useState('10000');

  // Heatmap editing state
  const [editingCell, setEditingCell] = useState<{ resId: string; day: number } | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const filteredResources = selectedDeptFilter === 'All'
    ? resources
    : resources.filter((r) => r.department === selectedDeptFilter);

  const totalMonthlyCost = resources.reduce((acc, r) => acc + (r.monthlyCost || 0), 0);
  const overallocatedCount = resources.filter((r) => r.capacityAvg > 100).length;
  const availableCount = resources.filter((r) => r.capacityAvg < 85).length;

  const totalWeeklyHours = resources.length * 40;
  const allocatedWeeklyHours = resources.reduce(
    (acc, r) => acc + Math.round((r.capacityAvg / 100) * 40),
    0
  );
  const availableWeeklyHours = Math.max(0, totalWeeklyHours - allocatedWeeklyHours);
  const avgUtilization = Math.round(
    resources.reduce((acc, r) => acc + r.capacityAvg, 0) / (resources.length || 1)
  );

  // Department cost breakdown
  const deptCosts: Record<string, number> = {};
  resources.forEach((r) => {
    deptCosts[r.department] = (deptCosts[r.department] || 0) + r.monthlyCost;
  });

  const days = Array.from({ length: 14 }, (_, i) => i + 1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    onAddResource({
      name,
      role,
      department,
      monthlyCost: parseFloat(cost) || 8000,
      initials,
    });

    setName('');
    setRole('');
    setCost('10000');
    setShowAddModal(false);
  };

  const handleCellClick = (resId: string, day: number, currentVal: number) => {
    setEditingCell({ resId, day });
    setTempValue(String(currentVal || 0));
  };

  const handleSaveCell = () => {
    if (editingCell && onUpdateResourceCapacity) {
      const val = parseInt(tempValue, 10);
      if (!isNaN(val) && val >= 0 && val <= 300) {
        onUpdateResourceCapacity(editingCell.resId, editingCell.day, val);
      }
      setEditingCell(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resource Management & Allocation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track team availability, weekly capacity, workload distribution, and manpower budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBalanceWorkload && (
            <button
              onClick={onBalanceWorkload}
              className="bg-slate-800 hover:bg-slate-900 text-white py-2 px-3.5 rounded-md font-semibold text-xs flex items-center shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined mr-1.5 text-[16px] text-blue-400 animate-spin-slow">
                auto_awesome
              </span>
              Balance Workload
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-xs flex items-center shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined mr-1.5 text-[18px]">add</span>
            Add Resource
          </button>
        </div>
      </div>

      {/* Top Resource Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Cost */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Monthly Budget
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              ${totalMonthlyCost.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {resources.length} Team Members
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
        </div>

        {/* Total Availability */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Free Capacity
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
              {availableWeeklyHours} hrs<span className="text-xs font-normal text-slate-500"> /wk</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {availableCount} member{availableCount !== 1 ? 's' : ''} available for tasks
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[22px]">person_add</span>
          </div>
        </div>

        {/* Average Utilization */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Avg Utilization
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {avgUtilization}%
            </div>
            <div className="w-24 bg-slate-100 h-1.5 mt-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${avgUtilization > 100 ? 'bg-rose-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(avgUtilization, 100)}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <span className="material-symbols-outlined text-[22px]">speed</span>
          </div>
        </div>

        {/* Overallocated Alert */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Workload Risk
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {overallocatedCount} <span className="text-xs font-normal text-rose-600 font-semibold">Overloaded</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {overallocatedCount > 0 ? 'Requires balancing' : 'Workload is balanced'}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            overallocatedCount > 0 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            Team Availability & Roster
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'heatmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
            Capacity & Daily Heatmap
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">pie_chart</span>
            Dept & Project Distribution
          </button>
        </div>

        {/* Filter */}
        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="h-8 px-3 border border-slate-300 rounded-md bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
        >
          <option value="All">All Departments ({resources.length})</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Management">Management</option>
          <option value="QA">QA</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* TAB 1: TEAM AVAILABILITY & ROSTER TABLE */}
      {activeTab === 'roster' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>Resource Roster & Availability Status</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              Showing {filteredResources.length} members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Resource Name</th>
                  <th className="p-4">Role & Dept</th>
                  <th className="p-4">Availability Status</th>
                  <th className="p-4">Weekly Capacity</th>
                  <th className="p-4 text-right">Monthly Cost ($)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredResources.map((res) => {
                  const allocatedHours = Math.round((res.capacityAvg / 100) * 40);
                  const freeHours = Math.max(0, 40 - allocatedHours);

                  let availBadge = {
                    label: `Available (${freeHours} hrs free)`,
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    dot: 'bg-emerald-500',
                  };

                  if (res.capacityAvg > 100) {
                    availBadge = {
                      label: `Overallocated (${allocatedHours - 40} hrs over)`,
                      bg: 'bg-rose-50 text-rose-700 border-rose-200',
                      dot: 'bg-rose-500',
                    };
                  } else if (res.capacityAvg >= 85) {
                    availBadge = {
                      label: `At Capacity (40 hrs)`,
                      bg: 'bg-amber-50 text-amber-800 border-amber-200',
                      dot: 'bg-amber-500',
                    };
                  }

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          {res.avatar ? (
                            <img
                              src={res.avatar}
                              alt={res.name}
                              className="w-8 h-8 rounded-full object-cover mr-3 border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mr-3 border border-blue-200">
                              {res.initials}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{res.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {res.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-slate-800 font-medium">{res.role}</div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          {res.department}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[10px] border ${availBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${availBadge.dot}`} />
                          {availBadge.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                res.capacityAvg > 100
                                  ? 'bg-rose-500'
                                  : res.capacityAvg >= 85
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(res.capacityAvg, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {res.capacityAvg}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <input
                          type="number"
                          value={res.monthlyCost}
                          onChange={(e) =>
                            onUpdateMonthlyCost(res.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-28 text-right bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 font-mono text-xs text-slate-900 font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors outline-none"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => onDeleteResource(res.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove resource"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CAPACITY & DAILY HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="h-12 border-b border-slate-200 flex flex-wrap items-center justify-between px-4 bg-slate-50/80 shrink-0 gap-2">
            <h3 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                calendar_month
              </span>
              Daily Allocation & Capacity Heatmap
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-slate-100 rounded border border-slate-300"></div>
                <span>Available (&lt;70%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-100 rounded border border-blue-300"></div>
                <span>Optimal (70-90%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-rose-100 rounded border border-rose-300"></div>
                <span className="text-rose-700 font-semibold">Overallocated (&gt;100%)</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto relative">
            <div className="flex w-max min-w-full">
              {/* Team Member Column */}
              <div className="sticky left-0 bg-white z-20 w-64 border-r border-slate-200 flex flex-col shadow-xs">
                <div className="h-9 border-b border-slate-200 flex items-center px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Resource Name
                </div>
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="h-12 border-b border-slate-100 flex items-center px-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-200 relative bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {res.avatar ? (
                          <img src={res.avatar} alt={res.name} className="w-full h-full object-cover" />
                        ) : (
                          res.initials
                        )}
                        {res.capacityAvg > 100 && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {res.name}
                        </span>
                        <span className={`text-[10px] font-mono ${res.capacityAvg > 100 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          {res.capacityAvg}% Avg Load
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="flex flex-col flex-1 min-w-[700px]">
                <div className="h-9 border-b border-slate-200 flex">
                  {days.map((d) => (
                    <div
                      key={d}
                      className="flex-1 flex items-center justify-center font-mono text-[11px] font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/50"
                    >
                      Oct {d < 10 ? `0${d}` : d}
                    </div>
                  ))}
                </div>

                {filteredResources.map((res) => (
                  <div key={res.id} className="h-12 border-b border-slate-100 flex">
                    {days.map((d) => {
                      const cap = res.dailyCapacity?.[d] ?? 0;
                      const isEditing = editingCell?.resId === res.id && editingCell?.day === d;

                      let cellBg = 'bg-slate-50 border-slate-200/50 text-slate-500';
                      if (cap === 0) {
                        cellBg = 'bg-slate-100/40 text-slate-300';
                      } else if (cap >= 70 && cap <= 100) {
                        cellBg = 'bg-blue-100 text-blue-800 font-semibold border-blue-200';
                      } else if (cap > 100) {
                        cellBg = 'bg-rose-100 text-rose-700 font-bold border-rose-300';
                      } else {
                        cellBg = 'bg-emerald-50 text-emerald-800 font-medium border-emerald-200';
                      }

                      return (
                        <div key={d} className="flex-1 p-[2px] border-r border-slate-100">
                          {isEditing ? (
                            <input
                              type="number"
                              autoFocus
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              onBlur={handleSaveCell}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCell();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              className="w-full h-full bg-white border-2 border-blue-600 text-center font-mono text-xs outline-none rounded"
                            />
                          ) : (
                            <div
                              onClick={() => handleCellClick(res.id, d, cap)}
                              className={`w-full h-full rounded-sm flex items-center justify-center font-mono text-[10px] cursor-pointer hover:scale-105 transition-all shadow-2xs border ${cellBg}`}
                              title={`Oct ${d}: ${cap}% Capacity. Click to edit.`}
                            >
                              {cap > 0 ? `${cap}%` : '-'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENT & PROJECT DISTRIBUTION */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dept Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
              Cost & Resource Count by Department
            </h4>
            <div className="space-y-4">
              {Object.entries(deptCosts).map(([dept, deptAmt]) => {
                const pct = totalMonthlyCost > 0 ? Math.round((deptAmt / totalMonthlyCost) * 100) : 0;
                const count = resources.filter((r) => r.department === dept).length;
                return (
                  <div key={dept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">
                        {dept} ({count} members)
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">
                        ${deptAmt.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          dept === 'Engineering'
                            ? 'bg-blue-600'
                            : dept === 'Design'
                            ? 'bg-purple-600'
                            : dept === 'Management'
                            ? 'bg-slate-600'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Workload Distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                Active Project Workload Breakdown
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Sprint 42 Optimization</span>
                    <span className="text-[11px] text-slate-500">45% of total team capacity</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    High Priority
                  </span>
                </div>

                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Database & Platform Migration</span>
                    <span className="text-[11px] text-slate-500">30% of total team capacity</span>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Analytics & Reporting Engine</span>
                    <span className="text-[11px] text-slate-500">25% of total team capacity</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Planning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Add New Team Member</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                  Role
                </label>
                <input
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Data Analyst"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) =>
                      setDepartment(
                        e.target.value as 'Engineering' | 'Design' | 'Management' | 'Marketing' | 'QA'
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="QA">QA</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Monthly Cost ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                Save Resource
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
