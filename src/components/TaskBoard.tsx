import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { DisqusWidget } from './DisqusWidget';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateTask?: (task: Task) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  disqusShortname?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onUpdateTaskStatus,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  disqusShortname = 'optiplan-pro',
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'comments'>('details');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'dependency' | 'order'>('all');

  // New task form state
  const [newCode, setNewCode] = useState('OPT-115');
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');
  const [newAssigneeName, setNewAssigneeName] = useState('Jane Doe');
  const [newDueDate, setNewDueDate] = useState('Oct 22');

  const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: 'todo', label: 'To Do', dotColor: 'bg-blue-600' },
    { id: 'in_progress', label: 'In Progress', dotColor: 'bg-blue-600' },
    { id: 'review', label: 'Review', dotColor: 'bg-blue-600' },
    { id: 'done', label: 'Done', dotColor: 'bg-emerald-600' },
  ];

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      code: newCode,
      title: newTitle,
      status: newStatus,
      statusLabel: newStatus === 'todo' ? 'Ready' : newStatus === 'in_progress' ? 'In Execution' : 'In Review',
      assignee: {
        name: newAssigneeName,
        initials: newAssigneeName.split(' ').map((n) => n[0]).join('')
      },
      dueDate: newDueDate,
      subtaskRatio: '0/3',
      department: 'Engineering'
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (viewMode === 'dependency') return t.dependsOn && t.dependsOn.length > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Sprint 42 Board</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {tasks.length} Total Tasks
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track sprint items, dependency blockers, and operational order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Filters */}
          <div className="bg-slate-100 p-1 rounded-md border border-slate-200 flex gap-1">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setViewMode('order')}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all flex items-center gap-1 ${
                viewMode === 'order'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
              Order of Operations
            </button>
            <button
              onClick={() => setViewMode('dependency')}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all flex items-center gap-1 ${
                viewMode === 'dependency'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">account_tree</span>
              Dependency Path
            </button>
          </div>

          <button
            onClick={() => alert('All task timelines aligned to critical path.')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Reschedule All
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start min-h-[500px]">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[480px] shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => {
                  const isBlocked = task.dependsOn && task.dependsOn.length > 0;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setEditingTask({ ...task })}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group relative"
                    >
                      {/* Left accent border */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                          isBlocked
                            ? 'bg-amber-500'
                            : task.status === 'done'
                            ? 'bg-emerald-500'
                            : 'bg-blue-600'
                        }`}
                      />

                      {/* Code & Badge row */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          {task.code}
                        </span>

                        {task.statusLabel && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              task.statusLabel.startsWith('Waiting')
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : task.statusLabel === 'Ready'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : task.statusLabel === 'In Execution'
                                ? 'bg-blue-100 text-blue-800 font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.statusLabel}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                        {task.title}
                      </h4>

                      {/* Card Footer */}
                      <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 mt-2">
                        <div className="flex items-center gap-1.5">
                          {task.assignee?.avatar ? (
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-5 h-5 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                              {task.assignee?.initials || '?'}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center">
                            <span className="material-symbols-outlined text-[13px] mr-1 text-slate-400">
                              calendar_today
                            </span>
                            {task.dueDate}
                          </span>

                          {task.subtaskRatio && (
                            <span className="flex items-center font-mono text-[10px] text-slate-500">
                              <span className="material-symbols-outlined text-[13px] mr-1 text-slate-400">
                                checklist
                              </span>
                              {task.subtaskRatio}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                    No items in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded">
                  {editingTask.code}
                </span>
                {/* Modal Subtabs */}
                <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setModalTab('details')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      modalTab === 'details'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Task Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('comments')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      modalTab === 'comments'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] text-blue-600">forum</span>
                    Disqus Thread
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
                title="Discard changes"
              >
                ✕
              </button>
            </div>

            {modalTab === 'details' ? (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Title
                  </label>
                  <input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      Status Column
                    </label>
                    <select
                      value={editingTask.status}
                      onChange={(e) => {
                        const st = e.target.value as TaskStatus;
                        setEditingTask({ ...editingTask, status: st });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      Due Date
                    </label>
                    <input
                      value={editingTask.dueDate}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, dueDate: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editingTask.startDate || '2026-10-01'}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, startDate: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editingTask.endDate || '2026-10-12'}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, endDate: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Assignee Name
                  </label>
                  <input
                    value={editingTask.assignee?.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const initials =
                        name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'JD';
                      setEditingTask({
                        ...editingTask,
                        assignee: {
                          ...(editingTask.assignee || { initials: 'JD' }),
                          name,
                          initials,
                        },
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                    placeholder="Assignee Name"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50/50 max-h-[500px] overflow-y-auto">
                <DisqusWidget
                  shortname={disqusShortname}
                  identifier={`task-${editingTask.id}`}
                  title={`${editingTask.code}: ${editingTask.title}`}
                />
              </div>
            )}

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  if (editingTask) {
                    onDeleteTask(editingTask.id);
                    setEditingTask(null);
                  }
                }}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-1"
              >
                Delete Task
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingTask) {
                      if (onUpdateTask) {
                        onUpdateTask(editingTask);
                      } else {
                        onUpdateTaskStatus(editingTask.id, editingTask.status);
                      }
                      setEditingTask(null);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateTaskSubmit}
            className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Add New Sprint Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Task Code
                  </label>
                  <input
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Due Date
                  </label>
                  <input
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                  Task Title
                </label>
                <input
                  required
                  placeholder="e.g., Optimize Database Query Indexes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 text-xs"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase text-[10px] mb-1">
                    Assignee
                  </label>
                  <input
                    value={newAssigneeName}
                    onChange={(e) => setNewAssigneeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
