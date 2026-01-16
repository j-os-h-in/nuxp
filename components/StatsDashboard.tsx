import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProgress, Category } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface Props {
  progress: UserProgress;
}

export const StatsDashboard: React.FC<Props> = ({ progress }) => {
  
  // Calculate stats by category
  const data = Object.values(Category).map(cat => {
    const totalInCat = ACHIEVEMENTS.filter(a => a.category === cat).length;
    const unlockedInCat = ACHIEVEMENTS.filter(a => a.category === cat && progress.unlockedIds.includes(a.id)).length;
    return {
      name: cat,
      value: unlockedInCat,
      total: totalInCat
    };
  }).filter(d => d.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const level = Math.floor(progress.totalXp / 100) + 1;

  return (
    <div className="bg-mc-panel border-4 border-black p-4 h-full flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
      <h3 className="text-2xl text-[#373737] border-b-2 border-[#8B8B8B] mb-4 pb-2">Student Profile</h3>
      
      <div className="flex items-center mb-6 bg-[#8B8B8B] p-2 border-2 border-black shadow-inner">
         <div className="bg-mc-green w-12 h-12 flex items-center justify-center border-2 border-white text-white text-xl">
            {level}
         </div>
         <div className="ml-4 flex-1">
            <div className="flex justify-between text-white text-sm mb-1">
                <span>Level {level}</span>
                <span>{progress.totalXp} XP</span>
            </div>
            <div className="w-full bg-[#373737] h-4 border border-white relative">
                <div 
                    className="bg-mc-green h-full absolute left-0 top-0" 
                    style={{ width: `${(progress.totalXp % 100)}%` }}
                ></div>
            </div>
         </div>
      </div>

      <div className="flex-1 min-h-[200px] relative bg-[#E6E6E6] border-2 border-white shadow-inner p-2">
         <h4 className="text-[#373737] text-center mb-2">Completion Breakdown</h4>
         {data.length === 0 ? (
             <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
                 Start unlocking achievements to see stats!
             </div>
         ) : (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="black" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#252525', border: '2px solid white', fontFamily: 'VT323', color: 'white' }}
                        itemStyle={{ color: 'white' }}
                    />
                </PieChart>
            </ResponsiveContainer>
         )}
      </div>
      
      <div className="mt-4 text-center text-[#555] text-sm">
        {progress.unlockedIds.length} / {ACHIEVEMENTS.length} Achievements
      </div>
    </div>
  );
};
