import React, { useState, useEffect } from 'react';

interface AutoOptimizeModalProps {
  onClose: () => void;
  onConfirmOptimization: () => void;
}

export const AutoOptimizeModal: React.FC<AutoOptimizeModalProps> = ({
  onClose,
  onConfirmOptimization,
}) => {
  const [step, setStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps = [
    'Auditing 142 sprint tasks & dependency paths...',
    'Identifying critical path bottlenecks (Database Schema Design, API Keys)...',
    'Analyzing team member capacity heatmaps & overallocation risks...',
    'Calculating optimal workload leveling & cost reduction rules...',
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-blue-400 animate-pulse text-[22px]">
              auto_awesome
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">OptiPlan AI Optimizer</h3>
              <p className="text-[11px] text-slate-300">Real-Time Schedule & Resource Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Progress Steps */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            {steps.map((text, i) => {
              const isDone = i < step;
              const isCurrent = i === step;
              return (
                <div key={text} className="flex items-start gap-2.5">
                  {isDone ? (
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">
                      check_circle
                    </span>
                  ) : isCurrent ? (
                    <span className="material-symbols-outlined text-blue-600 text-[18px] animate-spin shrink-0">
                      sync
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-[18px] shrink-0">
                      radio_button_unchecked
                    </span>
                  )}
                  <span
                    className={`font-semibold ${
                      isDone
                        ? 'text-slate-800'
                        : isCurrent
                        ? 'text-blue-700 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Results Summary Box */}
          {isCompleted && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-lg space-y-3 animate-in fade-in duration-300">
              <h4 className="font-bold text-emerald-900 flex items-center text-xs">
                <span className="material-symbols-outlined text-emerald-600 mr-1.5 text-[18px]">
                  verified
                </span>
                Optimization Strategy Calculated!
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-200/60">
                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    Cost Savings
                  </span>
                  <span className="text-sm font-bold text-emerald-700">$15,000</span>
                </div>

                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    Critical Path
                  </span>
                  <span className="text-sm font-bold text-slate-900">43 Days (-2d)</span>
                </div>

                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    Resource Eff.
                  </span>
                  <span className="text-sm font-bold text-blue-700">92% (+5%)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold text-xs hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={!isCompleted}
            onClick={() => {
              onConfirmOptimization();
              onClose();
            }}
            className={`px-5 py-2 rounded-md font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Apply AI Schedule Fixes
          </button>
        </div>
      </div>
    </div>
  );
};
