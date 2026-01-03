
import React, { useState, useEffect, useRef } from 'react';
import { LANGUAGES, CHANTS_BY_LANGUAGE } from '../constants';
import { ChantPreset, Language, GoalConfig, GoalType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface SettingsViewProps {
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  currentChant: ChantPreset;
  setCurrentChant: (chant: ChantPreset) => void;
  customChant: { name: string; nativeName: string };
  setCustomChant: (val: { name: string; nativeName: string }) => void;
  goal: GoalConfig;
  setGoal: (goal: GoalConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  selectedLanguage,
  setSelectedLanguage,
  currentChant, 
  setCurrentChant, 
  customChant, 
  setCustomChant,
  goal,
  setGoal
}) => {
  const [isTransliterating, setIsTransliterating] = useState(false);
  const availableChants = CHANTS_BY_LANGUAGE[selectedLanguage.id] || [];
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentChant.id !== 'custom' || !customChant.name.trim()) return;
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(async () => {
      setIsTransliterating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Transliterate the following mantra or devotional text into the native script of ${selectedLanguage.name}: "${customChant.name}". Return ONLY the native script text and nothing else.`,
        });
        const nativeText = response.text?.trim() || customChant.name;
        if (customChant.name) setCustomChant({ ...customChant, nativeName: nativeText });
      } catch (e) { console.error(e); } finally { setIsTransliterating(false); }
    }, 800);
    return () => { if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current); };
  }, [customChant.name, selectedLanguage.id, currentChant.id]);

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
      <section className="shrink-0">
        <h4 className="text-[8px] text-slate-400 uppercase tracking-widest font-black mb-2 px-1">LANGUAGE</h4>
        <div className="grid grid-cols-4 gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang)}
              className={`p-1.5 rounded-lg border transition-all text-center ${
                selectedLanguage.id === lang.id ? 'bg-amber-600 border-amber-700 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-600'
              }`}
            >
              <span className="text-[7px] font-black uppercase block leading-none mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{lang.name}</span>
              <span className="text-[10px] font-devotional font-black leading-none">{lang.nativeName.slice(0,1)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3 shrink-0">
        <div className="flex flex-col gap-3 mb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[8px] text-slate-400 uppercase tracking-widest font-black">SPIRITUAL GOAL</h4>
            <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 overflow-x-auto no-scrollbar">
              {Object.values(GoalType).map((type) => (
                <button 
                  key={type} 
                  onClick={() => setGoal({ ...goal, type })} 
                  className={`px-2 py-0.5 text-[7px] font-black uppercase rounded whitespace-nowrap ${goal.type === type ? 'bg-amber-600 text-white' : 'text-slate-500'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {goal.type !== GoalType.NONE && (
            <div className="flex items-center gap-2">
              <button onClick={() => setGoal({ ...goal, value: Math.max(0, goal.value - 100) })} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-sm active:scale-95 transition-transform">-</button>
              <div className="flex-1 flex flex-col items-center">
                <input 
                  type="number" 
                  value={goal.value} 
                  onChange={(e) => setGoal({ ...goal, value: parseInt(e.target.value) || 0 })} 
                  className="w-full bg-transparent text-center text-xl font-black text-slate-900 border-b border-amber-300 focus:outline-none" 
                />
                <span className="text-[7px] text-slate-400 font-black uppercase mt-1">Target Counts</span>
              </div>
              <button onClick={() => setGoal({ ...goal, value: goal.value + 100 })} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-sm active:scale-95 transition-transform">+</button>
            </div>
          )}
        </div>
      </section>

      <section className="flex-1 flex flex-col min-h-0 min-w-0">
        <h4 className="text-[8px] text-slate-400 uppercase tracking-widest font-black mb-2 px-1">SELECT MANTRA</h4>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-4">
          {availableChants.map((preset) => (
            <button key={preset.id} onClick={() => setCurrentChant(preset)} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all ${currentChant.id === preset.id ? 'bg-amber-600 border-amber-700 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-amber-200'}`}>
              <div className="text-left overflow-hidden pr-2">
                <p className="font-black text-sm font-devotional truncate tracking-wide">{preset.nativeName}</p>
                <p className={`text-[8px] uppercase font-black truncate tracking-widest ${currentChant.id === preset.id ? 'text-amber-100' : 'text-slate-400'}`}>{preset.name}</p>
              </div>
              {currentChant.id === preset.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />}
            </button>
          ))}
          <button onClick={() => setCurrentChant({ id: 'custom', name: 'Custom', nativeName: 'Custom', color: 'slate' })} className={`w-full text-left px-3 py-3 rounded-xl border transition-all ${currentChant.id === 'custom' ? 'bg-amber-700 border-amber-800 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-amber-200'}`}>
            <span className="font-black text-xs italic opacity-80">Add Custom Mantra...</span>
          </button>
          
          {currentChant.id === 'custom' && (
            <div className="pt-2 space-y-3 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center px-1">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">INPUT TEXT</p>
                {isTransliterating && <span className="text-[8px] text-amber-600 font-black animate-pulse tracking-widest">TRANSLATING...</span>}
              </div>
              <input 
                type="text" 
                value={customChant.name} 
                onChange={(e) => setCustomChant({ ...customChant, name: e.target.value })} 
                placeholder="Type in English (e.g. Om Namah Shivaya)" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
              />
              {customChant.nativeName && (
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 shadow-inner">
                  <p className="text-[8px] text-amber-600 font-black uppercase tracking-widest mb-1 opacity-60">NATIVE SCRIPT</p>
                  <p className="text-xl font-devotional text-slate-900 font-black leading-tight">{customChant.nativeName}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
