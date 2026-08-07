import { ProjectInfo, Task, TaskStatus } from '../types';

export interface MissingTaskFieldReport {
  taskTitle: string;
  missingFields: string[];
}

export interface MappingResult {
  mappedProject: Partial<ProjectInfo>;
  mappedTasks: Task[];
  unmappedFields: string[];
  tasksWithMissingFields: MissingTaskFieldReport[];
  totalFieldsDetected: number;
  totalTasksDetected: number;
}

const KNOWN_PROJECT_KEYS: Record<string, keyof ProjectInfo> = {
  name: 'name',
  projectname: 'name',
  project_name: 'name',
  title: 'name',
  project: 'name',
  label: 'name',

  client: 'clientSponsor',
  clientsponsor: 'clientSponsor',
  client_sponsor: 'clientSponsor',
  sponsor: 'clientSponsor',
  customer: 'clientSponsor',
  organization: 'clientSponsor',

  budget: 'projectedCost',
  projectedcost: 'projectedCost',
  projected_cost: 'projectedCost',
  totalbudget: 'projectedCost',
  total_budget: 'projectedCost',
  cost: 'projectedCost',
  amount: 'projectedCost',

  startdate: 'startDate',
  start_date: 'startDate',
  start: 'startDate',
  launchdate: 'startDate',

  enddate: 'endDate',
  end_date: 'endDate',
  end: 'endDate',
  targetend: 'endDate',
  deadline: 'endDate',

  sprintname: 'sprintName',
  sprint_name: 'sprintName',
  sprint: 'sprintName',
  iteration: 'sprintName',
};

const KNOWN_TASK_KEYS = [
  'title',
  'task',
  'taskname',
  'task_name',
  'summary',
  'item',
  'name',
  'code',
  'id',
  'taskid',
  'task_code',
  'wbscode',
  'wbs_code',
  'wbs',
  'status',
  'state',
  'task_status',
  'progress',
  'assignee',
  'assignedto',
  'assigned_to',
  'owner',
  'lead',
  'duedate',
  'due_date',
  'due',
  'deadline',
  'targetdate',
  'department',
  'dept',
  'team',
  'subtaskratio',
  'dependson',
  'depends_on',
];

export function parseAndMapProjectFile(
  fileContent: string,
  fileName: string
): MappingResult {
  const mappedProject: Partial<ProjectInfo> = {};
  const mappedTasks: Task[] = [];
  const unmappedFieldsSet = new Set<string>();
  const tasksWithMissingFields: MissingTaskFieldReport[] = [];

  let totalFieldsDetected = 0;

  // Try parsing JSON first
  let isJson = false;
  try {
    const data = JSON.parse(fileContent);
    isJson = true;

    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        // Data is an array of tasks
        processRawTasksArray(data, mappedTasks, tasksWithMissingFields, unmappedFieldsSet);
      } else {
        // Data is a root object containing project properties and/or tasks array
        const keys = Object.keys(data);
        totalFieldsDetected += keys.length;

        keys.forEach((key) => {
          const lowerKey = key.toLowerCase().replace(/[\s_-]/g, '');
          if (KNOWN_PROJECT_KEYS[lowerKey]) {
            const mappedProp = KNOWN_PROJECT_KEYS[lowerKey];
            if (mappedProp === 'projectedCost') {
              mappedProject.projectedCost = parseFloat(data[key]) || 0;
            } else {
              (mappedProject as any)[mappedProp] = String(data[key]);
            }
          } else if (
            ['tasks', 'wbs', 'workbreakdownstructure', 'items', 'tasklist', 'taskslist'].includes(
              lowerKey
            ) &&
            Array.isArray(data[key])
          ) {
            processRawTasksArray(
              data[key],
              mappedTasks,
              tasksWithMissingFields,
              unmappedFieldsSet
            );
          } else {
            unmappedFieldsSet.add(key);
          }
        });
      }
    }
  } catch (err) {
    isJson = false;
  }

  // If not JSON, parse as CSV or Key-Value text
  if (!isJson) {
    const lines = fileContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length > 0) {
      // Check if CSV with header row
      const firstLine = lines[0];
      if (firstLine.includes(',') || firstLine.includes('\t') || firstLine.includes(';')) {
        const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';
        const headers = firstLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));
        totalFieldsDetected += headers.length;

        const rawTasksFromCsv: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ''));
          const rowObj: Record<string, string> = {};

          headers.forEach((header, idx) => {
            rowObj[header] = values[idx] || '';
          });

          rawTasksFromCsv.push(rowObj);
        }

        processRawTasksArray(
          rawTasksFromCsv,
          mappedTasks,
          tasksWithMissingFields,
          unmappedFieldsSet
        );
      } else {
        // Plain key-value lines e.g. "Project Name: Cloud Portal"
        lines.forEach((line) => {
          const parts = line.split(/:(.+)/);
          if (parts.length >= 2) {
            totalFieldsDetected++;
            const key = parts[0].trim();
            const val = parts[1].trim();
            const lowerKey = key.toLowerCase().replace(/[\s_-]/g, '');

            if (KNOWN_PROJECT_KEYS[lowerKey]) {
              const mappedProp = KNOWN_PROJECT_KEYS[lowerKey];
              if (mappedProp === 'projectedCost') {
                mappedProject.projectedCost = parseFloat(val) || 0;
              } else {
                (mappedProject as any)[mappedProp] = val;
              }
            } else {
              unmappedFieldsSet.add(key);
            }
          }
        }      );
      }
    }
  }

  return {
    mappedProject,
    mappedTasks,
    unmappedFields: Array.from(unmappedFieldsSet),
    tasksWithMissingFields,
    totalFieldsDetected,
    totalTasksDetected: mappedTasks.length,
  };
}

