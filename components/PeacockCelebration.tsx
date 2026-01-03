
import React, { useEffect, useState } from 'react';

interface Feather {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  swing: number;
}

const PeacockFeatherSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featherGradient" x1="50" y1="5" x2="50" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="0.5" stopColor="#047857" />
        <stop offset="1" stopColor="#064e3b" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="eyeOuter" cx="50" cy="45" r="20" fx="50" fy="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="60%" stopColor="#065f46" />
        <stop offset="100%" stopColor="#064e3b" />
      </radialGradient>
    </defs>
    
    {/* Quill */}
    <path d="M50 145C50 145 48 100 50 10" stroke="#4a3721" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    
    {/* Vane/Feather Body */}
    <path d="M50 125C20 100 5 70 10 40C15 10 50 5 50 5C50 5 85 10 90 40C95 70 80 100 50 125Z" fill="url(#featherGradient)" opacity="0.7" />
    
    {/* The "Eye" of the feather */}
    <ellipse cx="50" cy="45" rx="18" ry="22" fill="url(#eyeOuter)" opacity="0.9" />
    <ellipse cx="50" cy="45" rx="11" ry="15" fill="#1e3a8a" />
    <ellipse cx="50" cy="45" rx="6" ry="8" fill="#6366f1" />
    <circle cx="53" cy="41" r="2.5" fill="white" opacity="0.5" />
  </svg>
);

export const PeacockCelebration: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [feathers, setFeathers] = useState<Feather[]>([]);

  useEffect(() => {
    const newFeathers = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of width
      delay: Math.random() * 2.5,
      duration: 6 + Math.random() * 5,
      rotation: Math.random() * 80 - 40,
      scale: 0.5 + Math.random() * 1.2,
      swing: Math.random() * 100 - 50, // horizontal drift
    }));
    setFeathers(newFeathers);

    const timer = setTimeout(() => {
      onComplete();
    }, 12000); // Wait for the longest animation to finish

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      <style>{`
        @keyframes divine-ascend {
          0% {
            transform: translateY(110vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(40vh) rotate(var(--rotation)) translateX(var(--swing));
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20vh) rotate(calc(var(--rotation) * 1.5)) translateX(calc(var(--swing) * -1.5));
            opacity: 0;
          }
        }
        .animate-divine-ascend {
          animation: divine-ascend var(--duration) ease-in-out var(--delay) forwards;
        }
      `}</style>
      {feathers.map((f) => (
        <div
          key={f.id}
          className="absolute bottom-0 animate-divine-ascend"
          style={{
            left: `${f.x}%`,
            '--delay': `${f.delay}s`,
            '--duration': `${f.duration}s`,
            '--rotation': `${f.rotation}deg`,
            '--swing': `${f.swing}px`,
            width: `${f.scale * 100}px`,
          } as React.CSSProperties}
        >
          <PeacockFeatherSVG className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
        </div>
      ))}
    </div>
  );
};
