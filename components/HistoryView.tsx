
import React, { useMemo, useState } from 'react';
import { JaapSession, GoalConfig, GoalType, StatsRange } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HistoryViewProps {
  history: JaapSession[];
  onClear: () => void;
  goal: GoalConfig;
}

const CircularProgress: React.FC<{ progress: number; current: number; label: string; isActive: boolean }> = ({ progress, current, label, isActive }) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, progress);
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-[2.5rem] border transition-all w-full bg-white border-slate-100 shadow-sm ring-1 ring-slate-50`}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="#f1f5f9" strokeWidth={strokeWidth} fill="transparent" />
          <circle
            cx={size/2} cy={size/2} r={radius} 
            stroke="url(#progGradMain)" 
            strokeWidth={strokeWidth}
            strokeDasharray={circumference} 
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            strokeLinecap="round" fill="transparent"
          />
          <defs>
            <linearGradient id="progGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black leading-none text-slate-900">{Math.round(progress)}%</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Goal</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">{label} PROGRESS</p>
        <p className="text-xl font-black text-slate-900 mt-1">{current.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Jaaps</span></p>
      </div>
    </div>
  );
};

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClear, goal }) => {
  const [range, setRange] = useState<StatsRange>(StatsRange.DAILY);

  const calculateTotalForPeriod = (type: string) => {
    const now = new Date();
    let total = 0;
    
    if (type === 'daily') {
      const todayStr = now.toLocaleDateString();
      total = history.filter(s => new Date(s.timestamp).toLocaleDateString() === todayStr).reduce((sum, s) => sum + s.totalCounts, 0);
    } else if (type === 'weekly') {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      total = history.filter(s => s.timestamp >= startOfWeek.getTime()).reduce((sum, s) => sum + s.totalCounts, 0);
    } else if (type === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      total = history.filter(s => s.timestamp >= startOfMonth.getTime()).reduce((sum, s) => sum + s.totalCounts, 0);
    } else if (type === 'yearly') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      total = history.filter(s => s.timestamp >= startOfYear.getTime()).reduce((sum, s) => sum + s.totalCounts, 0);
    }
    return total;
  };

  const currentActiveMetric = useMemo(() => {
    const currentCount = calculateTotalForPeriod(range);
    
    // Scale target based on the selected frequency relative to the user's set goal
    const gVal = goal.value || 108;
    const targets = {
      daily: goal.type === GoalType.DAILY ? gVal : gVal,
      weekly: goal.type === GoalType.WEEKLY ? gVal : gVal * 7,
      monthly: goal.type === GoalType.MONTHLY ? gVal : gVal * 30,
      yearly: goal.type === GoalType.YEARLY ? gVal : gVal * 365,
    };

    const target = targets[range as keyof typeof targets];
    return {
      current: currentCount,
      target: target,
      progress: target > 0 ? (currentCount / target) * 100 : 0
    };
  }, [history, goal, range]);

  const rangeData = useMemo(() => {
    const aggregated: { label: string; count: number }[] = [];
    const now = new Date();

    if (range === StatsRange.DAILY) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        aggregated.push({ label: key, count: 0 });
      }
      history.forEach(s => {
        const date = new Date(s.timestamp);
        const key = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const entry = aggregated.find(a => a.label === key);
        if (entry) entry.count += s.totalCounts;
      });
    } else if (range === StatsRange.WEEKLY) {
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      weekDays.forEach(day => aggregated.push({ label: day, count: 0 }));

      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      history.forEach(s => {
        if (s.timestamp >= startOfWeek.getTime() && s.timestamp <= endOfWeek.getTime()) {
          const date = new Date(s.timestamp);
          const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
          aggregated[dayIdx].count += s.totalCounts;
        }
      });
    } else if (range === StatsRange.MONTHLY) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(m => aggregated.push({ label: m, count: 0 }));

      const currentYear = now.getFullYear();
      history.forEach(s => {
        const date = new Date(s.timestamp);
        if (date.getFullYear() === currentYear) {
          const monthIdx = date.getMonth();
          aggregated[monthIdx].count += s.totalCounts;
        }
      });
    } else if (range === StatsRange.YEARLY) {
      const currentYear = now.getFullYear();
      for (let y = currentYear - 2; y <= currentYear + 2; y++) {
        aggregated.push({ label: y.toString(), count: 0 });
      }

      history.forEach(s => {
        const date = new Date(s.timestamp);
        const year = date.getFullYear();
        const entry = aggregated.find(a => a.label === year.toString());
        if (entry) entry.count += s.totalCounts;
      });
    }

    return aggregated;
  }, [history, range]);

  const totalJaaps = history.reduce((acc, curr) => acc + curr.totalCounts, 0);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-8 border-2 border-amber-100/50 animate-pulse shadow-inner">
          <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-devotional font-black tracking-widest text-slate-400">YOUR JOURNEY AWAITS</h3>
        <p className="text-xs uppercase font-black tracking-[0.2em] text-slate-300 mt-4 max-w-[240px] leading-relaxed">Each recorded session adds a petal to your spiritual growth.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-hidden bg-[#fafafa]">
      {/* Range Selector */}
      <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shrink-0">
        {Object.values(StatsRange).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${
              range === r ? 'bg-white text-amber-700 shadow-sm ring-1 ring-slate-100' : 'text-slate-400'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Main Focus Indicator */}
      <section className="shrink-0 flex justify-center">
        <CircularProgress 
          progress={currentActiveMetric.progress} 
          current={currentActiveMetric.current} 
          label={range} 
          isActive={true}
        />
      </section>

      {/* Activity Bar Chart Card */}
      <section className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm flex flex-col shrink-0 min-h-[160px] ring-1 ring-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{range} TREND</h4>
          <span className="text-[10px] font-black text-amber-700 tabular-nums">Lifetime: {totalJaaps.toLocaleString()}</span>
        </div>
        <div className="flex-1 w-full min-h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rangeData}>
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} 
              />
              <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                {rangeData.map((e, i) => (
                  <Cell key={i} fill={e.count > 0 ? '#78350f' : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Records History List */}
      <section className="flex-1 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm ring-1 ring-slate-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/50">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SESSIONS</h4>
          <button 
            onClick={onClear} 
            className="text-[8px] text-red-500 font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-50 transition-all active:scale-95"
          >
            RESET
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-2">
          {history.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-50 hover:border-amber-100 transition-all group active:scale-[0.98]">
              <div className="min-w-0 pr-4">
                <p className="text-sm font-black text-[#78350f] truncate font-devotional tracking-wide group-hover:text-amber-800 transition-colors">{s.chantName}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tabular-nums tracking-tight">
                  {new Date(s.timestamp).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-black text-slate-900 tabular-nums leading-none">{s.totalCounts.toLocaleString()}</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter mt-1">JAAPS</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoryView;