function processRawTasksArray(
  rawList: any[],
  outTasks: Task[],
  outMissingFieldsReports: MissingTaskFieldReport[],
  outUnmappedKeys: Set<string>
) {
  rawList.forEach((raw, idx) => {
    if (typeof raw !== 'object' || raw === null) return;

    const keys = Object.keys(raw);
    let title = '';
    let code = `OPT-${100 + idx}`;
    let statusRaw = '';
    let assigneeName = '';
    let dueDate = '';
    let department = 'Engineering';

    keys.forEach((k) => {
      const lower = k.toLowerCase().replace(/[\s_-]/g, '');
      const val = String(raw[k] || '').trim();

      if (['title', 'task', 'taskname', 'summary', 'item', 'name'].includes(lower)) {
        title = val;
      } else if (['code', 'id', 'taskid', 'taskcode', 'wbscode', 'wbs'].includes(lower)) {
        code = val;
      } else if (['status', 'state', 'taskstatus', 'progress'].includes(lower)) {
        statusRaw = val;
      } else if (['assignee', 'assignedto', 'owner', 'lead'].includes(lower)) {
        assigneeName = val;
      } else if (['duedate', 'due', 'deadline', 'targetdate'].includes(lower)) {
        dueDate = val;
      } else if (['department', 'dept', 'team'].includes(lower)) {
        department = val;
      } else if (!KNOWN_PROJECT_KEYS[lower] && !KNOWN_TASK_KEYS.includes(lower)) {
        outUnmappedKeys.add(k);
      }
    });

    // Check missing fields for this task
    const missing: string[] = [];
    if (!title) missing.push('Title/Name');
    if (!statusRaw) missing.push('Status');
    if (!assigneeName) missing.push('Assignee');
    if (!dueDate) missing.push('Due Date');

    if (missing.length > 0) {
      outMissingFieldsReports.push({
        taskTitle: title || `Task #${idx + 1}`,
        missingFields: missing,
      });
    }

    // Map status string to valid TaskStatus
    let status: TaskStatus = 'todo';
    const sLower = statusRaw.toLowerCase();
    if (sLower.includes('done') || sLower.includes('complete') || sLower.includes('closed')) {
      status = 'done';
    } else if (sLower.includes('progress') || sLower.includes('doing') || sLower.includes('execution')) {
      status = 'in_progress';
    } else if (sLower.includes('review') || sLower.includes('qa') || sLower.includes('testing')) {
      status = 'review';
    }

    const taskTitle = title || `Imported Task #${idx + 1}`;
    const initials =
      assigneeName
        ? assigneeName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'UN';

    outTasks.push({
      id: `imported-${Date.now()}-${idx}`,
      code: code || `OPT-${100 + idx}`,
      title: taskTitle,
      status,
      statusLabel:
        status === 'done'
          ? 'Completed'
          : status === 'in_progress'
          ? 'In Execution'
          : status === 'review'
          ? 'QA Pending'
          : 'Ready',
      assignee: {
        name: assigneeName || 'Unassigned',
        initials,
      },
      dueDate: dueDate || 'TBD',
      department: department || 'Engineering',
      subtaskRatio: '0/2',
    });
  });
}
