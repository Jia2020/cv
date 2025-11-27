import React, { useState } from 'react';
import { SkillSet, Theme } from '../types';

interface ParticleSkillsProps {
  skills: SkillSet;
  theme: Theme;
}

interface SkillBarProps {
  name: string;
  level: string; // "Fluent" or similar if text
  percentage: number;
  theme: Theme;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, percentage, theme }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="mb-4 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between text-sm mb-1 font-bold font-mono">
        <span className={`text-${theme}-500 group-hover:text-${theme}-300 transition-colors`}>
            {'>'} {name}
        </span>
        <span className="opacity-80">
            {hovered ? `${percentage}%` : level} <span className="animate-pulse">_</span>
        </span>
      </div>
      
      {/* Bar Container */}
      <div className={`h-6 w-full bg-${theme}-900/20 border border-${theme}-500/50 p-[2px] relative overflow-hidden`}>
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: `linear-gradient(90deg, transparent 50%, rgba(100, 100, 100, 0.3) 50%)`, backgroundSize: '10px 100%' }}>
         </div>

         {/* The Fill Bar */}
         <div 
            className={`h-full bg-${theme}-500 transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
            style={{ width: hovered ? `${percentage}%` : '0%' }}
         >
            {/* Striped Texture on the bar */}
             <div className="absolute inset-0 w-full h-full" 
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)' }}>
             </div>
         </div>
      </div>
    </div>
  );
};

const ParticleSkills: React.FC<ParticleSkillsProps> = ({ skills, theme }) => {
  // Mapping of specific percentages
  const skillValues: Record<string, number> = {
    "english": 85,
    "french": 90,
    "chinese": 90,
    "python": 80,
    "n8n": 80,
    "supabase": 85,
    "postgresql": 70,
    "acceo": 90
  };

  // Helper to normalize data
  const parseSkill = (str: string, defaultVal: number) => {
      const match = str.match(/(.*?)\((.*?)\)/);
      let name = str;
      let level = "PROFICIENT";

      if (match) {
        name = match[1].trim();
        level = match[2].trim();
      }

      // Check map first (case insensitive), then default
      const lowerName = name.toLowerCase();
      const percentage = skillValues[lowerName] || defaultVal;

      return { name, level, percentage };
  };

  const languages = skills.languages.map(s => parseSkill(s, 85));
  const technical = skills.technical.map(s => parseSkill(s, 75));

  return (
    <div className="w-full">
        <div className="mb-6">
            <h4 className={`text-sm bg-${theme}-500 text-black px-1 inline-block font-bold mb-3`}>LANGUAGES</h4>
            {languages.map((s, i) => (
                <SkillBar key={i} {...s} theme={theme} />
            ))}
        </div>

        <div>
            <h4 className={`text-sm bg-${theme}-500 text-black px-1 inline-block font-bold mb-3`}>TECHNICAL STACK</h4>
            {technical.map((s, i) => (
                <SkillBar key={i} {...s} theme={theme} />
            ))}
        </div>
    </div>
  );
};

export default ParticleSkills;