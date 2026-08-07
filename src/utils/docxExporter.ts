import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from 'docx';
import { ProjectInfo, Task, Resource, AISuggestion, BottleneckItem } from '../types';

export async function generateProjectWordReport(
  project: ProjectInfo,
  tasks: Task[],
  resources: Resource[],
  suggestions: AISuggestion[],
  bottlenecks: BottleneckItem[]
): Promise<Blob> {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = '1E293B'; // Dark Slate
  const accentColor = '2563EB'; // Royal Blue
  const tableHeaderBg = '2563EB';
  const lightBg = 'F8FAFC';
  const borderColor = 'CBD5E1';

  // Calculate task status metrics
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCost = resources.reduce((acc, r) => acc + r.monthlyCost, 0);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: '334155',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `OptiPlan Pro Enterprise | ${project.name}`,
                    size: 18,
                    color: '94A3B8',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header Banner Title
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: 'OPTIPLAN PRO ENTERPRISE',
                bold: true,
                size: 20,
                color: accentColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            heading: HeadingLevel.TITLE,
            spacing: { before: 0, after: 180 },
            children: [
              new TextRun({
                text: 'Project Performance & Optimization Report',
                bold: true,
                size: 40, // 20pt
                color: primaryColor,
              }),
            ],
          }),

          // Metadata Callout Box / Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Project Name: ', bold: true, color: '1E293B' }),
                          new TextRun({ text: project.name }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Client / Sponsor: ', bold: true, color: '1E293B' }),
                          new TextRun({ text: project.clientSponsor || 'Internal Workspace' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Active Sprint: ', bold: true, color: '1E293B' }),
                          new TextRun({ text: project.sprintName }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Report Date: ', bold: true, color: '1E293B' }),
                          new TextRun({ text: currentDateStr }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Timeline: ', bold: true, color: '1E293B' }),
                          new TextRun({
                            text: `${project.startDate || '2026-10-01'} to ${project.endDate || '2026-12-31'}`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Schedule Health: ', bold: true, color: '1E293B' }),
                          new TextRun({
                            text: `${project.scheduleHealthPercent}% On Track`,
                            bold: true,
                            color: project.scheduleHealthPercent >= 80 ? '16A34A' : 'DC2626',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Executive Summary Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '1. Executive Summary & Core Metrics',
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `This performance report provides an overarching evaluation of `,
              }),
              new TextRun({ text: project.name, bold: true }),
              new TextRun({
                text: `. The current schedule health is rated at `,
              }),
              new TextRun({
                text: `${project.scheduleHealthPercent}%`,
                bold: true,
                color: accentColor,
              }),
              new TextRun({
                text: ` with a resource utilization efficiency of `,
              }),
              new TextRun({ text: `${project.resourceEffPercent}%`, bold: true }),
              new TextRun({
                text: `. A total of ${project.totalTasks} work breakdown tasks are tracked across teams.`,
              }),
            ],
          }),

          // KPI Overview Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createStyledHeaderCell('Metric Indicator', 35),
                  createStyledHeaderCell('Current Value', 30),
                  createStyledHeaderCell('Benchmark / Target', 35),
                ],
              }),
              createStyledDataRow('Total WBS Tasks', `${project.totalTasks}`, `${project.completedThisWeek} completed this week`),
              createStyledDataRow('Critical Path Duration', `${project.criticalPathDays} Days`, 'Target ≤ 40 Days'),
              createStyledDataRow('Active Bottlenecks', `${project.bottlenecksCount}`, 'Zero High Impact Bottlenecks'),
              createStyledDataRow('Resource Efficiency', `${project.resourceEffPercent}%`, 'Optimal range: 85% - 95%'),
              createStyledDataRow(
                'Current Spend',
                `$${project.currentCost.toLocaleString()}`,
                `Budget: $${project.projectedCost.toLocaleString()}`
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Section 2: Work Breakdown Structure (Task Status)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Work Breakdown Structure & Task Register',
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `Task Breakdown Summary: `,
                bold: true,
              }),
              new TextRun({
                text: `To Do (${todoCount}), In Progress (${inProgressCount}), Review (${reviewCount}), Completed (${doneCount}).`,
              }),
            ],
          }),

          // Tasks Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createStyledHeaderCell('Code', 15),
                  createStyledHeaderCell('Task Title', 35),
                  createStyledHeaderCell('Status', 20),
                  createStyledHeaderCell('Assignee', 18),
                  createStyledHeaderCell('Due Date', 12),
                ],
              }),
              ...tasks.map((task) =>
                new TableRow({
                  children: [
                    createCell(task.code, 15, true),
                    createCell(task.title, 35),
                    createCell(task.statusLabel || task.status.toUpperCase(), 20),
                    createCell(task.assignee?.name || 'Unassigned', 18),
                    createCell(task.dueDate, 12),
                  ],
                })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Section 3: Team Resources & Financial Spend
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. Team Resources & Cost Allocation',
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `Total monthly resource commitment: `,
              }),
              new TextRun({
                text: `$${totalCost.toLocaleString()} / month`,
                bold: true,
                color: primaryColor,
              }),
              new TextRun({
                text: ` across ${resources.length} active team members.`,
              }),
            ],
          }),

          // Resource Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createStyledHeaderCell('Resource Name', 25),
                  createStyledHeaderCell('Role', 25),
                  createStyledHeaderCell('Department', 20),
                  createStyledHeaderCell('Monthly Rate', 15),
                  createStyledHeaderCell('Avg Capacity', 15),
                ],
              }),
              ...resources.map((res) =>
                new TableRow({
                  children: [
                    createCell(res.name, 25, true),
                    createCell(res.role, 25),
                    createCell(res.department, 20),
                    createCell(`$${res.monthlyCost.toLocaleString()}`, 15),
                    createCell(`${res.capacityAvg}%`, 15),
                  ],
                })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Section 4: AI Schedule Optimization & Bottlenecks
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '4. Schedule Bottlenecks & Optimization Actions',
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Identified Project Bottlenecks:',
                bold: true,
              }),
            ],
          }),

          // Bottlenecks Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createStyledHeaderCell('Bottleneck Task', 40),
                  createStyledHeaderCell('Impact Level', 20),
                  createStyledHeaderCell('Blocked Tasks', 20),
                  createStyledHeaderCell('Lead Owner', 20),
                ],
              }),
              ...bottlenecks.map((b) =>
                new TableRow({
                  children: [
                    createCell(b.taskName, 40, true),
                    createCell(b.impact, 20),
                    createCell(`${b.blockingTasksCount} tasks`, 20),
                    createCell(b.assigneeName, 20),
                  ],
                })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 180 } }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Optimization Recommendations:',
                bold: true,
              }),
            ],
          }),

          ...suggestions.map(
            (s, index) =>
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({ text: `${index + 1}. `, bold: true, color: accentColor }),
                  new TextRun({ text: `${s.title}: `, bold: true }),
                  new TextRun({ text: s.description }),
                  new TextRun({
                    text: s.applied ? ' [Status: Applied]' : ' [Status: Pending]',
                    italics: true,
                    color: s.applied ? '16A34A' : 'D97706',
                  }),
                ],
              })
          ),

          new Paragraph({ text: '', spacing: { after: 360 } }),

          // Footer Sign-Off Section
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 60 },
            children: [
              new TextRun({
                text: '--- CONFIDENTIAL & PROPRIETARY ---',
                size: 18,
                bold: true,
                color: '94A3B8',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Generated automatically by OptiPlan Pro Real-Time Schedule & Resource Engine',
                size: 16,
                italics: true,
                color: '94A3B8',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createStyledHeaderCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: '2563EB' }, // Primary Royal Blue
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 20, // 10pt
          }),
        ],
      }),
    ],
  });
}

function createStyledDataRow(metric: string, val: string, benchmark: string): TableRow {
  return new TableRow({
    children: [
      createCell(metric, 35, true),
      createCell(val, 30),
      createCell(benchmark, 35),
    ],
  });
}

function createCell(text: string, widthPercent: number, bold = false): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold,
            size: 20, // 10pt
            color: '1E293B',
          }),
        ],
      }),
    ],
  });
}
