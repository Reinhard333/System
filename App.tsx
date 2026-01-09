
import React, { useState, useEffect } from 'react';
import { Section, Task, UserState } from './types';
import HomeView from './components/HomeView';
import TasksView from './components/TasksView';
import StreaksView from './components/StreaksView';
import TimelineView from './components/TimelineView';
import XPView from './components/XPView';
import Navigation from './components/Navigation';

const INITIAL_TASKS: Task[] = [
  { id: 'exercise', label: 'Exercise', completed: false },
  { id: 'editing', label: 'Editing', completed: false },
  { id: 'study', label: 'Study', completed: false },
  { id: 'homework', label: 'Homeworks', completed: false },
  { id: 'skill', label: 'Special Skill', completed: false },
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('HOME');
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('aether_os_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.lastLoginDate !== today) {
        return {
          ...parsed,
          tasks: INITIAL_TASKS,
          lastLoginDate: today
        };
      }
      return parsed;
    }
    return {
      tasks: INITIAL_TASKS,
      streak: 0,
      xp: 0,
      lastLoginDate: new Date().toDateString()
    };
  });

  useEffect(() => {
    localStorage.setItem('aether_os_state', JSON.stringify(userState));
  }, [userState]);

  const toggleTask = (id: string) => {
    setUserState(prev => {
      const newTasks = prev.tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      
      const wasAllDone = prev.tasks.every(t => t.completed);
      const isNowAllDone = newTasks.every(t => t.completed);
      
      let newXP = prev.xp;
      let newStreak = prev.streak;

      const task = prev.tasks.find(t => t.id === id);
      if (task && !task.completed) {
        newXP += 20;
      }

      if (isNowAllDone && !wasAllDone) {
        newXP += 150;
        newStreak += 1;
      }

      return {
        ...prev,
        tasks: newTasks,
        xp: newXP,
        streak: newStreak
      };
    });
  };

  const renderView = () => {
    switch (activeSection) {
      case 'HOME': return <HomeView />;
      case 'TASKS': return <TasksView tasks={userState.tasks} onToggle={toggleTask} />;
      case 'STREAKS': return <StreaksView streak={userState.streak} tasks={userState.tasks} />;
      case 'TIMELINE': return <TimelineView />;
      case 'XP': return <XPView xp={userState.xp} />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0514] flex flex-col items-center pb-32">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 w-full max-w-4xl px-6 py-12 flex flex-col items-center relative z-10">
        <div key={activeSection} className="animate-view w-full h-full flex flex-col items-center">
          {renderView()}
        </div>
      </main>

      <Navigation active={activeSection} onNavChange={setActiveSection} />
    </div>
  );
};

export default App;
