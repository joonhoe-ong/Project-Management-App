import React, { useState } from 'react';
import { DisqusWidget } from './DisqusWidget';
import { ProjectInfo } from '../types';

interface DisqusFloatingBubbleProps {
  project: ProjectInfo;
}

const DisqusIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.82.502 3.52 1.378 4.975L2 22l5.187-1.32A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1.2 15H8V7h2.8c2.872 0 4.7 1.83 4.7 5s-1.828 5-4.7 5zm0-2.4c1.472 0 2.22-.84 2.22-2.6s-.748-2.6-2.22-2.6H9.7v5.2h1.1z" />
  </svg>
);

export const DisqusFloatingBubble: React.FC<DisqusFloatingBubbleProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  const disqusShortname = project.disqusShortname || 'jh-prods';

  return (
    <>
      {/* Floating Widget Bubble (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-3 px-5 py-3.5 rounded-full text-white font-extrabold shadow-2xl transition-all duration-200 active:scale-95 ${
            isOpen
              ? 'bg-slate-900 ring-4 ring-blue-500/50 scale-105'
              : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-400/40 hover:ring-blue-400/60 hover:scale-105 shadow-blue-600/30'
          }`}
          title="Open Product Comments / Feedback"
        >
          <div className="relative flex items-center justify-center">
            <DisqusIcon className="w-8 h-8 text-white drop-shadow-xs" />
            <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-emerald-400 border-2 border-blue-600 rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">Product Comments / Feedback</span>
          <span className={`material-symbols-outlined text-[20px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_less
          </span>
        </button>
      </div>

      {/* Disqus Comments Drawer / Popover Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[92vw] sm:w-[480px] max-h-[80vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Popover Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0 border-b border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-600 shadow-md flex items-center justify-center shrink-0 ring-2 ring-blue-400/30">
                <DisqusIcon className="w-7 h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  Disqus Thread: OptiPlan Comments / Feedback
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              title="Close window"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Disqus Embed Container */}
          <div className="p-4 overflow-y-auto flex-1 bg-white">
            <DisqusWidget
              shortname={disqusShortname}
              identifier={`project-floating-${project.id}`}
              title={`${project.name} - Platform Q&A`}
            />
          </div>
        </div>
      )}
    </>
  );
};
