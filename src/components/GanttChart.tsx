import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { parseTaskDate, formatDateISO, formatDateShort, recalculateProjectMetrics } from '../utils/projectMetrics';

interface GanttChartProps {
  tasks: Task[];
  onUpdateTask?: (task: Task) => void;
  onUpdateTaskDates?: (taskId: string, start: string, end: string) => void;
  criticalTaskCodes?: Set<string>;
}

interface DragState {
  taskId: string;
  mode: 'move' | 'resize-start' | 'resize-end';
  startX: number;
  initialStart: Date;
  initialEnd: Date;
  currentDeltaDays: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  onUpdateTask,
  onUpdateTaskDates,
  criticalTaskCodes: providedCriticalCodes,
}) => {
  const [highlightCriticalPath, setHighlightCriticalPath] = useState(true);
  const [timeZoom, setTimeZoom] = useState<'Days' | 'Weeks'>('Weeks');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Active drag state for moving or resizing task bars
  const [dragState, setDragState] = useState<DragState | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Derive critical path codes if not explicitly passed
  const derivedCriticalCodes = React.useMemo(() => {
    if (providedCriticalCodes) return providedCriticalCodes;
    const dummyProj = {
      id: 'proj',
      name: 'Project',
      sprintName: 'Sprint',
      priority: 'High',
      totalTasks: tasks.length,
      completedThisWeek: 0,
      criticalPathDays: 30,
      bottlenecksCount: 0,
      resourceEffPercent: 80,
      currentCost: 100000,
      projectedCost: 150000,
      optimizedCost: 100000,
      scheduleHealthPercent: 80,
    };
    return recalculateProjectMetrics(dummyProj, tasks, []).criticalTaskCodes;
  }, [tasks, providedCriticalCodes]);

  // Determine chart timeline bounds (Oct 1 to Oct 28 2026 default)
  const chartStart = new Date(2026, 9, 1); // Oct 1, 2026
  const chartEnd = new Date(2026, 9, 28); // Oct 28, 2026
  const totalChartMs = chartEnd.getTime() - chartStart.getTime();

  const octDays = Array.from({ length: 28 }, (_, i) => i + 1);

  const handleDateChange = (task: Task, field: 'startDate' | 'endDate', newDateVal: string) => {
    let newStart = task.startDate || '2026-10-01';
    let newEnd = task.endDate || '2026-10-12';

    if (field === 'startDate') newStart = newDateVal;
    if (field === 'endDate') newEnd = newDateVal;

    const parsedEnd = parseTaskDate(newEnd);
    const updatedDueDate = formatDateShort(parsedEnd);

    const updatedTask: Task = {
      ...task,
      startDate: newStart,
      endDate: newEnd,
      dueDate: updatedDueDate,
    };

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    } else if (onUpdateTaskDates) {
      onUpdateTaskDates(task.id, newStart, newEnd);
    }
  };

  const handleShiftTaskDays = (task: Task, daysShift: number) => {
    const currStart = parseTaskDate(task.startDate || task.dueDate);
    const currEnd = parseTaskDate(task.endDate || task.dueDate);

    currStart.setDate(currStart.getDate() + daysShift);
    currEnd.setDate(currEnd.getDate() + daysShift);

    const newStartISO = formatDateISO(currStart);
    const newEndISO = formatDateISO(currEnd);

    handleDateChange(task, 'startDate', newStartISO);
    handleDateChange(task, 'endDate', newEndISO);
  };

  // Drag handlers
  const handleBarMouseDown = (
    e: React.MouseEvent,
    task: Task,
    mode: 'move' | 'resize-start' | 'resize-end'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const currStart = parseTaskDate(task.startDate || task.dueDate);
    const currEnd = parseTaskDate(task.endDate || task.dueDate);

    setDragState({
      taskId: task.id,
      mode,
      startX: e.clientX,
      initialStart: currStart,
      initialEnd: currEnd,
      currentDeltaDays: 0,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const pxPerDay = (rect.width || 600) / 27; // 27 days span Oct 1 - Oct 28
      const deltaX = e.clientX - dragState.startX;
      const deltaDays = Math.round(deltaX / pxPerDay);

      setDragState((prev) => (prev ? { ...prev, currentDeltaDays: deltaDays } : null));
    };

    const handleMouseUp = () => {
      if (dragState && dragState.currentDeltaDays !== 0) {
        const taskObj = tasks.find((t) => t.id === dragState.taskId);
        if (taskObj) {
          const newStart = new Date(dragState.initialStart);
          const newEnd = new Date(dragState.initialEnd);

          if (dragState.mode === 'move') {
            newStart.setDate(newStart.getDate() + dragState.currentDeltaDays);
            newEnd.setDate(newEnd.getDate() + dragState.currentDeltaDays);
          } else if (dragState.mode === 'resize-start') {
            newStart.setDate(newStart.getDate() + dragState.currentDeltaDays);
            if (newStart.getTime() >= newEnd.getTime()) {
              newStart.setTime(newEnd.getTime() - 86400000);
            }
          } else if (dragState.mode === 'resize-end') {
            newEnd.setDate(newEnd.getDate() + dragState.currentDeltaDays);
            if (newEnd.getTime() <= newStart.getTime()) {
              newEnd.setTime(newStart.getTime() + 86400000);
            }
          }

          const newStartISO = formatDateISO(newStart);
          const newEndISO = formatDateISO(newEnd);
          const newDueDate = formatDateShort(newEnd);

          const updatedTask: Task = {
            ...taskObj,
            startDate: newStartISO,
            endDate: newEndISO,
            dueDate: newDueDate,
          };

          if (onUpdateTask) {
            onUpdateTask(updatedTask);
          } else if (onUpdateTaskDates) {
            onUpdateTaskDates(taskObj.id, newStartISO, newEndISO);
          }
        }
      }
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, tasks, onUpdateTask, onUpdateTaskDates]);

  return (
    <div className="space-y-6">
      {/* Gantt Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Gantt Timeline Chart</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Drag-to-Move Interactive
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click and drag task bars horizontally to move schedule dates, or drag handles to resize task duration. Updates reflect automatically across the app.
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

      {/* Active Drag Helper Banner */}
      {dragState && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
            <span>
              Moving Task Date Schedule:{' '}
              <strong className="underline">
                {dragState.currentDeltaDays >= 0 ? `+${dragState.currentDeltaDays}` : dragState.currentDeltaDays} days
              </strong>
            </span>
          </div>
          <span className="text-[11px] opacity-90">Release mouse to commit changes</span>
        </div>
      )}

      {/* Gantt Chart Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
        {/* Scrollable Container */}
        <div className="overflow-x-auto">
          <div className="flex min-w-[1000px]">
            {/* Left Task Metadata Column */}
            <div className="w-96 shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0 shadow-xs">
              <div className="h-10 border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                <span>Task & Schedule Dates</span>
                <span>Actions</span>
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.map((t) => {
                  const isCritical = highlightCriticalPath && derivedCriticalCodes.has(t.code);
                  const isEditing = editingTaskId === t.id;
                  const startISO = t.startDate || '2026-10-01';
                  const endISO = t.endDate || '2026-10-12';

                  return (
                    <div
                      key={t.id}
                      className="h-14 px-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            isCritical ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.code}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-800 truncate block">
                            {t.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {startISO} → {endISO}
                          </span>
                        </div>
                      </div>

                      {/* Date Adjust Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-300">
                            <input
                              type="date"
                              value={startISO}
                              onChange={(e) => handleDateChange(t, 'startDate', e.target.value)}
                              className="text-[10px] font-mono bg-white px-1 py-0.5 border rounded"
                            />
                            <span className="text-[10px] text-slate-400">-</span>
                            <input
                              type="date"
                              value={endISO}
                              onChange={(e) => handleDateChange(t, 'endDate', e.target.value)}
                              className="text-[10px] font-mono bg-white px-1 py-0.5 border rounded"
                            />
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold ml-1"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleShiftTaskDays(t, -2)}
                              className="p-1 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold border border-slate-200"
                              title="Shift back 2 days"
                            >
                              -2d
                            </button>
                            <button
                              onClick={() => handleShiftTaskDays(t, 2)}
                              className="p-1 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold border border-slate-200"
                              title="Delay forward 2 days"
                            >
                              +2d
                            </button>
                            <button
                              onClick={() => setEditingTaskId(t.id)}
                              className="p-1 hover:bg-blue-50 text-blue-600 rounded border border-blue-200 text-[11px]"
                              title="Edit Exact Dates"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Bars Area */}
            <div ref={timelineRef} className="flex-1 min-w-[600px] flex flex-col relative select-none">
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
                {tasks.map((t) => {
                  const isCritical = highlightCriticalPath && derivedCriticalCodes.has(t.code);

                  const isDraggingThis = dragState?.taskId === t.id;
                  let startDate = parseTaskDate(t.startDate || t.dueDate);
                  let endDate = parseTaskDate(t.endDate || t.dueDate);

                  if (isDraggingThis && dragState) {
                    if (dragState.mode === 'move') {
                      startDate = new Date(dragState.initialStart);
                      startDate.setDate(startDate.getDate() + dragState.currentDeltaDays);
                      endDate = new Date(dragState.initialEnd);
                      endDate.setDate(endDate.getDate() + dragState.currentDeltaDays);
                    } else if (dragState.mode === 'resize-start') {
                      startDate = new Date(dragState.initialStart);
                      startDate.setDate(startDate.getDate() + dragState.currentDeltaDays);
                    } else if (dragState.mode === 'resize-end') {
                      endDate = new Date(dragState.initialEnd);
                      endDate.setDate(endDate.getDate() + dragState.currentDeltaDays);
                    }
                  }

                  const startOffset = Math.max(
                    0,
                    Math.min(92, ((startDate.getTime() - chartStart.getTime()) / totalChartMs) * 100)
                  );

                  const rawWidth = Math.max(
                    6,
                    ((endDate.getTime() - startDate.getTime()) / totalChartMs) * 100
                  );
                  const barWidth = Math.min(100 - startOffset, rawWidth);

                  return (
                    <div key={t.id} className="h-14 relative flex items-center px-2 group">
                      {/* Gridline columns */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1 border-r border-slate-100/80"></div>
                        <div className="flex-1"></div>
                      </div>

                      {/* Interactive Draggable Task Bar */}
                      <div
                        style={{ left: `${startOffset}%`, width: `${barWidth}%` }}
                        onMouseDown={(e) => handleBarMouseDown(e, t, 'move')}
                        className={`absolute h-8 rounded-md shadow-sm flex items-center px-2 text-white text-[11px] font-semibold transition-all cursor-grab active:cursor-grabbing overflow-hidden ${
                          isDraggingThis ? 'ring-2 ring-blue-400 scale-[1.02] z-30 opacity-90' : 'hover:scale-[1.01]'
                        } ${
                          isCritical
                            ? 'bg-rose-600 border-2 border-rose-800'
                            : t.status === 'done'
                            ? 'bg-emerald-600 border border-emerald-700'
                            : 'bg-blue-600 border border-blue-700'
                        }`}
                        title={`Drag left/right to shift dates\n${t.code}: ${t.title}\nDates: ${formatDateISO(startDate)} to ${formatDateISO(endDate)}`}
                      >
                        {/* Left Resize Handle */}
                        <div
                          onMouseDown={(e) => handleBarMouseDown(e, t, 'resize-start')}
                          className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/20 hover:bg-black/40 cursor-ew-resize z-20 flex items-center justify-center"
                          title="Drag to resize start date"
                        >
                          <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                        </div>

                        {/* Progress fill */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-white/20 pointer-events-none"
                          style={{ width: `${t.progress || (t.status === 'done' ? 100 : 50)}%` }}
                        />

                        {/* Task Title Content */}
                        <div className="relative z-10 truncate flex items-center justify-between w-full px-1 pointer-events-none">
                          <span className="truncate">{t.title}</span>
                          {isCritical && (
                            <span className="ml-1 text-[9px] bg-white text-rose-700 px-1 py-0.2 rounded font-mono shrink-0">
                              CRITICAL
                            </span>
                          )}
                        </div>

                        {/* Right Resize Handle */}
                        <div
                          onMouseDown={(e) => handleBarMouseDown(e, t, 'resize-end')}
                          className="absolute right-0 top-0 bottom-0 w-2.5 bg-black/20 hover:bg-black/40 cursor-ew-resize z-20 flex items-center justify-center"
                          title="Drag to resize end date"
                        >
                          <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                        </div>
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
