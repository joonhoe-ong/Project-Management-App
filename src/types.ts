export type NavScreen = 
  | 'optimization'
  | 'resource-allocation'
  | 'task-board'
  | 'resource-management'
  | 'gantt'
  | 'discussions'
  | 'pricing'
  | 'settings';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  code: string;
  title: string;
  status: TaskStatus;
  statusLabel?: string; // e.g. "Ready", "In Execution", "QA Pending", "Waiting on OPT-104"
  assignee?: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  dueDate: string;
  blockingCount?: number;
  impact?: TaskImpact;
  subtaskRatio?: string; // e.g. "0/4", "3/5"
  dependsOn?: string[];
  department?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Management' | 'Marketing' | 'QA';
  monthlyCost: number;
  initials: string;
  avatar?: string;
  capacityAvg: number; // e.g. 115
  isOverallocated?: boolean;
  dailyCapacity?: Record<number, number>; // day number -> capacity percentage
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  actionText: string;
  applied?: boolean;
  type: 'reschedule' | 'reassign' | 'budget';
}

export interface BottleneckItem {
  id: string;
  taskName: string;
  blockingTasksCount: number;
  assigneeName: string;
  assigneeAvatar?: string;
  assigneeInitials?: string;
  status: 'IN PROGRESS' | 'DELAYED' | 'TODO';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  barColor: 'error' | 'warning' | 'secondary';
}

export interface ProjectInfo {
  id: string;
  name: string;
  sprintName: string;
  priority: string;
  totalTasks: number;
  completedThisWeek: number;
  criticalPathDays: number;
  bottlenecksCount: number;
  resourceEffPercent: number;
  currentCost: number;
  projectedCost: number;
  optimizedCost: number;
  scheduleHealthPercent: number;
  clientSponsor?: string;
  startDate?: string;
  endDate?: string;
  disqusShortname?: string;
}
