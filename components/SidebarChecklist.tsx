import React from 'react';
import { CheckCircle, Circle, Printer, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PIPELINE_STAGES } from '../constants';
import { StageStatus } from '../types';

interface Props {
  currentStageIndex: number;
  isSecure: boolean;
}

const SidebarChecklist: React.FC<Props> = ({ currentStageIndex, isSecure }) => {
  // Aggregate all controls
  const allControls = PIPELINE_STAGES.flatMap((stage, idx) => 
    (stage.complianceControls || []).map(control => ({
      ...control,
      stageName: stage.name,
      // Logic: If stage is passed (idx < current) OR (stage is active AND we are secure), it's a pass.
      // If we are NOT secure and stage is active, it's a fail.
      computedStatus: idx < currentStageIndex 
        ? (isSecure ? 'PASS' : 'FAIL') // Historical check: if environment is secure, previous stages count as pass.
        : idx === currentStageIndex 
            ? (isSecure ? 'PASS' : 'PENDING') 
            : 'PENDING'
    }))
  );

  const passedCount = allControls.filter(c => c.computedStatus === 'PASS').length;
  const totalCount = allControls.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/30">
        <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Checklist</h3>
            <button 
                onClick={handlePrint} 
                className="text-slate-500 hover:text-indigo-400 transition-colors"
                title="Print Report to PDF"
            >
                <Printer size={14} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Compliance Status</span>
                <span className="text-xs font-mono font-bold text-slate-300">{passedCount}/{totalCount}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${(passedCount / totalCount) * 100}%` }} 
                />
            </div>

            <div className="space-y-3">
                {allControls.map((control) => (
                    <div key={control.id} className="flex gap-2 items-start group">
                        <div className={`mt-0.5 ${
                            control.computedStatus === 'PASS' ? 'text-emerald-500' : 
                            control.computedStatus === 'FAIL' ? 'text-red-500' : 'text-slate-700'
                        }`}>
                            {control.computedStatus === 'PASS' ? <CheckCircle size={14} /> : 
                             control.computedStatus === 'FAIL' ? <ShieldAlert size={14} /> : <Circle size={14} />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-[11px] font-medium leading-tight ${control.computedStatus === 'PENDING' ? 'text-slate-500' : 'text-slate-300'}`}>
                                {control.name}
                            </p>
                            <p className="text-[9px] text-slate-600 mt-0.5">{control.stageName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default SidebarChecklist;