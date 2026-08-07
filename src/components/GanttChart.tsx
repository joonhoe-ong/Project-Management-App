import React, { useState } from 'react';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
  onUpdateTaskDates?: (taskId: string, start: string, end: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const [highlightCriticalPath, setHighlightCriticalPath] = useState(true);
  const [timeZoom, setTimeZoom] = useState<'Days' | 'Weeks'>('Weeks');

  // Generate sample timeline columns for October 2026
  const octDays = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Gantt Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Gantt Timeline Chart
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual dependency mapping & critical path schedule for Sprint 42.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Critical Path Toggle */}
          <button
            onClick={() => setHighlightCriticalPath(!highlightCriticalPath)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              highlightCriticalPath
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">route</span>
            {highlightCriticalPath ? 'Critical Path Highlighted' : 'Show Critical Path'}
          </button>

          {/* Time Zoom */}
          <div className="bg-slate-100 p-1 rounded-md border border-slate-200 flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setTimeZoom('Days')}
              className={`px-3 py-1 rounded-sm ${
                timeZoom === 'Days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Days
            </button>
            <button
              onClick={() => setTimeZoom('Weeks')}
              className={`px-3 py-1 rounded-sm ${
                timeZoom === 'Weeks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Weeks
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Chart Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
        {/* Scrollable Container */}
        <div className="overflow-x-auto">
          <div className="flex min-w-[900px]">
            {/* Left Task Metadata Column */}
            <div className="w-80 shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0 shadow-xs">
              <div className="h-10 border-b border-slate-200 bg-slate-50 px-4 flex items-center font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                Task Name & Code
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.map((t) => {
                  const isCritical = highlightCriticalPath && (t.code === 'OPT-104' || t.code === 'OPT-102');
                  return (
                    <div
                      key={t.id}
                      className="h-12 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCritical ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium ml-2 shrink-0">
                        {t.dueDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Bars Area */}
            <div className="flex-1 min-w-[600px] flex flex-col">
              {/* Header Days/Weeks */}
              <div className="h-10 border-b border-slate-200 bg-slate-50 flex">
                {timeZoom === 'Weeks' ? (
                  ['Week 1 (Oct 1-7)', 'Week 2 (Oct 8-14)', 'Week 3 (Oct 15-21)', 'Week 4 (Oct 22-28)'].map(
                    (w) => (
                      <div
                        key={w}
                        className="flex-1 border-r border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-500 uppercase tracking-wider"
                      >
                        {w}
                      </div>
                    )
                  )
                ) : (
                  octDays.slice(0, 14).map((d) => (
                    <div
                      key={d}
                      className="flex-1 border-r border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500"
                    >
                      Oct {d}
                    </div>
                  ))
                )}
              </div>

              {/* Rows with Bars */}
              <div className="divide-y divide-slate-100 relative">
                {tasks.map((t, idx) => {
                  const isCritical = highlightCriticalPath && (t.code === 'OPT-104' || t.code === 'OPT-102');
                  // Calculate positioning for demo
                  const startOffset = ((idx * 12 + 5) % 60);
                  const barWidth = 25 + (idx % 3) * 15;

                  return (
                    <div key={t.id} className="h-12 relative flex items-center px-2">
                      {/* Gridline columns */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1"></div>
                      </div>

                      {/* Interactive Task Bar */}
                      <div
                        style={{ left: `${startOffset}%`, width: `${barWidth}%` }}
                        className={`absolute h-7 rounded-md shadow-xs flex items-center px-2.5 text-white text-[11px] font-semibold transition-all hover:brightness-110 cursor-pointer overflow-hidden ${
                          isCritical
                            ? 'bg-rose-600 border border-rose-700'
                            : t.status === 'done'
                            ? 'bg-emerald-600'
                            : 'bg-blue-600'
                        }`}
                        title={`${t.code}: ${t.title} (${t.progress || 50}% completed)`}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-white/20"
                          style={{ width: `${t.progress || 50}%` }}
                        />
                        <span className="relative z-10 truncate">{t.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
