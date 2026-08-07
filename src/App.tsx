import React, { useState } from 'react';
import {
  NavScreen,
  ProjectInfo,
  Resource,
  Task,
  TaskStatus,
  AISuggestion,
  BottleneckItem,
} from './types';
import {
  INITIAL_PROJECT,
  SECOND_PROJECT,
  INITIAL_RESOURCES,
  INITIAL_TASKS,
  INITIAL_SUGGESTIONS,
  INITIAL_BOTTLENECKS,
} from './data/initialData';

import { SideNavBar } from './components/SideNavBar';
import { TopNavBar } from './components/TopNavBar';
import { OptimizationDashboard } from './components/OptimizationDashboard';
import { ResourceAllocation } from './components/ResourceAllocation';
import { TaskBoard } from './components/TaskBoard';
import { ResourceManagement } from './components/ResourceManagement';
import { GanttChart } from './components/GanttChart';
import { ProjectSettings } from './components/ProjectSettings';
import { CreateProjectModal } from './components/CreateProjectModal';
import { AutoOptimizeModal } from './components/AutoOptimizeModal';
import { DisqusWidget } from './components/DisqusWidget';
import { DisqusFloatingBubble } from './components/DisqusFloatingBubble';
import { SubscriptionPricing } from './components/SubscriptionPricing';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('optimization');
  const [projects, setProjects] = useState<ProjectInfo[]>([INITIAL_PROJECT, SECOND_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECT.id);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECT;

  const setProject = (updater: React.SetStateAction<ProjectInfo>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          return typeof updater === 'function' ? updater(p) : updater;
        }
        return p;
      })
    );
  };

  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(INITIAL_SUGGESTIONS);
  const [bottlenecks, setBottlenecks] = useState<BottleneckItem[]>(INITIAL_BOTTLENECKS);

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showAutoOptimizeModal, setShowAutoOptimizeModal] = useState(false);

  // Apply Global AI Optimization
  const handleApplyOptimization = () => {
    setProject((prev) => ({
      ...prev,
      currentCost: 105000,
      criticalPathDays: 43,
      bottlenecksCount: 1,
      resourceEffPercent: 92,
      scheduleHealthPercent: 92,
    }));

    setSuggestions((prev) =>
      prev.map((s) => ({ ...s, applied: true }))
    );

    // Level Alex D. and Elena R.'s capacities
    setResources((prev) =>
      prev.map((r) => {
        if (r.name.includes('Alex') || r.name.includes('Elena')) {
          const newDaily: Record<number, number> = {};
          if (r.dailyCapacity) {
            Object.keys(r.dailyCapacity).forEach((d) => {
              const dayNum = parseInt(d, 10);
              newDaily[dayNum] = Math.min(r.dailyCapacity![dayNum], 90);
            });
          }
          return {
            ...r,
            capacityAvg: 88,
            isOverallocated: false,
            dailyCapacity: newDaily,
          };
        }
        return r;
      })
    );

    // Update bottlenecks list
    setBottlenecks((prev) =>
      prev.filter((b) => b.impact !== 'HIGH')
    );
  };

  const handleApplySuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: true } : s))
    );
    setProject((prev) => ({
      ...prev,
      bottlenecksCount: Math.max(1, prev.bottlenecksCount - 1),
      resourceEffPercent: Math.min(98, prev.resourceEffPercent + 2),
    }));
  };

  const handleUpdateResourceCost = (resourceId: string, newCost: number) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, monthlyCost: newCost } : r))
    );
  };

  const handleUpdateResourceCapacity = (
    resourceId: string,
    day: number,
    newCapacity: number
  ) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const updatedDaily: Record<number, number> = { ...(r.dailyCapacity || {}), [day]: newCapacity };
          const vals: number[] = Object.values(updatedDaily);
          const avg = Math.round(vals.reduce((a: number, b: number) => a + b, 0) / (vals.length || 1));
          return {
            ...r,
            dailyCapacity: updatedDaily,
            capacityAvg: avg,
            isOverallocated: avg > 100,
          };
        }
        return r;
      })
    );
  };

  const handleBalanceWorkload = () => {
    setResources((prev) =>
      prev.map((r) => {
        const balancedDaily: Record<number, number> = {};
        if (r.dailyCapacity) {
          Object.keys(r.dailyCapacity).forEach((d) => {
            const dayNum = parseInt(d, 10);
            const val = r.dailyCapacity![dayNum];
            balancedDaily[dayNum] = val > 100 ? 85 : val;
          });
        }
        return {
          ...r,
          dailyCapacity: balancedDaily,
          capacityAvg: Math.min(r.capacityAvg, 88),
          isOverallocated: false,
        };
      })
    );

    setProject((prev) => ({
      ...prev,
      resourceEffPercent: 94,
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskObj: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [taskObj, ...prev]);
    setProject((prev) => ({ ...prev, totalTasks: prev.totalTasks + 1 }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setProject((prev) => ({ ...prev, totalTasks: Math.max(0, prev.totalTasks - 1) }));
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              statusLabel:
                newStatus === 'done'
                  ? 'Completed'
                  : newStatus === 'in_progress'
                  ? 'In Execution'
                  : newStatus === 'review'
                  ? 'QA Pending'
                  : 'Ready',
            }
          : t
      )
    );
  };

  const handleAddResource = (
    newRes: Omit<Resource, 'id' | 'capacityAvg'>
  ) => {
    const resObj: Resource = {
      ...newRes,
      id: `res-${Date.now()}`,
      capacityAvg: 80,
      dailyCapacity: {
        1: 80, 2: 80, 3: 80, 4: 0, 5: 0, 6: 80, 7: 80, 8: 80, 9: 80, 10: 80, 11: 80, 12: 80, 13: 80, 14: 80
      },
    };
    setResources((prev) => [...prev, resObj]);
  };

  const handleDeleteResource = (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updatedTask.id
          ? {
              ...updatedTask,
              statusLabel:
                updatedTask.status === 'done'
                  ? 'Completed'
                  : updatedTask.status === 'in_progress'
                  ? 'In Execution'
                  : updatedTask.status === 'review'
                  ? 'QA Pending'
                  : 'Ready',
            }
          : t
      )
    );
  };

  const handleCreateProject = (
    newProjData: Partial<ProjectInfo>,
    importedTasks?: Task[]
  ) => {
    const newId = `proj-${Date.now()}`;
    const newProj: ProjectInfo = {
      id: newId,
      name: newProjData.name || 'New Project',
      sprintName: newProjData.sprintName || 'Sprint 1',
      priority: newProjData.priority || 'Medium Priority',
      totalTasks: importedTasks?.length || 0,
      completedThisWeek: 0,
      criticalPathDays: 30,
      bottlenecksCount: 0,
      resourceEffPercent: 88,
      currentCost: newProjData.projectedCost ? Math.round(newProjData.projectedCost * 0.7) : 90000,
      projectedCost: newProjData.projectedCost || 130000,
      optimizedCost: newProjData.projectedCost ? Math.round(newProjData.projectedCost * 0.8) : 100000,
      scheduleHealthPercent: 90,
      clientSponsor: newProjData.clientSponsor || 'Internal Workspace',
      startDate: newProjData.startDate || '2026-10-01',
      endDate: newProjData.endDate || '2026-12-31',
    };

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newId);

    if (importedTasks && importedTasks.length > 0) {
      setTasks(importedTasks);
    }
  };

  // Global search filtering across tasks & resources if search query exists
  const filteredTasksForSearch = searchQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const filteredResourcesForSearch = searchQuery
    ? resources.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resources;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1C30] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Side Navigation Bar */}
      <SideNavBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenAutoOptimize={() => setShowAutoOptimizeModal(true)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onOpenCreateProject={() => setShowCreateProjectModal(true)}
      />

      {/* Main Content View Container */}
      <div className="flex-1 flex flex-col md:ml-[240px] h-screen overflow-hidden">
        {/* Top Header Navigation */}
        <TopNavBar
          onToggleMobile={() => setMobileNavOpen(!mobileNavOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Canvas View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {currentScreen === 'optimization' && (
              <OptimizationDashboard
                project={activeProject}
                tasks={tasks}
                resources={resources}
                suggestions={suggestions}
                bottlenecks={bottlenecks}
                onApplyOptimization={handleApplyOptimization}
                onApplySuggestion={handleApplySuggestion}
                onViewGantt={() => setCurrentScreen('gantt')}
                onViewResourceAllocation={() => setCurrentScreen('resource-allocation')}
              />
            )}

            {currentScreen === 'resource-allocation' && (
              <ResourceAllocation
                resources={filteredResourcesForSearch}
                onUpdateResourceCapacity={handleUpdateResourceCapacity}
                onBalanceWorkload={handleBalanceWorkload}
              />
            )}

            {currentScreen === 'task-board' && (
              <TaskBoard
                tasks={filteredTasksForSearch}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                disqusShortname={activeProject.disqusShortname}
              />
            )}

            {currentScreen === 'discussions' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Project Discussions & Community Hub</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Disqus Powered
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Centralized platform feedback, team Q&A, and project announcements for <strong className="text-slate-800">{activeProject.name}</strong>.
                  </p>
                </div>

                <DisqusWidget
                  shortname={activeProject.disqusShortname || 'optiplan-pro'}
                  identifier={`project-${activeProject.id}`}
                  title={`${activeProject.name} - Project Discussion`}
                  onShortnameChange={(newShortname) => {
                    setProject((prev) => ({ ...prev, disqusShortname: newShortname }));
                  }}
                />
              </div>
            )}

            {currentScreen === 'resource-management' && (
              <ResourceManagement
                resources={filteredResourcesForSearch}
                onUpdateMonthlyCost={handleUpdateResourceCost}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
              />
            )}

            {currentScreen === 'gantt' && <GanttChart tasks={filteredTasksForSearch} />}

            {(currentScreen === 'settings' || currentScreen === 'discussions') && (
              <ProjectSettings
                project={activeProject}
                onUpdateProject={(data) => setProject((prev) => ({ ...prev, ...data }))}
                initialTab="general"
                onSelectScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'pricing' && (
              <ProjectSettings
                project={activeProject}
                onUpdateProject={(data) => setProject((prev) => ({ ...prev, ...data }))}
                initialTab="subscription"
                onSelectScreen={setCurrentScreen}
              />
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <CreateProjectModal
          onClose={() => setShowCreateProjectModal(false)}
          onCreateProject={handleCreateProject}
        />
      )}

      {/* Auto-Optimize AI Modal */}
      {showAutoOptimizeModal && (
        <AutoOptimizeModal
          onClose={() => setShowAutoOptimizeModal(false)}
          onConfirmOptimization={handleApplyOptimization}
        />
      )}

      {/* Floating Disqus Discussion Bubble (Bottom Left) */}
      <DisqusFloatingBubble project={activeProject} />
    </div>
  );
}
