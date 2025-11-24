import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, Globe, Ban, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Threat {
  id: string;
  timestamp: string;
  type: string;
  sourceIp: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'BLOCKED' | 'DETECTED';
}

interface Props {
  isSecure: boolean;
  active: boolean;
}

const THREAT_TYPES = [
  { name: 'SQL Injection', code: 'SQLi', severity: 'CRITICAL' },
  { name: 'Cross-Site Scripting', code: 'XSS', severity: 'HIGH' },
  { name: 'Path Traversal', code: 'LFI', severity: 'HIGH' },
  { name: 'Brute Force', code: 'AUTH', severity: 'MEDIUM' },
  { name: 'Malicious Bot', code: 'BOT', severity: 'LOW' },
];

const LOCATIONS = ['US-East', 'EU-West', 'CN-North', 'RU-West', 'BR-South', 'IN-Central'];

const ThreatFeed: React.FC<Props> = ({ isSecure, active }) => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      const newThreat: Threat = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: type.name,
        sourceIp: ip,
        location,
        severity: type.severity as any,
        status: isSecure ? 'BLOCKED' : 'DETECTED',
      };

      setThreats(prev => [newThreat, ...prev].slice(0, 10));
    }, isSecure ? 2500 : 1500); // More frequent alerts if vulnerable

    return () => clearInterval(interval);
  }, [active, isSecure]);

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col h-[280px]">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-md ${isSecure ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500 animate-pulse'}`}>
             {isSecure ? <ShieldCheck size={16} /> : <Siren size={16} />}
           </div>
           <h3 className="text-sm font-semibold text-slate-200">Live Threat Feed</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Critical</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> High</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar relative">
        <AnimatePresence initial={false}>
            {threats.length === 0 && active && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 space-y-2">
                    <Globe className="animate-pulse opacity-20" size={32} />
                    <span className="text-xs">Scanning incoming traffic...</span>
                </div>
            )}
            {threats.map((threat) => (
                <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative overflow-hidden rounded-md border p-3 flex items-center justify-between gap-3 ${
                        threat.status === 'DETECTED' 
                        ? 'bg-red-950/20 border-red-500/30 hover:bg-red-900/30' 
                        : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'
                    }`}
                >
                    {/* Status Bar Indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${threat.status === 'DETECTED' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    
                    <div className="flex items-center gap-3 pl-2">
                        <div className={`p-2 rounded-lg ${threat.status === 'DETECTED' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {threat.status === 'DETECTED' ? <AlertOctagon size={18} /> : <Ban size={18} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${threat.status === 'DETECTED' ? 'text-red-300' : 'text-slate-200'}`}>
                                    {threat.type}
                                </span>
                                {threat.status === 'DETECTED' && (
                                    <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                        Detected
                                    </span>
                                )}
                                {threat.status === 'BLOCKED' && (
                                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                        Blocked
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                                <span className="flex items-center gap-1"><Globe size={10}/> {threat.sourceIp}</span>
                                <span>{threat.location}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <span className="text-[10px] text-slate-600 font-mono block">{threat.timestamp}</span>
                        <span className={`text-[10px] font-bold ${
                            threat.severity === 'CRITICAL' ? 'text-red-500' : 
                            threat.severity === 'HIGH' ? 'text-amber-500' : 'text-blue-400'
                        }`}>
                            {threat.severity}
                        </span>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThreatFeed;