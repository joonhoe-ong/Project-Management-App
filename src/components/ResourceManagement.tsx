import React, { useState } from 'react';
import { Resource } from '../types';

interface ResourceManagementProps {
  resources: Resource[];
  onUpdateMonthlyCost: (resourceId: string, newCost: number) => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'capacityAvg'>) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  onUpdateMonthlyCost,
  onAddResource,
  onDeleteResource,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<'Engineering' | 'Design' | 'Management' | 'Marketing' | 'QA'>('Engineering');
  const [cost, setCost] = useState('10000');

  const totalMonthlyCost = resources.reduce((acc, r) => acc + (r.monthlyCost || 0), 0);

  // Calculate department cost breakdown percentages
  const deptCosts: Record<string, number> = {};
  resources.forEach((r) => {
    deptCosts[r.department] = (deptCosts[r.department] || 0) + r.monthlyCost;
  });

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resource Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage team allocations and track monthly manpower costs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-xs flex items-center shadow-xs transition-all active:scale-95"
        >
          <span className="material-symbols-outlined mr-1.5 text-[18px]">add</span>
          Add Resource
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* Main Table Area (Left 8 Cols) */}
        <div className="col-span-12 xl:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Active Team Members
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              {resources.length} Members Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Resource</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4 text-right">Monthly Cost ($)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {resources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-50/80 transition-colors group relative"
                  >
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
                        <span className="font-bold text-slate-900">{res.name}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">{res.role}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold ${
                          res.department === 'Engineering'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : res.department === 'Design'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : res.department === 'Management'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {res.department}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <input
                        type="number"
                        value={res.monthlyCost}
                        onChange={(e) =>
                          onUpdateMonthlyCost(res.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-28 text-right bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 font-mono text-xs text-slate-900 font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-white hover:border-slate-400 transition-colors outline-none"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Analytics Cards (4 Cols) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Total Cost Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 p-4 text-slate-200 pointer-events-none">
              <span className="material-symbols-outlined text-[64px]">
                account_balance_wallet
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Total Monthly Allocation
            </h4>
            <div className="text-3xl font-bold text-slate-900">
              ${totalMonthlyCost.toLocaleString()}
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-blue-600 font-bold flex items-center bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mr-2">
                <span className="material-symbols-outlined text-[14px] mr-0.5">
                  trending_up
                </span>
                4.2%
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>

          {/* Department Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex-1">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
              Cost by Department
            </h4>
            <div className="space-y-4">
              {Object.entries(deptCosts).map(([dept, deptAmt]) => {
                const pct = totalMonthlyCost > 0 ? Math.round((deptAmt / totalMonthlyCost) * 100) : 0;
                return (
                  <div key={dept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">{dept}</span>
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
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Add New Resource</h3>
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
