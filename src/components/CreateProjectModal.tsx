import React, { useState } from 'react';
import { ProjectInfo, Task } from '../types';
import { parseAndMapProjectFile, MappingResult } from '../utils/fileMapping';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreateProject: (project: Partial<ProjectInfo>, importedTasks?: Task[]) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject(
      {
        name,
        clientSponsor: client || 'Internal Workspace',
        projectedCost: parseFloat(budget) || 150000,
        currentCost: 0,
        startDate: startDate || '2026-10-01',
        endDate: endDate || '2026-12-31',
      },
      mappingResult?.mappedTasks
    );

    onClose();
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const result = parseAndMapProjectFile(content, file.name);
          setMappingResult(result);

          // Auto-fill available mapped project attributes
          if (result.mappedProject.name) setName(result.mappedProject.name);
          if (result.mappedProject.clientSponsor)
            setClient(result.mappedProject.clientSponsor);
          if (result.mappedProject.projectedCost)
            setBudget(String(result.mappedProject.projectedCost));
          if (result.mappedProject.startDate)
            setStartDate(result.mappedProject.startDate);
          if (result.mappedProject.endDate)
            setEndDate(result.mappedProject.endDate);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Initialize workspace and allocate resources.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* Section 1: CORE DETAILS */}
          <div>
            <span className="font-bold text-[10px] text-blue-700 uppercase tracking-wider block mb-3">
              1. CORE DETAILS
            </span>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q3 Infrastructure Upgrade"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client / Sponsor
                  </label>
                  <input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Internal or External Client"
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Budget ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                      $
                    </span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-md pl-7 pr-3 py-2 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: TIMELINE PARAMETERS */}
          <div>
            <span className="font-bold text-[10px] text-blue-700 uppercase tracking-wider block mb-3">
              2. TIMELINE PARAMETERS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: WORK BREAKDOWN STRUCTURE */}
          <div>
            <span className="font-bold text-[10px] text-blue-700 uppercase tracking-wider block mb-2">
              3. WORK BREAKDOWN STRUCTURE & MAPPING
            </span>

            <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer">
              <input
                type="file"
                accept=".csv,.xlsx,.json,.mpp,.xml,.txt"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">
                cloud_upload
              </span>

              {uploadedFileName ? (
                <div className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Uploaded File: {uploadedFileName}
                </div>
              ) : (
                <>
                  <p className="font-semibold text-slate-800 text-xs">
                    Drag and drop your WBS / project file here or click to browse
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supported formats: .csv, .json, .txt, .xml, .xlsx
                  </p>
                </>
              )}
            </div>

            {/* Intelligent Mapping Results Feedback */}
            {mappingResult && (
              <div className="mt-4 space-y-3">
                {/* General Mapping Summary */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      auto_awesome
                    </span>
                    <span>
                      <strong className="font-bold">Project File Mapped:</strong> Auto-populated project fields and parsed{' '}
                      <strong>{mappingResult.totalTasksDetected}</strong> tasks.
                    </span>
                  </div>
                </div>

                {/* Unmapped Fields Warning */}
                {mappingResult.unmappedFields.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>Unmapped File Fields ({mappingResult.unmappedFields.length}):</span>
                    </div>
                    <p className="text-[11px] text-amber-700 mb-2">
                      The following attributes in your file could not be mapped to standard project or task properties:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mappingResult.unmappedFields.map((field) => (
                        <span
                          key={field}
                          className="px-2 py-0.5 bg-amber-100/80 border border-amber-300 rounded font-mono text-[10px] text-amber-900 font-semibold"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Task Fields Report */}
                {mappingResult.tasksWithMissingFields.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-900 text-xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-800">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>
                        Tasks with Missing Fields ({mappingResult.tasksWithMissingFields.length}):
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 mb-2">
                      The following tasks in your uploaded file are missing required properties:
                    </p>
                    <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {mappingResult.tasksWithMissingFields.map((report, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between text-[11px] bg-white/70 p-1.5 rounded border border-rose-100"
                        >
                          <span className="font-semibold text-rose-950 truncate max-w-[240px]">
                            • {report.taskTitle}
                          </span>
                          <span className="text-[10px] text-rose-700 font-mono bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                            Missing: {report.missingFields.join(', ')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold text-xs hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs shadow-xs transition-all active:scale-95"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
