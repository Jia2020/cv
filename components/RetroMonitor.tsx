import React, { useState } from 'react';
import { Terminal, Briefcase, GraduationCap, Cpu, ArrowLeft, User, FileText, Globe, FolderOpen, Bot, Bug, Power } from 'lucide-react';
import { ViewState, ResumeData, Theme } from '../types';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import ParticleSkills from './ParticleSkills';
import RetroMap from './RetroMap';

interface RetroMonitorProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  onReturnHome: () => void;
  theme: Theme;
}

const RetroMonitor: React.FC<RetroMonitorProps> = ({ view, setView, onReturnHome, theme }) => {
  const data: ResumeData = RESUME_DATA;
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const renderProjectContent = () => {
      // 1. Selection Screen (Particle Icons)
      if (!selectedProjectId) {
          return (
             <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-blue-500 mb-2">PROJECT DIRECTORY</h2>
                   <p className="text-sm opacity-70">SELECT DATA MODULE TO DECRYPT</p>
                </div>
                
                <div className="flex gap-16 md:gap-32">
                   {/* Icon 1: Chatbot */}
                   <button 
                      onClick={() => setSelectedProjectId('unodc-bot')}
                      className="group relative flex flex-col items-center gap-4 transition-all hover:scale-110"
                   >
                      <div className="w-40 h-40 relative flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-dotted border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
                          <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                          
                          <div className="relative z-10 bg-black/50 p-4 backdrop-blur-sm rounded-xl border border-blue-500/50 group-hover:bg-blue-900/20 group-hover:border-blue-400 transition-all">
                              <Bot size={64} className="text-blue-400 group-hover:text-white transition-colors" />
                          </div>
                          
                          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                      </div>
                      <span className="font-bold text-blue-400 group-hover:text-blue-200 tracking-wider">KNOWLEDGE BOT</span>
                   </button>

                   {/* Icon 2: Web Scraper */}
                   <button 
                      onClick={() => setSelectedProjectId('web-scraper')}
                      className="group relative flex flex-col items-center gap-4 transition-all hover:scale-110"
                   >
                      <div className="w-40 h-40 relative flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-dotted border-green-500/30 animate-[spin_10s_linear_infinite]"></div>
                          <div className="absolute inset-2 rounded-full border-2 border-dashed border-green-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                          
                          <div className="relative z-10 bg-black/50 p-4 backdrop-blur-sm rounded-xl border border-green-500/50 group-hover:bg-green-900/20 group-hover:border-green-400 transition-all">
                              <Bug size={64} className="text-green-400 group-hover:text-white transition-colors" />
                          </div>
                          
                          <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full group-hover:bg-green-500/30 transition-all"></div>
                      </div>
                      <span className="font-bold text-green-400 group-hover:text-green-200 tracking-wider">SCRAPING ASSISTANT</span>
                   </button>
                </div>
             </div>
          );
      }

      // 2. Detail View (PDF Style) - Keep projects theme independent (Blue/Green)
      const project = PROJECTS_DATA.find(p => p.id === selectedProjectId);
      if (!project) return null;
      
      const themeColor = project.id === 'unodc-bot' ? 'text-blue-500 border-blue-500' : 'text-green-500 border-green-500';
      const themeBg = project.id === 'unodc-bot' ? 'bg-blue-900/20' : 'bg-green-900/20';
      const textColor = project.id === 'unodc-bot' ? 'text-blue-300' : 'text-green-300';

      return (
         <div className="animate-in slide-in-from-right duration-500 space-y-6 max-w-4xl mx-auto pb-8">
            <button 
                onClick={() => setSelectedProjectId(null)}
                className={`flex items-center gap-2 px-3 py-1 text-xs border rounded hover:bg-white hover:text-black transition-colors ${themeColor} border-opacity-50`}
            >
                <ArrowLeft size={14} /> BACK TO DIRECTORY
            </button>
            
            <header className={`border-b-2 ${themeColor.split(' ')[1]} pb-4`}>
                <h2 className={`text-3xl font-bold ${textColor.replace('300','400')}`}>{project.title}</h2>
                <div className="text-lg opacity-80 mt-1">{project.subtitle}</div>
                <div className="flex gap-4 mt-2 text-sm font-mono opacity-60">
                    <span>DATE: {project.date}</span>
                    <span>AUTHOR: JIA SONG</span>
                </div>
            </header>

            <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                    <span key={i} className={`px-2 py-1 text-xs font-mono rounded border ${themeColor.split(' ')[1]} ${themeBg} bg-opacity-30`}>
                        {t}
                    </span>
                ))}
            </div>

            <section>
                <h3 className={`text-xl font-bold mb-2 ${textColor.replace('300','400')}`}>ABSTRACT</h3>
                <p className="opacity-90 leading-relaxed text-justify">{project.abstract}</p>
            </section>

            <section>
                <h3 className={`text-xl font-bold mb-4 ${textColor.replace('300','400')}`}>SYSTEM ARCHITECTURE</h3>
                <div className="space-y-4">
                    {project.architecture.map((stage, idx) => (
                        <div key={idx} className={`p-4 border-l-4 ${themeColor.split(' ')[1]} bg-white/5`}>
                            <h4 className="font-bold mb-1">{stage.stage}</h4>
                            <p className="text-sm opacity-80">{stage.details}</p>
                        </div>
                    ))}
                </div>
            </section>

             <section>
                <h3 className={`text-xl font-bold mb-2 ${textColor.replace('300','400')}`}>PERFORMANCE METRICS</h3>
                <div className="p-4 border border-dashed border-white/20 rounded">
                    <p className="font-mono text-sm">{project.results}</p>
                </div>
            </section>
         </div>
      );
  };

  // Render Logic based on ViewState
  const renderContent = () => {
    switch (view) {
      case ViewState.EDUCATION:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className={`border-b border-${theme}-500/50 pb-2 mb-4 flex items-center gap-2`}>
                <GraduationCap className="w-6 h-6" />
                <h2 className="text-2xl font-bold">ACADEMIC RECORDS</h2>
             </div>
             
             {data.education.map((edu, idx) => (
               <div key={idx} className={`bg-${theme}-900/10 p-4 border border-${theme}-500/30 rounded hover:bg-${theme}-900/20 transition-colors`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`text-xl font-bold text-${theme}-400`}>{edu.degree}</h3>
                    <span className="text-sm opacity-70">{edu.period}</span>
                  </div>
                  <div className="text-lg">{edu.institution}</div>
                  <div className="text-sm opacity-80 mt-1">{edu.details}</div>
                  <div className={`mt-2 text-${theme}-300 font-bold`}>GPA: {edu.gpa}</div>
               </div>
             ))}

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <FileText className="w-5 h-5" /> RELEVANT COURSEWORK
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {data.courses.map((c, idx) => (
                    <div key={idx} className={`border border-${theme}-500/20 p-3`}>
                        <h4 className={`font-bold border-b border-${theme}-500/20 mb-2`}>{c.university}</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 opacity-80">
                           {c.courses.map((course, cIdx) => (
                               <li key={cIdx}>{course}</li>
                           ))}
                        </ul>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        );

      case ViewState.WORK:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className={`border-b border-${theme}-500/50 pb-2 mb-4 flex items-center gap-2`}>
                <Briefcase className="w-6 h-6" />
                <h2 className="text-2xl font-bold">PROFESSIONAL LOGS</h2>
             </div>

             <div className="space-y-6">
                <h3 className={`text-xl bg-${theme}-500 text-black px-2 inline-block font-bold`}>INTERNSHIPS</h3>
                {data.internships.map((job, idx) => (
                    <div key={idx} className={`relative pl-6 border-l-2 border-${theme}-500`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 bg-${theme}-500 rounded-full`} />
                        <div className="flex justify-between flex-wrap">
                            <h4 className="text-xl font-bold">{job.role}</h4>
                            <span className={`font-mono text-sm border border-${theme}-500 px-2 rounded`}>{job.period}</span>
                        </div>
                        <div className="text-lg opacity-90 mb-2">{job.company}</div>
                        <ul className="list-disc list-inside space-y-2 text-sm opacity-80 mb-3">
                            {job.points.map((pt, pIdx) => <li key={pIdx}>{pt}</li>)}
                        </ul>
                        {job.techStack && (
                            <div className={`text-xs font-mono bg-${theme}-900/30 p-2 border border-${theme}-500/20`}>
                                <span className={`text-${theme}-300`}>STACK:</span> {job.techStack}
                            </div>
                        )}
                    </div>
                ))}
             </div>

             <div className="space-y-6 pt-4">
                <h3 className={`text-xl bg-${theme}-500 text-black px-2 inline-block font-bold`}>WORK HISTORY</h3>
                {data.workExperience.map((job, idx) => (
                    <div key={idx} className={`relative pl-6 border-l-2 border-${theme}-500/50`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-${theme}-500 rounded-full`} />
                         <div className="flex justify-between flex-wrap">
                            <h4 className="text-lg font-bold">{job.role}</h4>
                            <span className="font-mono text-sm opacity-70">{job.period}</span>
                        </div>
                        <div className="opacity-90">{job.company}</div>
                        <ul className="list-disc list-inside space-y-1 text-sm opacity-80 mt-2">
                             {job.points.map((pt, pIdx) => <li key={pIdx}>{pt}</li>)}
                        </ul>
                    </div>
                ))}
             </div>
          </div>
        );

      case ViewState.OTHER:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
             <div className={`border-b border-${theme}-500/50 pb-2 mb-4 flex items-center gap-2 shrink-0`}>
                <Cpu className="w-6 h-6" />
                <h2 className="text-2xl font-bold">PROFILE & SKILL DATABASE</h2>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto pr-2">
                 <div className="flex flex-col">
                    <h3 className={`text-lg font-bold mb-4 shrink-0 border-b border-${theme}-500/30 w-fit`}>SKILL LEVELS (HOVER TO SCAN)</h3>
                    <div className="flex-1">
                        <ParticleSkills skills={data.skills} theme={theme} />
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div>
                        <h3 className={`text-lg font-bold mb-4 border-b border-${theme}-500/30 w-fit`}>CONTACT PROTOCOLS</h3>
                        <div className={`bg-black border border-${theme}-500 p-4 font-mono text-sm space-y-3 relative`}>
                            <div className="absolute top-0 right-0 p-1">
                                <div className={`w-2 h-2 bg-${theme}-500 animate-pulse`}></div>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="opacity-70 group-hover:opacity-100 transition-opacity">PHONE:</span> 
                                <span className="font-bold">{data.contact.phone}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="opacity-70 group-hover:opacity-100 transition-opacity">EMAIL:</span> 
                                <span className="font-bold">{data.contact.email}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="opacity-70 group-hover:opacity-100 transition-opacity">LINK:</span> 
                                <a href="#" className={`underline decoration-${theme}-500/50 hover:decoration-${theme}-500 hover:text-white transition-all`}>{data.contact.linkedin}</a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={`text-lg font-bold mb-4 border-b border-${theme}-500/30 w-fit`}>VOLUNTEER LOGS</h3>
                        <div className="space-y-4">
                            {data.volunteering.map((vol, idx) => (
                                <div key={idx} className={`text-sm border-l-2 border-${theme}-500/40 pl-4 py-1 hover:border-${theme}-500 transition-colors`}>
                                    <div className={`font-bold text-${theme}-400`}>{vol.role}</div>
                                    <div className="opacity-60 text-xs font-mono mt-1">{vol.period}</div>
                                    {vol.description && <p className="opacity-80 mt-2 text-xs leading-relaxed">{vol.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             </div>
          </div>
        );

      case ViewState.MAP:
          return <RetroMap theme={theme} />;

      case ViewState.PROJECTS:
          return renderProjectContent();

      case ViewState.DESKTOP:
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-700">
             <div className="mb-8 text-center space-y-4 max-w-2xl">
                <h1 className={`text-5xl md:text-7xl font-bold tracking-widest text-glow text-${theme}-500`}>{data.name}</h1>
                <div className={`border-t border-b border-${theme}-500/30 py-2`}>
                    <p className={`text-lg md:text-xl opacity-90 tracking-widest text-${theme}-300 typewriter`}>
                       DATA STREAM ESTABLISHED. INITIALIZING CAREER PROTOCOLS...<br/>
                       DISCOVER THE SOURCE CODE.
                    </p>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-6 w-full max-w-5xl px-4">
                 <button 
                    onClick={() => setView(ViewState.EDUCATION)}
                    className="group flex flex-col items-center gap-4 transition-transform hover:scale-110 focus:outline-none"
                 >
                    <div className={`w-16 h-16 md:w-24 md:h-24 border-2 border-${theme}-500 bg-black flex items-center justify-center rounded-lg group-hover:bg-${theme}-500 group-hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                        <GraduationCap size={32} className={`md:w-10 md:h-10 text-${theme}-500 group-hover:text-black`} />
                    </div>
                    <span className={`text-sm md:text-xl font-bold bg-black px-2 text-${theme}-500 group-hover:bg-${theme}-500 group-hover:text-black`}>ACADEMICS</span>
                 </button>

                 <button 
                    onClick={() => setView(ViewState.WORK)}
                    className="group flex flex-col items-center gap-4 transition-transform hover:scale-110 focus:outline-none"
                 >
                    <div className={`w-16 h-16 md:w-24 md:h-24 border-2 border-${theme}-500 bg-black flex items-center justify-center rounded-lg group-hover:bg-${theme}-500 group-hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                        <Briefcase size={32} className={`md:w-10 md:h-10 text-${theme}-500 group-hover:text-black`} />
                    </div>
                    <span className={`text-sm md:text-xl font-bold bg-black px-2 text-${theme}-500 group-hover:bg-${theme}-500 group-hover:text-black`}>WORK</span>
                 </button>
                 
                 <button 
                    onClick={() => setView(ViewState.MAP)}
                    className="group flex flex-col items-center gap-4 transition-transform hover:scale-110 focus:outline-none"
                 >
                    <div className={`w-16 h-16 md:w-24 md:h-24 border-2 border-${theme}-500 bg-black flex items-center justify-center rounded-lg group-hover:bg-${theme}-500 group-hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                        <Globe size={32} className={`md:w-10 md:h-10 text-${theme}-500 group-hover:text-black`} />
                    </div>
                    <span className={`text-sm md:text-xl font-bold bg-black px-2 text-${theme}-500 group-hover:bg-${theme}-500 group-hover:text-black`}>LOGS</span>
                 </button>

                 <button 
                    onClick={() => setView(ViewState.OTHER)}
                    className="group flex flex-col items-center gap-4 transition-transform hover:scale-110 focus:outline-none"
                 >
                    <div className={`w-16 h-16 md:w-24 md:h-24 border-2 border-${theme}-500 bg-black flex items-center justify-center rounded-lg group-hover:bg-${theme}-500 group-hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                        <User size={32} className={`md:w-10 md:h-10 text-${theme}-500 group-hover:text-black`} />
                    </div>
                    <span className={`text-sm md:text-xl font-bold bg-black px-2 text-${theme}-500 group-hover:bg-${theme}-500 group-hover:text-black`}>PROFILE</span>
                 </button>
             </div>

              {/* Action Buttons Row */}
             <div className="mt-12 flex gap-8">
                {/* Project Access */}
                <button onClick={() => setView(ViewState.PROJECTS)} className="group flex items-center gap-2 text-blue-500 hover:text-blue-300 transition-colors border border-blue-500/30 px-4 py-2 rounded hover:bg-blue-900/20">
                    <FolderOpen size={18} className="group-hover:animate-bounce" /> ACCESS PROJECT DIRECTORY
                </button>

                {/* Return Home / Shutdown */}
                <button onClick={onReturnHome} className="group flex items-center gap-2 text-red-500 hover:text-red-300 transition-colors border border-red-500/30 px-4 py-2 rounded hover:bg-red-900/20">
                    <Power size={18} className="group-hover:animate-pulse" /> SYSTEM SHUTDOWN (HOME)
                </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full bg-neutral-950 text-${theme}-500 p-4 md:p-8 overflow-hidden flex flex-col font-mono border-4 border-neutral-800 rounded-xl shadow-2xl`}>
        {/* CRT Overlay Effects */}
        <div className="scanline z-50 pointer-events-none opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-40"></div>
        
        {/* Header / Status Bar */}
        <div className={`flex justify-between items-center border-b-2 border-${theme}-500/30 pb-2 mb-4 z-30 opacity-80 shrink-0`}>
            <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm">ROOT@JIA-SONG:~/RESUME</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={onReturnHome} className="hover:text-red-500 transition-colors" title="Shutdown System">
                    <Power size={14} />
                </button>
                <div className="text-xs animate-pulse">● ONLINE</div>
            </div>
        </div>

        {/* Content Area */}
        <div className="relative z-30 flex-1 overflow-y-auto custom-scrollbar p-2">
             {view !== ViewState.DESKTOP && (
                 <button 
                    onClick={() => {
                        if (view === ViewState.PROJECTS && selectedProjectId) {
                            setSelectedProjectId(null); // Back to project list
                        } else {
                            setView(ViewState.DESKTOP);
                        }
                    }}
                    className={`mb-4 flex items-center gap-2 hover:bg-${theme}-500 hover:text-black px-3 py-1 rounded border border-${theme}-500 transition-all w-fit`}
                 >
                    <ArrowLeft size={16} /> {view === ViewState.PROJECTS && selectedProjectId ? 'BACK TO LIST' : 'RETURN TO MAIN'}
                 </button>
             )}
             
             {renderContent()}
        </div>

         {/* Footer */}
         <div className={`mt-4 pt-2 border-t border-${theme}-500/30 text-xs flex justify-between opacity-60 z-30 shrink-0`}>
            <span>MEM: 64KB OK</span>
            <span>V 2.1.0</span>
         </div>
    </div>
  );
};

export default RetroMonitor;