import { Task, ProjectInfo, BottleneckItem, Resource } from '../types';

export interface RecalculatedMetrics {
  updatedProject: ProjectInfo;
  updatedBottlenecks: BottleneckItem[];
  criticalTaskCodes: Set<string>;
}

// Helper to parse date string like '2026-10-01' or 'Oct 12' into a Date object
export function parseTaskDate(dateStr?: string, defaultYear = 2026): Date {
  if (!dateStr) return new Date(defaultYear, 9, 1);
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = Date.parse(dateStr.includes('202') ? dateStr : `${dateStr}, ${defaultYear}`);
  if (!isNaN(parsed)) return new Date(parsed);
  return new Date(defaultYear, 9, 1);
}

// Format Date object back to YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format Date object to 'Oct 12' style
export function formatDateShort(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
}

// Calculate task duration in calendar days (min 1 day)
export function getTaskDurationDays(task: Task): number {
  const start = parseTaskDate(task.startDate || task.dueDate);
  const end = parseTaskDate(task.endDate || task.dueDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function recalculateProjectMetrics(
  project: ProjectInfo,
  tasks: Task[],
  resources: Resource[]
): RecalculatedMetrics {
  if (!tasks || tasks.length === 0) {
    return {
      updatedProject: project,
      updatedBottlenecks: [],
      criticalTaskCodes: new Set(),
    };
  }

  // 1. Calculate Timeline (Min start date, max end date)
  let minStart = parseTaskDate(tasks[0].startDate || tasks[0].dueDate);
  let maxEnd = parseTaskDate(tasks[0].endDate || tasks[0].dueDate);

  tasks.forEach((t) => {
    const s = parseTaskDate(t.startDate || t.dueDate);
    const e = parseTaskDate(t.endDate || t.dueDate);
    if (s < minStart) minStart = s;
    if (e > maxEnd) maxEnd = e;
  });

  // 2. Calculate Critical Path using DAG / longest path based on task durations and dependencies
  const codeToTask = new Map<string, Task>();
  tasks.forEach((t) => codeToTask.set(t.code, t));

  const durationMap = new Map<string, number>();
  const successorsMap = new Map<string, string[]>();

  tasks.forEach((t) => {
    durationMap.set(t.code, getTaskDurationDays(t));
    successorsMap.set(t.code, []);
  });

  tasks.forEach((t) => {
    if (t.dependsOn) {
      t.dependsOn.forEach((depCode) => {
        if (successorsMap.has(depCode)) {
          successorsMap.get(depCode)!.push(t.code);
        }
      });
    }
  });

  const earliestStart = new Map<string, number>();
  const earliestFinish = new Map<string, number>();

  tasks.forEach((t) => {
    earliestStart.set(t.code, 0);
    earliestFinish.set(t.code, durationMap.get(t.code) || 1);
  });

  // Relax paths to find maximum timeline depth for each node
  for (let iter = 0; iter < tasks.length; iter++) {
    tasks.forEach((t) => {
      const code = t.code;
      const dur = durationMap.get(code) || 1;
      const es = earliestStart.get(code) || 0;
      const ef = es + dur;
      earliestFinish.set(code, ef);

      const succs = successorsMap.get(code) || [];
      succs.forEach((succCode) => {
        const currentSuccES = earliestStart.get(succCode) || 0;
        if (ef > currentSuccES) {
          earliestStart.set(succCode, ef);
        }
      });
    });
  }

  let maxCriticalPathDays = 0;
  earliestFinish.forEach((ef) => {
    if (ef > maxCriticalPathDays) maxCriticalPathDays = ef;
  });

  const criticalTaskCodes = new Set<string>();
  const queue: string[] = [];

  earliestFinish.forEach((ef, code) => {
    if (ef === maxCriticalPathDays) {
      queue.push(code);
      criticalTaskCodes.add(code);
    }
  });

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currES = earliestStart.get(curr) || 0;
    const taskObj = codeToTask.get(curr);

    if (taskObj?.dependsOn) {
      taskObj.dependsOn.forEach((depCode) => {
        const depEF = earliestFinish.get(depCode) || 0;
        if (depEF === currES) {
          criticalTaskCodes.add(depCode);
          queue.push(depCode);
        }
      });
    }
  }

  if (criticalTaskCodes.size === 0 && tasks.length > 0) {
    criticalTaskCodes.add(tasks[0].code);
  }

  // 3. Bottlenecks Calculation
  const dependencyCounts = new Map<string, number>();
  tasks.forEach((t) => {
    if (t.dependsOn) {
      t.dependsOn.forEach((dep) => {
        dependencyCounts.set(dep, (dependencyCounts.get(dep) || 0) + 1);
      });
    }
  });

  const updatedBottlenecks: BottleneckItem[] = [];
  tasks.forEach((t) => {
    const blockingCount = dependencyCounts.get(t.code) || 0;
    const isCritical = criticalTaskCodes.has(t.code);

    if (blockingCount > 0 || isCritical) {
      const impact = (blockingCount >= 3 || (isCritical && blockingCount >= 1)) ? 'HIGH' : blockingCount >= 1 ? 'MEDIUM' : 'LOW';
      const statusStr = t.status === 'in_progress' ? 'IN PROGRESS' : t.status === 'todo' ? 'TODO' : 'DELAYED';
      const barColor = impact === 'HIGH' ? 'error' : impact === 'MEDIUM' ? 'warning' : 'secondary';

      updatedBottlenecks.push({
        id: `bot-${t.id}`,
        taskName: t.title,
        blockingTasksCount: blockingCount,
        assigneeName: t.assignee?.name || 'Unassigned',
        assigneeAvatar: t.assignee?.avatar,
        assigneeInitials: t.assignee?.initials,
        status: statusStr,
        impact,
        barColor,
      });
    }
  });

  updatedBottlenecks.sort((a, b) => {
    const impactVal = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (impactVal[b.impact] - impactVal[a.impact]) || (b.blockingTasksCount - a.blockingTasksCount);
  });

  // 4. Cost Against Budget Recalculation
  const avgDailyResourceRate = resources.length > 0
    ? resources.reduce((acc, r) => acc + r.monthlyCost, 0) / (resources.length * 20)
    : 500;

  let totalTaskCost = 0;
  let completedTaskCost = 0;

  tasks.forEach((t) => {
    const dur = getTaskDurationDays(t);
    const taskCost = dur * avgDailyResourceRate;
    totalTaskCost += taskCost;
    if (t.status === 'done') {
      completedTaskCost += taskCost;
    } else if (t.status === 'in_progress') {
      completedTaskCost += taskCost * ((t.progress || 50) / 100);
    }
  });

  const currentCost = Math.round(completedTaskCost);
  const projectedCost = Math.max(project.projectedCost || 150000, Math.round(totalTaskCost));
  const optimizedCost = Math.round(projectedCost * 0.82);

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const healthBase = Math.round((doneTasks / tasks.length) * 100);
  const scheduleHealthPercent = Math.min(100, Math.max(45, healthBase + 50 - updatedBottlenecks.length * 4));

  const updatedProject: ProjectInfo = {
    ...project,
    startDate: formatDateISO(minStart),
    endDate: formatDateISO(maxEnd),
    criticalPathDays: maxCriticalPathDays,
    bottlenecksCount: updatedBottlenecks.length,
    currentCost,
    projectedCost,
    optimizedCost,
    scheduleHealthPercent,
    totalTasks: tasks.length,
  };

  return {
    updatedProject,
    updatedBottlenecks,
    criticalTaskCodes,
  };
}
