import { ProjectInfo, Resource, Task, AISuggestion, BottleneckItem } from '../types';

export const INITIAL_PROJECT: ProjectInfo = {
  id: 'proj-alpha',
  name: 'Project Alpha',
  sprintName: 'Active Sprint',
  priority: 'High Priority',
  totalTasks: 142,
  completedThisWeek: 12,
  criticalPathDays: 45,
  bottlenecksCount: 3,
  resourceEffPercent: 87,
  currentCost: 120000,
  projectedCost: 150000,
  optimizedCost: 105000,
  scheduleHealthPercent: 75,
  clientSponsor: 'Acme Global Corp',
  startDate: '2026-09-01',
  endDate: '2026-12-15',
  disqusShortname: 'jh-prods',
};

export const SECOND_PROJECT: ProjectInfo = {
  id: 'proj-beta',
  name: 'Enterprise Cloud Portal',
  sprintName: 'Sprint 14',
  priority: 'Critical Path',
  totalTasks: 88,
  completedThisWeek: 19,
  criticalPathDays: 28,
  bottlenecksCount: 1,
  resourceEffPercent: 94,
  currentCost: 95000,
  projectedCost: 110000,
  optimizedCost: 92000,
  scheduleHealthPercent: 92,
  clientSponsor: 'Nexus Financial Inc',
  startDate: '2026-10-01',
  endDate: '2026-12-31',
  disqusShortname: 'jh-prods',
};

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    name: 'Jane Doe',
    role: 'Senior Engineer',
    department: 'Engineering',
    monthlyCost: 12500,
    initials: 'JD',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1NDoafaWy4atgT9sFMDq4R3H34KpAQDf4boPgx-KYJQTFyKBEB_TTD10Emcndoom3-zQ_sj9HsK8rsduW2uUdvdAKmCuOkJr4YQlP_3GjugPkB6aJbIyU37PS65T9lZ1DSKcGK9SNf0HEzC4vVao9wOCwdwyYPMrUq2O7g9hCM1ewSNWkCaLBJRVzh4EBAVopAN6-9TMAlzontjL8aWS1eRAJjK56z3Jc4sBpVlR1Q972BRqsx-w',
    capacityAvg: 115,
    isOverallocated: true,
    dailyCapacity: {
      1: 80, 2: 80, 3: 120, 4: 0, 5: 0, 6: 140, 7: 140, 8: 60, 9: 60, 10: 60, 11: 80, 12: 100, 13: 80, 14: 80
    }
  },
  {
    id: 'res-2',
    name: 'Alex Smith',
    role: 'UX Designer',
    department: 'Design',
    monthlyCost: 9800,
    initials: 'AS',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb3LgL4x3WnUF143txAKv65er3gbgE_3QgGxUBUU--c21ZPwoR2nRkn9Uq1hA94sNY-HgW-_sAeX8bG7B2pJ5SSDG49mjA3K9Yv1g0sw9S8eXRsNeuOouiCcnexXMVa_1C_39_lu8_-ZCobcOp9hfMqZmuXd-pBUT1IWxv1_ScvRz0b1k-uixWnmWn3nHXCz1YYxGd3xc6JpMT320OR85q7rka_xhGOii-hPtgelDOjHKQv_1gR6M',
    capacityAvg: 85,
    dailyCapacity: {
      1: 80, 2: 80, 3: 80, 4: 0, 5: 0, 6: 100, 7: 100, 8: 100, 9: 100, 10: 80, 11: 80, 12: 80, 13: 75, 14: 75
    }
  },
  {
    id: 'res-3',
    name: 'Robert Jones',
    role: 'Project Manager',
    department: 'Management',
    monthlyCost: 11200,
    initials: 'RJ',
    capacityAvg: 60,
    dailyCapacity: {
      1: 40, 2: 40, 3: 40, 4: 0, 5: 0, 6: 60, 7: 60, 8: 20, 9: 20, 10: 20, 11: 50, 12: 50, 13: 60, 14: 60
    }
  },
  {
    id: 'res-4',
    name: 'Elena R.',
    role: 'UI/UX Lead',
    department: 'Design',
    monthlyCost: 10500,
    initials: 'ER',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeWvd4csYdv4-PB0TNS3_g2Vj-m_0NzOKicPHlwLJ8A_gO--KJ9A-vhfi6AkQcyAoGgFYrCBeZhcCj89QPstSgVn8iv76pGW3eAfSxk_JcEQ5uDllxk_TtZN1jABoDDT-Sl81D_xgYA-NhY9x9ArxQ_FllxiVUDg09g5T4U_5eTgL5wS2oN9SbHFTO-2mBzgfPG7-y1XYxhGcukbg8mqj66my1lr6-O1WZA5HW7_DJTlVvDvgLxDw',
    capacityAvg: 105,
    isOverallocated: true,
    dailyCapacity: {
      1: 100, 2: 100, 3: 100, 4: 0, 5: 0, 6: 110, 7: 110, 8: 100, 9: 100, 10: 120, 11: 90, 12: 90, 13: 100, 14: 100
    }
  },
  {
    id: 'res-5',
    name: 'Marcus K.',
    role: 'QA Engineer',
    department: 'QA',
    monthlyCost: 8500,
    initials: 'MK',
    capacityAvg: 70,
    dailyCapacity: {
      1: 50, 2: 60, 3: 70, 4: 0, 5: 0, 6: 80, 7: 80, 8: 70, 9: 60, 10: 70, 11: 70, 12: 60, 13: 70, 14: 70
    }
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    code: 'OPT-104',
    title: 'Configure Database Sharding Protocol',
    status: 'todo',
    statusLabel: 'Ready',
    assignee: {
      name: 'Jane Doe',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1NDoafaWy4atgT9sFMDq4R3H34KpAQDf4boPgx-KYJQTFyKBEB_TTD10Emcndoom3-zQ_sj9HsK8rsduW2uUdvdAKmCuOkJr4YQlP_3GjugPkB6aJbIyU37PS65T9lZ1DSKcGK9SNf0HEzC4vVao9wOCwdwyYPMrUq2O7g9hCM1ewSNWkCaLBJRVzh4EBAVopAN6-9TMAlzontjL8aWS1eRAJjK56z3Jc4sBpVlR1Q972BRqsx-w'
    },
    dueDate: 'Oct 12',
    subtaskRatio: '0/4',
    department: 'Engineering',
    startDate: '2026-10-01',
    endDate: '2026-10-12',
    progress: 10
  },
  {
    id: 'task-2',
    code: 'OPT-108',
    title: 'Migrate Legacy User Data',
    status: 'todo',
    statusLabel: 'Waiting on OPT-104',
    assignee: {
      name: 'Jane Doe',
      initials: 'JD'
    },
    dueDate: 'Oct 15',
    department: 'Engineering',
    dependsOn: ['OPT-104'],
    startDate: '2026-10-12',
    endDate: '2026-10-15',
    progress: 0
  },
  {
    id: 'task-3',
    code: 'OPT-112',
    title: 'Update API Documentation',
    status: 'todo',
    statusLabel: 'Waiting on OPT-102',
    dueDate: 'Oct 18',
    department: 'Engineering',
    dependsOn: ['OPT-102'],
    startDate: '2026-10-14',
    endDate: '2026-10-18',
    progress: 0
  },
  {
    id: 'task-4',
    code: 'OPT-102',
    title: 'Implement Core Calculation Engine',
    status: 'in_progress',
    statusLabel: 'In Execution',
    assignee: {
      name: 'Alex Smith',
      initials: 'AK',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb3LgL4x3WnUF143txAKv65er3gbgE_3QgGxUBUU--c21ZPwoR2nRkn9Uq1hA94sNY-HgW-_sAeX8bG7B2pJ5SSDG49mjA3K9Yv1g0sw9S8eXRsNeuOouiCcnexXMVa_1C_39_lu8_-ZCobcOp9hfMqZmuXd-pBUT1IWxv1_ScvRz0b1k-uixWnmWn3nHXCz1YYxGd3xc6JpMT320OR85q7rka_xhGOii-hPtgelDOjHKQv_1gR6M'
    },
    dueDate: 'Oct 10',
    subtaskRatio: '3/5',
    department: 'Engineering',
    startDate: '2026-10-02',
    endDate: '2026-10-10',
    progress: 60
  },
  {
    id: 'task-5',
    code: 'OPT-098',
    title: 'Design System Integration Audit',
    status: 'in_progress',
    statusLabel: 'In Progress',
    assignee: {
      name: 'Elena R.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeWvd4csYdv4-PB0TNS3_g2Vj-m_0NzOKicPHlwLJ8A_gO--KJ9A-vhfi6AkQcyAoGgFYrCBeZhcCj89QPstSgVn8iv76pGW3eAfSxk_JcEQ5uDllxk_TtZN1jABoDDT-Sl81D_xgYA-NhY9x9ArxQ_FllxiVUDg09g5T4U_5eTgL5wS2oN9SbHFTO-2mBzgfPG7-y1XYxhGcukbg8mqj66my1lr6-O1WZA5HW7_DJTlVvDvgLxDw'
    },
    dueDate: 'Oct 11',
    department: 'Design',
    startDate: '2026-10-03',
    endDate: '2026-10-11',
    progress: 45
  },
  {
    id: 'task-6',
    code: 'OPT-085',
    title: 'Initial Authentication Flow Setup',
    status: 'review',
    statusLabel: 'QA Pending',
    assignee: {
      name: 'Marcus R.',
      initials: 'MR'
    },
    dueDate: 'Oct 08',
    department: 'QA',
    startDate: '2026-09-28',
    endDate: '2026-10-08',
    progress: 90
  },
  {
    id: 'task-7',
    code: 'OPT-072',
    title: 'Gantt Chart Interactive Render Engine',
    status: 'done',
    statusLabel: 'Completed',
    assignee: {
      name: 'Jane Doe',
      initials: 'JD'
    },
    dueDate: 'Oct 04',
    department: 'Engineering',
    startDate: '2026-09-20',
    endDate: '2026-10-04',
    progress: 100
  },
  {
    id: 'task-8',
    code: 'OPT-069',
    title: 'Bento Dashboard Grid System Component',
    status: 'done',
    statusLabel: 'Completed',
    assignee: {
      name: 'Elena R.',
      initials: 'ER'
    },
    dueDate: 'Oct 02',
    department: 'Design',
    startDate: '2026-09-18',
    endDate: '2026-10-02',
    progress: 100
  }
];

