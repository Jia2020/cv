import React, { useEffect, useState } from 'react';
import { Plane, MapPin, Clock } from 'lucide-react';
import { Theme } from '../types';

interface RetroMapProps {
    theme: Theme;
}

const RetroMap: React.FC<RetroMapProps> = ({ theme }) => {
  const [activeStage, setActiveStage] = useState(0);

  // Simple animation sequence (0 -> 1 -> 2 -> 3 -> 4 -> 0)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 5); 
    }, 2500); 
    return () => clearInterval(timer);
  }, []);

  // Define hex colors for SVG elements based on theme
  const getThemeHex = (t: Theme) => {
      switch(t) {
          case 'pink': return '#ec4899';
          case 'green': return '#22c55e';
          case 'purple': return '#a855f7';
          case 'amber': default: return '#f59e0b';
      }
  };
  
  const mainColor = getThemeHex(theme);

  const locations = [
    {
      id: 'china',
      x: 75, // %
      y: 40, // %
      label: 'CHINA',
      period: '1 - 10 YEARS OLD',
      desc: 'Origin / Childhood',
      color: mainColor 
    },
    {
      id: 'canada',
      x: 20,
      y: 35,
      label: 'CANADA',
      period: '10 - 24 YEARS OLD',
      desc: 'Education (McGill & UdeM)',
      color: '#ef4444' // Keep specific marker colors or unify? Keeping distinct location colors helps readability, but lines should match theme
    },
    {
      id: 'austria',
      x: 52,
      y: 32,
      label: 'AUSTRIA',
      period: '24 - 25 YEARS (NOW)',
      desc: 'Internship (UNODC)',
      color: '#22c55e'
    },
    {
      id: 'korea',
      x: 85,
      y: 38,
      label: 'SOUTH KOREA',
      period: '25 YEARS (EXCHANGE)',
      desc: 'Exchange Program (SNU)',
      color: '#3b82f6'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
      <div className={`border-b border-${theme}-500/50 pb-2 mb-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
           <Plane className="w-6 h-6" />
           <h2 className="text-2xl font-bold">GEOGRAPHIC TRAJECTORY</h2>
        </div>
        <div className={`text-xs font-mono animate-pulse text-${theme}-500`}>
            TRACKING COORDINATES...
        </div>
      </div>

      <div className={`relative flex-1 bg-black border border-${theme}-500/30 rounded overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]`}>
        
        {/* Abstract World Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `linear-gradient(${mainColor}20 1px, transparent 1px), linear-gradient(90deg, ${mainColor}20 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* World Map Silhouette (Simplified SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 60" preserveAspectRatio="none">
             {/* Rough Continents Outline */}
             <path d="M5,10 Q15,5 25,10 T45,15 T55,10 T85,15 T95,30" fill="none" stroke={mainColor} strokeWidth="0.2" />
             <path d="M10,20 Q15,40 25,50" fill="none" stroke={mainColor} strokeWidth="0.2" />
             <path d="M50,20 Q55,40 60,45" fill="none" stroke={mainColor} strokeWidth="0.2" />
             <path d="M70,20 Q80,40 90,50" fill="none" stroke={mainColor} strokeWidth="0.2" />
             <circle cx="85" cy="38" r="1.5" fill="none" stroke={mainColor} strokeWidth="0.2" />
        </svg>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={mainColor} />
                </marker>
            </defs>
            
            {/* Line 1: China -> Canada */}
            <path 
                d={`M${locations[0].x}% ${locations[0].y}% Q ${50}% ${10}% ${locations[1].x}% ${locations[1].y}%`}
                fill="none"
                stroke={mainColor}
                strokeWidth="2"
                strokeDasharray="5,5"
                className={`transition-opacity duration-700 ${activeStage >= 1 || activeStage === 0 ? 'opacity-60' : 'opacity-10'}`}
                markerEnd="url(#arrowhead)"
            />
            
            {/* Line 2: Canada -> Austria */}
            <path 
                d={`M${locations[1].x}% ${locations[1].y}% Q ${35}% ${20}% ${locations[2].x}% ${locations[2].y}%`}
                fill="none"
                stroke={mainColor}
                strokeWidth="2"
                strokeDasharray="5,5"
                className={`transition-opacity duration-700 ${activeStage >= 2 || activeStage === 0 ? 'opacity-60' : 'opacity-10'}`}
                markerEnd="url(#arrowhead)"
            />

            {/* Line 3: Austria -> Korea */}
            <path 
                d={`M${locations[2].x}% ${locations[2].y}% Q ${70}% ${15}% ${locations[3].x}% ${locations[3].y}%`}
                fill="none"
                stroke={mainColor}
                strokeWidth="2"
                strokeDasharray="5,5"
                className={`transition-opacity duration-700 ${activeStage >= 3 || activeStage === 0 ? 'opacity-60' : 'opacity-10'}`}
                markerEnd="url(#arrowhead)"
            />
        </svg>

        {/* Location Markers */}
        {locations.map((loc, idx) => (
            <div 
                key={loc.id}
                className="absolute group cursor-pointer transition-all duration-500"
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
            >
                {/* Ping Effect (Only active when stage matches) */}
                {(activeStage === 0 || activeStage === idx + 1) && (
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 w-full h-full`} style={{ backgroundColor: loc.color }}></div>
                )}
                
                {/* Dot */}
                <div className="relative w-4 h-4 rounded-full border-2 border-black z-10 hover:scale-150 transition-transform" style={{ backgroundColor: loc.color }}></div>

                {/* Card */}
                <div className={`
                    absolute top-6 left-1/2 -translate-x-1/2 w-48 
                    bg-black/90 border border-${theme}-500/50 p-3 rounded backdrop-blur-sm z-20
                    transition-all duration-500
                    ${idx + 1 === activeStage || activeStage === 0 ? 'opacity-100 scale-100' : 'opacity-20 scale-75 pointer-events-none'}
                `}>
                    <div className="text-lg font-bold flex items-center gap-2" style={{ color: loc.color }}>
                        <MapPin size={16} /> {loc.label}
                    </div>
                    <div className="text-xs text-white/80 font-mono mt-1 border-b border-white/20 pb-1 flex items-center gap-1">
                        <Clock size={12} /> {loc.period}
                    </div>
                    <div className={`text-sm mt-2 text-${theme}-100/90 leading-tight`}>
                        {loc.desc}
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-mono opacity-60">
          <div className={`${activeStage === 1 ? `text-${theme}-500 font-bold opacity-100` : ''}`}>PHASE 1: ASIA</div>
          <div className={`${activeStage === 2 ? 'text-red-500 font-bold opacity-100' : ''}`}>PHASE 2: N. AMERICA</div>
          <div className={`${activeStage === 3 ? 'text-green-500 font-bold opacity-100' : ''}`}>PHASE 3: EUROPE</div>
          <div className={`${activeStage === 4 ? 'text-blue-500 font-bold opacity-100' : ''}`}>PHASE 4: E. ASIA</div>
      </div>
    </div>
  );
};

export default RetroMap;