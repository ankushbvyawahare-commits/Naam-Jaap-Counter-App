
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppTab, JaapSession, ChantPreset, Language, GoalType, GoalConfig } from './types';
import { LANGUAGES, CHANTS_BY_LANGUAGE, STORAGE_KEY, STORAGE_SETTINGS_KEY } from './constants';
import Header from './components/Header';
import MalaContainer from './components/MalaContainer';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import Navigation from './components/Navigation';
import { PeacockCelebration } from './components/PeacockCelebration';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MALA);
  const [history, setHistory] = useState<JaapSession[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [currentChant, setCurrentChant] = useState<ChantPreset>(CHANTS_BY_LANGUAGE[LANGUAGES[0].id][0]);
  const [customChant, setCustomChant] = useState({ name: '', nativeName: '' });
  const [goal, setGoal] = useState<GoalConfig>({ type: GoalType.DAILY, value: 1000 });

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch (e) { console.error(e); }
    }
    const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const lang = LANGUAGES.find(l => l.id === settings.languageId) || LANGUAGES[0];
        setSelectedLanguage(lang);
        const chants = CHANTS_BY_LANGUAGE[lang.id] || [];
        const chant = chants.find(c => c.id === settings.chantId) || chants[0];
        if (chant) setCurrentChant(chant);
        if (settings.customChant) setCustomChant(settings.customChant);
        if (settings.goal) setGoal(settings.goal);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify({
      languageId: selectedLanguage.id,
      chantId: currentChant.id,
      customChant,
      goal
    }));
  }, [selectedLanguage, currentChant, customChant, goal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const calculateCurrentProgress = useCallback((type: GoalType) => {
    const now = new Date();
    let total = 0;
    if (type === GoalType.DAILY) {
      const todayStr = now.toLocaleDateString();
      total = history.filter(s => new Date(s.timestamp).toLocaleDateString() === todayStr).reduce((sum, s) => sum + s.totalCounts, 0);
    } else if (type === GoalType.WEEKLY) {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      total = history.filter(s => s.timestamp >= startOfWeek.getTime()).reduce((sum, s) => sum + s.totalCounts, 0);
    }
    return total;
  }, [history]);

  const handleChant = useCallback(() => {
    const now = Date.now();
    const chantName = currentChant.id === 'custom' 
      ? (customChant.nativeName || customChant.name || 'Custom') 
      : currentChant.nativeName;

    setHistory(prev => {
      const lastSession = prev[0];
      const SESSION_TIMEOUT = 5 * 60 * 1000;
      
      if (lastSession && lastSession.chantName === chantName && (now - lastSession.timestamp) < SESSION_TIMEOUT) {
        return [{ ...lastSession, totalCounts: lastSession.totalCounts + 1, totalMalas: (lastSession.totalCounts + 1) / 108, timestamp: now }, ...prev.slice(1)];
      } else {
        return [{ id: crypto.randomUUID(), timestamp: now, chantName, totalCounts: 1, totalMalas: 1 / 108, durationSeconds: 1 }, ...prev];
      }
    });
  }, [currentChant, customChant]);

  const clearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all historical records?")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.MALA:
        return (
          <MalaContainer 
            chantName={currentChant.id === 'custom' ? (customChant.nativeName || customChant.name || 'Custom') : currentChant.nativeName} 
            transliteration={currentChant.id === 'custom' ? customChant.name : currentChant.name}
            onChant={handleChant}
            onMalaComplete={triggerCelebration}
            history={history}
          />
        );
      case AppTab.HISTORY:
        return <HistoryView history={history} onClear={clearHistory} goal={goal} />;
      case AppTab.SETTINGS:
        return (
          <SettingsView 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={(lang) => {
              setSelectedLanguage(lang);
              const available = CHANTS_BY_LANGUAGE[lang.id] || [];
              setCurrentChant(available[0] || { id: 'custom', name: 'Custom', nativeName: 'Custom', color: 'slate' });
            }}
            currentChant={currentChant} 
            setCurrentChant={setCurrentChant}
            customChant={customChant}
            setCustomChant={setCustomChant}
            goal={goal}
            setGoal={setGoal}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden bg-white border-x border-slate-100">
      {showCelebration && <PeacockCelebration onComplete={() => setShowCelebration(false)} />}
      <Header activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-transparent">
        {renderContent()}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
