import React, { useState } from 'react';
import { Resource } from '../types';

interface ResourceAllocationProps {
  resources: Resource[];
  onUpdateResourceCapacity: (resourceId: string, day: number, newCapacity: number) => void;
  onBalanceWorkload: () => void;
}

export const ResourceAllocation: React.FC<ResourceAllocationProps> = ({
  resources,
  onUpdateResourceCapacity,
  onBalanceWorkload
}) => {
  const [editingCell, setEditingCell] = useState<{ resId: string; day: number } | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');

  const filteredResources = selectedDeptFilter === 'All'
    ? resources
    : resources.filter((r) => r.department === selectedDeptFilter);

  const overallocatedCount = resources.filter((r) => r.capacityAvg > 100).length;
  const avgUtilization = Math.round(
    resources.reduce((acc, r) => acc + r.capacityAvg, 0) / (resources.length || 1)
  );

  const days = Array.from({ length: 14 }, (_, i) => i + 1);

  const handleCellClick = (resId: string, day: number, currentVal: number) => {
    setEditingCell({ resId, day });
    setTempValue(String(currentVal || 0));
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const val = parseInt(tempValue, 10);
      if (!isNaN(val) && val >= 0 && val <= 300) {
        onUpdateResourceCapacity(editingCell.resId, editingCell.day, val);
      }
      setEditingCell(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resource Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage team workload and identify overallocation risks for October.
          </p>
        </div>
        <div className="flex gap-2.5">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="h-8 px-3 border border-slate-300 rounded-md bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Management">Management</option>
            <option value="QA">QA</option>
          </select>
          <button
            onClick={onBalanceWorkload}
            className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1.5 shadow-xs font-semibold text-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] animate-spin-slow">
              auto_awesome
            </span>
            Balance Workload
          </button>
        </div>
      </div>

      {/* Bento Grid Top Section */}
      <div className="grid grid-cols-12 gap-4">
        {/* Overload & Avg Cards */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
          {/* Stat Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-bl-full -z-0"></div>
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Critical Overload
              </span>
              <span className="material-symbols-outlined text-rose-600 text-[20px]">warning</span>
            </div>
            <div className="mt-3 z-10">
              <span className="text-3xl font-bold text-slate-900 block">
                {overallocatedCount}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Team members &gt; 100% capacity
              </span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Avg Utilization
              </span>
              <span className="material-symbols-outlined text-blue-600 text-[20px]">
                data_usage
              </span>
            </div>
            <div className="mt-3 z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{avgUtilization}%</span>
                <span className="text-xs font-semibold text-blue-600 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 2%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    avgUtilization > 100 ? 'bg-rose-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(avgUtilization, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="col-span-12 md:col-span-9 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[460px]">
          {/* Heatmap Header */}
          <div className="h-12 border-b border-slate-200 flex flex-wrap items-center justify-between px-4 bg-slate-50/80 shrink-0 gap-2">
            <h2 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                calendar_month
              </span>
              October Allocation Heatmap
            </h2>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-slate-100 rounded border border-slate-300"></div>
                <span>Available</span>
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

          {/* Calendar Grid Container */}
          <div className="flex-1 overflow-auto relative">
            <div className="flex w-max min-w-full">
              {/* Sticky Team Member List Column */}
              <div className="sticky left-0 bg-white z-20 w-60 border-r border-slate-200 flex flex-col shadow-xs">
                <div className="h-9 border-b border-slate-200 flex items-center px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Resource
                </div>
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="h-12 border-b border-slate-100 flex items-center px-4 hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-200 relative bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {res.avatar ? (
                          <img
                            src={res.avatar}
                            alt={res.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          res.initials
                        )}
                        {res.capacityAvg > 100 && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {res.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono ${
                            res.capacityAvg > 100 ? 'text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {res.capacityAvg}% Avg
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline / Heatmap Area */}
              <div className="flex flex-col flex-1 min-w-[700px]">
                {/* Timeline Header (Days 01 - 14) */}
                <div className="h-9 border-b border-slate-200 flex">
                  {days.map((d) => (
                    <div
                      key={d}
                      className="flex-1 flex items-center justify-center font-mono text-[11px] font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/50"
                    >
                      {d < 10 ? `0${d}` : d}
                    </div>
                  ))}
                </div>

                {/* Heatmap Rows */}
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
                        cellBg = 'bg-slate-100 text-slate-700 font-medium border-slate-200';
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
                              title={`Day ${d}: ${cap}% Capacity. Click to edit.`}
                            >
                              {cap > 0 ? cap : '-'}
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
      </div>

      {/* Secondary Content: Workload Distribution by Project */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4">
          Workload Distribution by Project
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Card 1 */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer group relative overflow-hidden bg-slate-50/50">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-lg"></div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                Project Alpha
              </h4>
              <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                High Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Consuming 45% of total team capacity.</p>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative z-30">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1NDoafaWy4atgT9sFMDq4R3H34KpAQDf4boPgx-KYJQTFyKBEB_TTD10Emcndoom3-zQ_sj9HsK8rsduW2uUdvdAKmCuOkJr4YQlP_3GjugPkB6aJbIyU37PS65T9lZ1DSKcGK9SNf0HEzC4vVao9wOCwdwyYPMrUq2O7g9hCM1ewSNWkCaLBJRVzh4EBAVopAN6-9TMAlzontjL8aWS1eRAJjK56z3Jc4sBpVlR1Q972BRqsx-w"
                  alt="Jane Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative z-20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb3LgL4x3WnUF143txAKv65er3gbgE_3QgGxUBUU--c21ZPwoR2nRkn9Uq1hA94sNY-HgW-_sAeX8bG7B2pJ5SSDG49mjA3K9Yv1g0sw9S8eXRsNeuOouiCcnexXMVa_1C_39_lu8_-ZCobcOp9hfMqZmuXd-pBUT1IWxv1_ScvRz0b1k-uixWnmWn3nHXCz1YYxGd3xc6JpMT320OR85q7rka_xhGOii-hPtgelDOjHKQv_1gR6M"
                  alt="Alex Smith"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold relative z-10">
                +3
              </div>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer group relative overflow-hidden bg-slate-50/50">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400 rounded-l-lg"></div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                Beta Migration
              </h4>
              <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Consuming 30% of total team capacity.</p>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative z-30">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeWvd4csYdv4-PB0TNS3_g2Vj-m_0NzOKicPHlwLJ8A_gO--KJ9A-vhfi6AkQcyAoGgFYrCBeZhcCj89QPstSgVn8iv76pGW3eAfSxk_JcEQ5uDllxk_TtZN1jABoDDT-Sl81D_xgYA-NhY9x9ArxQ_FllxiVUDg09g5T4U_5eTgL5wS2oN9SbHFTO-2mBzgfPG7-y1XYxhGcukbg8mqj66my1lr6-O1WZA5HW7_DJTlVvDvgLxDw"
                  alt="Elena R."
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold relative z-20">
                +1
              </div>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer group relative overflow-hidden bg-slate-50/50">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-lg"></div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                Gamma Analytics Engine
              </h4>
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Planning
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Consuming 25% of total team capacity.</p>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold relative z-20">
                RJ
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold relative z-10">
                MK
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
