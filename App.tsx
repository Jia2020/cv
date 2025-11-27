import React, { useState } from 'react';
import ParticleComputer from './components/ParticleComputer';
import RetroMonitor from './components/RetroMonitor';
import RetroChat from './components/RetroChat';
import { ViewState, Theme } from './types';
import { Palette } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.BOOT);
  const [isComputerOpen, setIsComputerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('amber');

  const handleInteract = (type: 'COMPUTER' | 'MAP' | 'FOLDER') => {
    setIsComputerOpen(true);
    // Add a slight delay before showing the desktop to allow particles to disperse
    setTimeout(() => {
        if (type === 'COMPUTER') {
            setView(ViewState.DESKTOP);
        } else if (type === 'MAP') {
            setView(ViewState.MAP);
        } else {
            setView(ViewState.PROJECTS);
        }
    }, 600);
  };

  const handleReturnHome = () => {
      setIsComputerOpen(false);
      // Optional: Reset view after animation matches
      setTimeout(() => {
          setView(ViewState.BOOT);
      }, 1000);
  };

  // Theme color map for the switcher buttons
  const themeColors: Record<Theme, string> = {
      amber: 'bg-amber-500',
      pink: 'bg-pink-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500'
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      
      {/* Theme Switcher - Fixed Top Left */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4 animate-in fade-in duration-1000">
         <div className={`p-2 rounded-full border border-${theme}-500/30 bg-black/50 backdrop-blur-md flex gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
             <Palette size={16} className={`text-${theme}-500 ml-1`} />
             <div className="h-4 w-[1px] bg-white/20"></div>
             {(Object.keys(themeColors) as Theme[]).map((t) => (
                 <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-4 h-4 rounded-full ${themeColors[t]} ${theme === t ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'} transition-all`}
                    title={`Switch to ${t}`}
                 />
             ))}
         </div>
      </div>

      {/* 1. Background Particle System */}
      <div className={`absolute inset-0 z-10 transition-all duration-1000 ${isComputerOpen ? 'scale-150 opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <ParticleComputer onInteract={handleInteract} isExpanded={isComputerOpen} theme={theme} />
      </div>

      {/* 2. Main Retro Monitor Interface */}
      <div className={`
          relative z-20 w-[95vw] h-[90vh] md:w-[85vw] md:h-[85vh] max-w-6xl 
          transition-all duration-1000 transform
          ${isComputerOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}>
          {view !== ViewState.BOOT && (
            <RetroMonitor view={view} setView={setView} onReturnHome={handleReturnHome} theme={theme} />
          )}
      </div>

      {/* 3. Helper Hint if not opened */}
      {!isComputerOpen && (
          <div className="absolute bottom-8 text-white/30 text-sm font-mono z-0 flex gap-12 pointer-events-none">
             <span>EXPLORE RESUME</span>
             <span>VIEW PROJECTS</span>
             <span>TRACK JOURNEY</span>
          </div>
      )}

      {/* 4. Global Chatbot - Always available */}
      <RetroChat theme={theme} />

    </div>
  );
};

export default App;