export const INITIAL_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'sug-1',
    title: 'Reschedule Backend API',
    description: 'Moving this task forward by 2 days resolves resource conflict with Database Migration.',
    actionText: 'Apply Fix',
    type: 'reschedule',
    applied: false
  },
  {
    id: 'sug-2',
    title: 'Reassign QA Testing',
    description: 'Sarah has 30% available capacity next week. Assigning her reduces bottleneck.',
    actionText: 'Review Resource',
    type: 'reassign',
    applied: false
  }
];

export const INITIAL_BOTTLENECKS: BottleneckItem[] = [
  {
    id: 'bot-1',
    taskName: 'Database Schema Design',
    blockingTasksCount: 8,
    assigneeName: 'J. Doe',
    assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1NDoafaWy4atgT9sFMDq4R3H34KpAQDf4boPgx-KYJQTFyKBEB_TTD10Emcndoom3-zQ_sj9HsK8rsduW2uUdvdAKmCuOkJr4YQlP_3GjugPkB6aJbIyU37PS65T9lZ1DSKcGK9SNf0HEzC4vVao9wOCwdwyYPMrUq2O7g9hCM1ewSNWkCaLBJRVzh4EBAVopAN6-9TMAlzontjL8aWS1eRAJjK56z3Jc4sBpVlR1Q972BRqsx-w',
    status: 'IN PROGRESS',
    impact: 'HIGH',
    barColor: 'error'
  },
  {
    id: 'bot-2',
    taskName: 'Client Feedback Approval',
    blockingTasksCount: 4,
    assigneeName: 'M. Smith',
    assigneeInitials: 'M',
    status: 'DELAYED',
    impact: 'MEDIUM',
    barColor: 'warning'
  },
  {
    id: 'bot-3',
    taskName: 'Third-party API Keys',
    blockingTasksCount: 2,
    assigneeName: 'Unassigned',
    status: 'TODO',
    impact: 'LOW',
    barColor: 'secondary'
  }
];
