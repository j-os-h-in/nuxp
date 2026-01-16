import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Achievement, AchievementType } from '../types';
import { MinecraftButton } from './MinecraftButton';
import { getAchievementLore } from '../services/geminiService';

interface Props {
  achievement: Achievement;
  onClose: () => void;
  unlocked: boolean;
  onUnlock: (id: string) => void;
}

export const AchievementModal: React.FC<Props> = ({ achievement, onClose, unlocked, onUnlock }) => {
  const [lore, setLore] = useState<string>('Deciphering ancient texts...');
  const [isLoadingLore, setIsLoadingLore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLore = async () => {
      setIsLoadingLore(true);
      const text = await getAchievementLore(achievement);
      if (isMounted) {
        setLore(text);
        setIsLoadingLore(false);
      }
    };
    fetchLore();
    return () => { isMounted = false; };
  }, [achievement]);

  const frameTitle = achievement.type === AchievementType.CHALLENGE ? 'Challenge Complete!' : 'Advancement Made!';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#C6C6C6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-1">
        
        {/* Header */}
        <div className="bg-[#373737] p-2 flex justify-between items-center text-white mb-2 border-b-4 border-[#8B8B8B]">
          <span className="text-xl text-mc-yellow drop-shadow-md">{unlocked ? frameTitle : 'LOCKED'}</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-[#373737]">
          
          <div className="flex items-start gap-4">
            <div className={`p-4 border-4 border-black ${unlocked ? 'bg-mc-green' : 'bg-[#555]'}`}>
               {/* Just a placeholder block color for the modal representation */}
               <div className="w-12 h-12 flex items-center justify-center text-white text-3xl font-bold">
                 ?
               </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-1 leading-none">{achievement.title}</h2>
              <p className="text-lg italic mb-2">{achievement.description}</p>
              
              <div className="bg-[#8B8B8B] p-3 border-2 border-[#555] text-white text-sm font-mono mb-4 shadow-inner">
                {isLoadingLore ? (
                  <span className="animate-pulse">Loading lore from the server...</span>
                ) : (
                  <span className="text-mc-yellow">"{lore}"</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#8B8B8B] my-2"></div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[#E6E6E6] p-2 border-2 border-white shadow-inner">
              <p className="text-xs uppercase tracking-widest text-gray-500">Rarity</p>
              <p className="text-xl text-blue-800">{achievement.globalCompletionRate}% of students</p>
            </div>
            <div className="bg-[#E6E6E6] p-2 border-2 border-white shadow-inner">
              <p className="text-xs uppercase tracking-widest text-gray-500">Reward</p>
              <p className="text-xl text-green-700">+{achievement.xp} XP</p>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2">
            {!unlocked ? (
              <MinecraftButton onClick={() => onUnlock(achievement.id)}>
                COMPLETE ACHIEVEMENT
              </MinecraftButton>
            ) : (
              <div className="flex items-center text-mc-darkGreen font-bold text-xl">
                <span className="mr-2">✓ COMPLETED</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
