import React, { useState } from 'react';
import { ProjectInfo, Task, Resource, AISuggestion, BottleneckItem } from '../types';
import { generateProjectWordReport } from '../utils/docxExporter';

interface OptimizationDashboardProps {
  project: ProjectInfo;
  tasks: Task[];
  resources: Resource[];
  suggestions: AISuggestion[];
  bottlenecks: BottleneckItem[];
  onApplyOptimization: () => void;
  onApplySuggestion: (id: string) => void;
  onViewGantt: () => void;
  onViewResourceAllocation: () => void;
}

export const OptimizationDashboard: React.FC<OptimizationDashboardProps> = ({
  project,
  tasks,
  resources,
  suggestions,
  bottlenecks,
  onApplyOptimization,
  onApplySuggestion,
  onViewGantt,
  onViewResourceAllocation,
}) => {
  const [showPreviewBanner, setShowPreviewBanner] = useState(true);
  const [optimizationHistoryRange, setOptimizationHistoryRange] = useState('Last 30 Days');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: string; value: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const historyData30 = [
    { label: 'W1', value: 35, displayVal: '35%' },
    { label: 'W2', value: 45, displayVal: '45%' },
    { label: 'W3', value: 30, displayVal: '30%' },
    { label: 'W4', value: 65, displayVal: '65%' },
    { label: 'W5', value: 80, displayVal: '80%' },
    { label: 'Now', value: 87, displayVal: '87%' },
  ];

  const historyDataQuarter = [
    { label: 'M1', value: 20, displayVal: '20%' },
    { label: 'M2', value: 50, displayVal: '50%' },
    { label: 'M3', value: 72, displayVal: '72%' },
    { label: 'Now', value: 87, displayVal: '87%' },
  ];

  const activeHistory = optimizationHistoryRange === 'Last 30 Days' ? historyData30 : historyDataQuarter;

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      const blob = await generateProjectWordReport(
        project,
        tasks,
        resources,
        suggestions,
        bottlenecks
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, '_')}_Word_Report.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export Word report:', err);
      alert('Error generating Word document report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Optimization Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analysis of {project.name}&apos;s schedule and resource health.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-3.5 py-2 bg-blue-600 border border-blue-700 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-all flex items-center shadow-xs active:scale-95 disabled:opacity-50"
            title="Export Word Document (.docx)"
          >
            <span className="material-symbols-outlined mr-1.5 text-[18px]">
              {isExporting ? 'sync' : 'description'}
            </span>
            {isExporting ? 'Generating Word Doc...' : 'Export Word Report (.docx)'}
          </button>
        </div>
      </div>

      {/* Bento Grid: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors cursor-default shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">list_alt</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {project.totalTasks}
            </span>
            <div className="flex items-center mt-1">
              <span className="material-symbols-outlined text-blue-600 text-[16px] mr-1">
                arrow_downward
              </span>
              <span className="text-[11px] font-medium text-blue-600">
                {project.completedThisWeek} completed this week
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 border-l-[4px] border-l-rose-500 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Critical Path
            </span>
            <span className="material-symbols-outlined text-rose-500 text-[20px]">route</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {project.criticalPathDays}d
            </span>
            <div className="flex items-center mt-1">
              <span className="material-symbols-outlined text-rose-500 text-[16px] mr-1">
                warning
              </span>
              <span className="text-[11px] font-medium text-rose-600">+2d due to delays</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 border-l-[4px] border-l-amber-500 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Bottlenecks
            </span>
            <span className="material-symbols-outlined text-amber-500 text-[20px]">traffic</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {project.bottlenecksCount}
            </span>
            <div className="flex items-center mt-1">
              <span className="material-symbols-outlined text-slate-400 text-[16px] mr-1">
                horizontal_rule
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {project.bottlenecksCount === 1 ? 'Reduced by AI' : 'No change'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Resource Eff.
            </span>
            <span className="material-symbols-outlined text-blue-600 text-[20px]">group_work</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {project.resourceEffPercent}%
            </span>
            <div className="flex items-center mt-1">
              <span className="material-symbols-outlined text-blue-600 text-[16px] mr-1">
                arrow_upward
              </span>
              <span className="text-[11px] font-medium text-blue-600">+5% optimized</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 border-l-[4px] border-l-emerald-500 flex flex-col justify-between shadow-xs sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Budget Drawdown
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              account_balance_wallet
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              ${(project.currentCost / 1000).toFixed(0)}k
            </span>
            <div className="flex items-center mt-1">
              <span className="text-[11px] font-medium text-slate-500">
                of ${(project.projectedCost / 1000).toFixed(0)}k projected cost
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Preview Banner */}
      {showPreviewBanner && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center mb-1">
                <span className="material-symbols-outlined text-blue-600 mr-2 text-[20px] animate-pulse">
                  auto_awesome
                </span>
                Optimization Preview Available
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Optimizing this schedule will reduce resource costs by $15k and streamline critical dependencies. Would you like to proceed?
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6 items-center pt-1 border-t border-blue-100">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">
                    Current Cost
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    ${(project.currentCost / 1000).toFixed(0)}k
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_right_alt</span>
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-600">
                    Optimized Cost
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    ${(project.optimizedCost / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="pl-4 border-l border-blue-200">
                  <div className="text-[10px] uppercase font-semibold text-slate-500">
                    Total Budget
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    ${(project.projectedCost / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 shrink-0 self-end md:self-center">
              <button
                onClick={() => setShowPreviewBanner(false)}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApplyOptimization();
                  setShowPreviewBanner(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Apply Optimization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Radial Chart & AI Suggestions */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1">
          {/* Schedule Health Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
            <div className="absolute top-4 left-4">
              <h3 className="text-sm font-bold text-slate-900">Schedule Health</h3>
            </div>
            <div className="relative w-44 h-44 mt-6 flex items-center justify-center">
              {/* Radial Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * project.scheduleHealthPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">
                  {project.scheduleHealthPercent}%
                </span>
                <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider mt-0.5">
                  On Track
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 px-2 leading-relaxed">
              Project is mostly aligned with the baseline, but {project.bottlenecksCount} critical path tasks require attention.
            </p>
          </div>

          {/* Actionable AI Suggestions Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 flex-1 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-blue-600 mr-2 text-[18px]">
                tips_and_updates
              </span>
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    sug.applied
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50 border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      {sug.title}
                    </h4>
                    {sug.applied && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Applied
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {sug.description}
                  </p>
                  <div className="mt-2 text-right">
                    {!sug.applied ? (
                      <button
                        onClick={() => {
                          if (sug.type === 'reassign') {
                            onViewResourceAllocation();
                          } else {
                            onApplySuggestion(sug.id);
                          }
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider hover:underline"
                      >
                        {sug.actionText} →
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600">
                        Fix applied to schedule
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dependency Bottlenecks & Optimization History Chart */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-2">
          {/* Dependency Bottlenecks Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                Dependency Bottlenecks
              </h3>
              <button
                onClick={onViewGantt}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                View on Gantt →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-3 pl-5 font-semibold">Task Name</th>
                    <th className="p-3 font-semibold">Blocking</th>
                    <th className="p-3 font-semibold">Assignee</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 pr-5 font-semibold text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {bottlenecks.map((bot) => (
                    <tr
                      key={bot.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="p-3 pl-5 flex items-center">
                        <div
                          className={`w-1 h-8 rounded-full mr-3 shrink-0 ${
                            bot.barColor === 'error'
                              ? 'bg-rose-500'
                              : bot.barColor === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                        />
                        <span className="font-semibold text-slate-800">
                          {bot.taskName}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          <span className="material-symbols-outlined text-[13px] mr-1">
                            account_tree
                          </span>
                          {bot.blockingTasksCount} Tasks
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          {bot.assigneeAvatar ? (
                            <img
                              src={bot.assigneeAvatar}
                              alt={bot.assigneeName}
                              className="w-6 h-6 rounded-full mr-2 object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold mr-2">
                              {bot.assigneeInitials || 'U'}
                            </div>
                          )}
                          <span className="text-slate-700 font-medium">{bot.assigneeName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            bot.status === 'IN PROGRESS'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : bot.status === 'DELAYED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {bot.status}
                        </span>
                      </td>
                      <td
                        className={`p-3 pr-5 text-right font-mono font-semibold ${
                          bot.impact === 'HIGH'
                            ? 'text-rose-600'
                            : bot.impact === 'MEDIUM'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {bot.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimization History Chart Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex-1 min-h-[250px] flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Optimization History
              </h3>
              <select
                value={optimizationHistoryRange}
                onChange={(e) => setOptimizationHistoryRange(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Quarter">This Quarter</option>
              </select>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="flex-1 w-full relative mt-2 border-l border-b border-slate-200 pt-2 pr-2 pb-6 min-h-[170px] select-none">
              {(() => {
                const chartWidth = 1000;
                const chartHeight = 200;
                const paddingX = 40;
                const paddingY = 24;

                const points = activeHistory.map((item, idx) => {
                  const step = (chartWidth - 2 * paddingX) / (activeHistory.length - 1);
                  const cx = paddingX + idx * step;
                  const cy = (chartHeight - paddingY) - (item.value / 100) * (chartHeight - 2 * paddingY);
                  return { cx, cy, label: item.label, displayVal: item.displayVal };
                });

                const pathD = points.reduce(
                  (acc, p, idx) => (idx === 0 ? `M ${p.cx},${p.cy}` : `${acc} L ${p.cx},${p.cy}`),
                  ''
                );

                const fillD = `${pathD} L ${points[points.length - 1].cx},${chartHeight - paddingY} L ${points[0].cx},${chartHeight - paddingY} Z`;

                return (
                  <>
                    {/* Horizontal Grid lines */}
                    <div className="absolute w-full h-[1px] bg-slate-100 top-[12%] left-0 pointer-events-none" />
                    <div className="absolute w-full h-[1px] bg-slate-100 top-[31%] left-0 pointer-events-none" />
                    <div className="absolute w-full h-[1px] bg-slate-100 top-[50%] left-0 pointer-events-none" />
                    <div className="absolute w-full h-[1px] bg-slate-100 top-[69%] left-0 pointer-events-none" />
                    <div className="absolute w-full h-[1px] bg-slate-100 top-[88%] left-0 pointer-events-none" />

                    {/* Y Axis Labels */}
                    <div className="absolute -left-8 top-[12%] -translate-y-1/2 text-[10px] text-slate-400 font-medium">100%</div>
                    <div className="absolute -left-7 top-[31%] -translate-y-1/2 text-[10px] text-slate-400 font-medium">75%</div>
                    <div className="absolute -left-7 top-[50%] -translate-y-1/2 text-[10px] text-slate-400 font-medium">50%</div>
                    <div className="absolute -left-7 top-[69%] -translate-y-1/2 text-[10px] text-slate-400 font-medium">25%</div>
                    <div className="absolute -left-6 top-[88%] -translate-y-1/2 text-[10px] text-slate-400 font-medium">0%</div>

                    {/* Chart SVG Area */}
                    <svg
                      className="w-full h-full overflow-visible block"
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gradient Fill under line */}
                      <path d={fillD} fill="url(#optGrad)" />

                      {/* Connecting Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Node Circles - Rendered inside SVG so cx/cy sit directly on the line path */}
                      {points.map((p) => (
                        <g key={p.label} className="cursor-pointer">
                          {/* Outer invisible hover area */}
                          <circle
                            cx={p.cx}
                            cy={p.cy}
                            r="16"
                            fill="transparent"
                            onMouseEnter={() => setHoveredPoint({ x: p.label, value: p.displayVal })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          {/* Inner white circle sitting directly centered on path vertex */}
                          <circle
                            cx={p.cx}
                            cy={p.cy}
                            r="6"
                            fill="#FFFFFF"
                            stroke="#2563EB"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                            className="transition-transform duration-150 hover:scale-125"
                            onMouseEnter={() => setHoveredPoint({ x: p.label, value: p.displayVal })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Hover Tooltip */}
                    {hoveredPoint && (
                      <div className="absolute top-1 right-2 bg-slate-900 text-white px-2.5 py-1 rounded text-[11px] font-semibold shadow-md z-20 animate-in fade-in duration-100">
                        {hoveredPoint.x}: <span className="text-blue-300 font-bold">{hoveredPoint.value}</span> Efficiency
                      </div>
                    )}

                    {/* X Axis Labels */}
                    <div className="w-full absolute -bottom-6 left-0 text-[10px] text-slate-500 font-medium">
                      {points.map((p) => (
                        <span
                          key={p.label}
                          className="absolute -translate-x-1/2 text-center"
                          style={{ left: `${(p.cx / chartWidth) * 100}%` }}
                        >
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
