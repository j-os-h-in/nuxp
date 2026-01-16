import React, { useState, useEffect } from 'react';
import { ACHIEVEMENTS } from './constants';
import { AchievementIcon } from './components/AchievementIcon';
import { AchievementModal } from './components/AchievementModal';
import { StatsDashboard } from './components/StatsDashboard';
import { UserProgress, Achievement } from './types';
import { MinecraftButton } from './components/MinecraftButton';
import { getPersonalizedTip } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [progress, setProgress] = useState<UserProgress>({ unlockedIds: ['nus_start'], totalXp: 0 });
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [tip, setTip] = useState<string>("Loading tip...");
  const [scale, setScale] = useState(1);
  
  // Load initial tip
  useEffect(() => {
    getPersonalizedTip(progress.unlockedIds.length).then(setTip);
  }, [progress.unlockedIds.length]);

  const handleUnlock = (id: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    if (!progress.unlockedIds.includes(id)) {
        // Only allow unlocking if parent is unlocked (unless it's root)
        if (achievement.parentId && !progress.unlockedIds.includes(achievement.parentId)) {
            alert("You must complete the previous achievement first!");
            return;
        }

        setProgress(prev => ({
            unlockedIds: [...prev.unlockedIds, id],
            totalXp: prev.totalXp + achievement.xp
        }));
        // Play sound effect could go here
    }
    setSelectedAchievement(null);
  };

  // Helper to layout tree
  // We will simply group by branches for this visual layout
  // Root -> Level 1 -> Level 2
  const renderTreeNodes = () => {
      // Create layers based on depth
      const getDepth = (id: string, depth = 0): number => {
          const item = ACHIEVEMENTS.find(a => a.id === id);
          if (!item || !item.parentId) return depth;
          return getDepth(item.parentId, depth + 1);
      };

      const nodesWithDepth = ACHIEVEMENTS.map(a => ({ ...a, depth: getDepth(a.id) }));
      const maxDepth = Math.max(...nodesWithDepth.map(n => n.depth));
      
      const columns = [];
      for(let i=0; i<=maxDepth; i++) {
          columns.push(nodesWithDepth.filter(n => n.depth === i));
      }

      return (
          <div className="flex flex-row items-center gap-24 p-20 min-w-max">
            {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-12 relative">
                    {col.map((ach) => {
                         const isUnlocked = progress.unlockedIds.includes(ach.id);
                         const isParentUnlocked = ach.parentId ? progress.unlockedIds.includes(ach.parentId) : true;
                         const canSee = isUnlocked || isParentUnlocked;
                         
                         return (
                            <div key={ach.id} className="relative group">
                                {/* Connector Line (Backward looking) */}
                                {ach.parentId && (
                                    <div className="absolute top-1/2 -left-24 w-24 h-2 bg-[#373737] -z-10 transform -translate-y-1/2 border-y-2 border-black" />
                                )}

                                <div 
                                    className={`transition-all duration-200 ${canSee ? 'opacity-100 cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'}`}
                                    onClick={() => canSee && setSelectedAchievement(ach)}
                                >
                                    <AchievementIcon 
                                        iconName={ach.iconName} 
                                        type={ach.type} 
                                        unlocked={isUnlocked} 
                                        size={32}
                                    />
                                    {/* Tooltip Label */}
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-white">
                                        {ach.title}
                                    </div>
                                </div>
                            </div>
                         )
                    })}
                </div>
            ))}
          </div>
      )
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#252525] relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-stone opacity-20 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 bg-mc-panel border-b-4 border-black p-4 flex justify-between items-center shadow-lg">
        <div>
            <h1 className="text-4xl text-[#373737] drop-shadow-md">NUS Achievements</h1>
            <p className="text-[#555] text-lg mt-1 flex items-center gap-2">
                <span className="text-mc-green animate-pulse">●</span> {tip}
            </p>
        </div>
        <div className="flex gap-4">
             <div className="text-right hidden md:block">
                 <p className="text-sm text-gray-600">Current Session</p>
                 <p className="text-xl text-[#373737]">Year 1, Sem 1</p>
             </div>
             <MinecraftButton onClick={() => window.open('https://nus.edu.sg', '_blank')}>
                NUS HOME
             </MinecraftButton>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Sidebar */}
        <aside className="w-80 p-4 hidden lg:block z-20">
           <StatsDashboard progress={progress} />
        </aside>

        {/* Canvas (Scrollable Tree) */}
        <main className="flex-1 overflow-auto bg-black/20 relative cursor-grab active:cursor-grabbing bg-dirt bg-repeat shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className="min-h-full min-w-full flex items-center justify-center origin-top-left" style={{ transform: `scale(${scale})` }}>
                {renderTreeNodes()}
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                <MinecraftButton onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-10 h-10 flex items-center justify-center">-</MinecraftButton>
                <MinecraftButton onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="w-10 h-10 flex items-center justify-center">+</MinecraftButton>
            </div>
        </main>

      </div>

      {/* Modals */}
      {selectedAchievement && (
        <AchievementModal 
            achievement={selectedAchievement} 
            onClose={() => setSelectedAchievement(null)} 
            unlocked={progress.unlockedIds.includes(selectedAchievement.id)}
            onUnlock={handleUnlock}
        />
      )}
    </div>
  );
};

export default App;
