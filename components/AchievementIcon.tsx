import React from 'react';
import * as Icons from 'lucide-react';
import { AchievementType } from '../types';

interface Props {
  iconName: string;
  type: AchievementType;
  unlocked: boolean;
  size?: number;
}

export const AchievementIcon: React.FC<Props> = ({ iconName, type, unlocked, size = 24 }) => {
  const LucideIcon = (Icons as any)[iconName] || Icons.HelpCircle;
  
  // Frame styles based on type
  let frameColor = unlocked ? 'bg-[#ffc107]' : 'bg-[#555]'; // Default gold
  let borderColor = unlocked ? 'border-[#b68a05]' : 'border-[#333]';

  if (type === AchievementType.CHALLENGE) {
    frameColor = unlocked ? 'bg-[#a020f0]' : 'bg-[#4a0e6e]'; // Purple for challenge
    borderColor = unlocked ? 'border-[#69149e]' : 'border-[#29083d]';
  } else if (type === AchievementType.ROOT) {
    frameColor = unlocked ? 'bg-[#5D8D42]' : 'bg-[#2f4721]'; // Green for root
    borderColor = unlocked ? 'border-[#365226]' : 'border-[#1a2912]';
  }

  // Minecraft Icon Frame Shape
  return (
    <div className={`
      relative flex items-center justify-center
      w-16 h-16
      ${frameColor}
      border-4 ${borderColor}
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
      transition-all duration-300
      ${unlocked ? 'grayscale-0' : 'grayscale brightness-75'}
      hover:scale-105
    `}>
      {/* Inner Bevel */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-white/30 pointer-events-none"></div>
      <div className="absolute inset-0 border-b-2 border-r-2 border-black/30 pointer-events-none"></div>
      
      <LucideIcon size={size} className="text-white drop-shadow-md" strokeWidth={2.5} />
    </div>
  );
};
