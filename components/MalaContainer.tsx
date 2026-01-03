
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { BEADS_PER_MALA } from '../constants';
import { JaapSession } from '../types';

interface MalaContainerProps {
  chantName: string;
  transliteration?: string;
  onChant: () => void;
  onMalaComplete?: () => void;
  history: JaapSession[];
}

const MalaContainer: React.FC<MalaContainerProps> = ({ 
  chantName, 
  transliteration, 
  onChant,
  onMalaComplete,
  history
}) => {
  const [beadIndex, setBeadIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Dragging logic state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef<number>(0);
  const lastOffsetRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const isMoveSignificant = useRef<boolean>(false);

  const todayTotalForChant = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    return history
      .filter(s => s.chantName === chantName && new Date(s.timestamp).toLocaleDateString() === todayStr)
      .reduce((sum, s) => sum + s.totalCounts, 0);
  }, [history, chantName]);

  const totalMalasToday = useMemo(() => {
    return (todayTotalForChant / BEADS_PER_MALA).toFixed(1);
  }, [todayTotalForChant]);

  const handleBeadClick = useCallback(() => {
    if (isMoveSignificant.current) return;
    
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 150);
    onChant();
    setBeadIndex(prev => {
      const next = prev + 1;
      if (next >= BEADS_PER_MALA) {
        if (onMalaComplete) onMalaComplete();
        return 0;
      }
      return next;
    });
  }, [onChant, onMalaComplete]);

  const getAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const angle = getAngle(e.clientX, e.clientY);
    startAngleRef.current = angle;
    lastOffsetRef.current = dragOffset;
    setIsDragging(true);
    isMoveSignificant.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getAngle(e.clientX, e.clientY);
    const delta = currentAngle - startAngleRef.current;
    
    if (Math.abs(delta) > 2) {
      isMoveSignificant.current = true;
    }
    
    setDragOffset(lastOffsetRef.current + delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const interval = setInterval(() => {
      setDragOffset(prev => {
        if (Math.abs(prev) < 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev * 0.8;
      });
    }, 16);
  };

  const renderBeads = () => {
    const beads = [];
    const radius = 130;
    const center = 160;
    for (let i = 0; i < BEADS_PER_MALA; i++) {
      // Placing beads relative to 0 degrees
      const angle = (i * (360 / BEADS_PER_MALA)) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const isActive = i === beadIndex;
      const isCompleted = i < beadIndex;
      let beadColor = isActive ? '#78350f' : (isCompleted ? '#92400e' : '#f5f5f4');
      let strokeColor = isActive ? '#b45309' : (isCompleted ? '#78350f' : '#e7e5e4');

      beads.push(
        <g key={i} onClick={(e) => { e.stopPropagation(); handleBeadClick(); }} className="cursor-pointer">
          <circle
            cx={x} cy={y} r={isActive ? 8.5 : 4.5}
            fill={beadColor} stroke={strokeColor} strokeWidth={isActive ? 2 : 0.5}
            className={`transition-all duration-300 ${isActive ? 'animate-target-pulse' : ''}`}
            style={isActive ? { transformBox: 'fill-box', transformOrigin: 'center' } : {}}
          />
        </g>
      );
    }
    return beads;
  };

  // Rotating the wheel to keep the current beadIndex at the 12 o'clock position
  // Base 0 index is at 3 o'clock, so we subtract 90 degrees to move it to 12 o'clock.
  const baseRotation = -beadIndex * (360 / BEADS_PER_MALA);
  const totalRotation = baseRotation + dragOffset - 90;

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4 px-4 overflow-hidden bg-transparent space-y-2 touch-none">
      <style>{`
        @keyframes target-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-target-pulse { animation: target-pulse 2s infinite ease-in-out; }
      `}</style>
      
      {/* Chant Name Display - Topmost */}
      <div className="w-full text-center px-4 animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl font-black text-[#78350f] font-devotional tracking-tight drop-shadow-sm truncate">
          {chantName}
        </h2>
        {transliteration && (
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black opacity-80 mt-1 truncate">
            {transliteration}
          </p>
        )}
      </div>
      
      {/* Mala Wheel Section */}
      <div className="relative w-80 h-80 flex items-center justify-center shrink-0 z-20 mt-2">
        {/* Glow indicator for the active zone at the top (12 o'clock) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-500/10 blur-xl rounded-full z-10 pointer-events-none" />
        
        <svg 
          ref={svgRef}
          viewBox="0 0 320 320" 
          className={`w-full h-full transform transition-transform select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            transform: `rotate(${totalRotation}deg)`,
            transitionTimingFunction: isDragging ? 'linear' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDuration: isDragging ? '0ms' : '600ms'
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <circle cx="160" cy="160" r="130" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 4" className="opacity-30" />
          {renderBeads()}
        </svg>

        <button 
          onClick={handleBeadClick}
          className={`absolute inset-0 m-auto w-44 h-44 rounded-full flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm border-4 border-[#78350f]/10 shadow-2xl transition-all duration-200 active:scale-90 z-20 pointer-events-auto ${isPulsing ? 'ring-4 ring-amber-100 bg-slate-50 border-[#78350f]/30' : ''}`}
        >
          <span className="text-5xl font-black text-[#451a03] font-devotional select-none leading-none">{beadIndex}</span>
          <span className="text-[10px] uppercase tracking-widest text-[#78350f] font-black opacity-60 select-none mt-1">Counts</span>
        </button>
      </div>

      {/* Stats Section - Streamlined and centered */}
      <div className="w-full text-center space-y-3 z-20 mt-0 select-none">
        <div className="inline-block w-full max-w-[19rem] px-6 py-4 rounded-[2.5rem] bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
             <span className="text-4xl font-black text-slate-900 leading-none">{totalMalasToday}</span>
             <span className="text-[11px] text-slate-500 uppercase tracking-widest font-black leading-none">Malas Today</span>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 mt-4 pt-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Total Jaap</p>
              <p className="text-2xl font-black text-slate-800 leading-none mt-1">{todayTotalForChant}</p>
            </div>
            <div className="text-center border-l border-slate-50">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Mala Progress</p>
              <p className="text-2xl font-black text-slate-800 leading-none mt-1">{beadIndex}/108</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-2 select-none flex-1 flex items-end">
        <p className="text-[11px] text-slate-300 italic font-serene px-8 text-center font-black opacity-60 z-20">
          "The beads move, the mind stays still."
        </p>
      </div>
    </div>
  );
};

export default MalaContainer;
