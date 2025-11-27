import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface ParticleComputerProps {
  onInteract: (type: 'COMPUTER' | 'MAP' | 'FOLDER') => void;
  isExpanded: boolean;
  theme: Theme;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  color: string;
  group: 'COMPUTER' | 'MAP' | 'FOLDER' | 'TEXT';
}

const ParticleComputer: React.FC<ParticleComputerProps> = ({ onInteract, isExpanded, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });
  
  // Animation smoothing refs
  const scaleRef = useRef({ computer: 1, map: 1, folder: 1 });
  const opacityRef = useRef({ computer: 1, map: 1, folder: 1 });
  
  // Track which object is being hovered for cursor change
  const hoverStateRef = useRef<'NONE' | 'COMPUTER' | 'MAP' | 'FOLDER'>('NONE');

  // Theme Colors Map
  const getThemeColors = (t: Theme) => {
      switch(t) {
          case 'pink': return { main: '#ec4899', sub: '#db2777' };
          case 'green': return { main: '#22c55e', sub: '#16a34a' };
          case 'purple': return { main: '#a855f7', sub: '#9333ea' };
          case 'amber': 
          default: return { main: '#f59e0b', sub: '#d97706' };
      }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeColors = getThemeColors(theme);

    // Define centers globally for both init and animation usage
    let compCenterX = 0;
    let compCenterY = 0;
    let folderCenterX = 0;
    let folderCenterY = 0;
    let globeCenterX = 0;
    let globeCenterY = 0;

    const initParticles = () => {
      particlesRef.current = [];
      const width = canvas.width;
      const height = canvas.height;
      
      // Scaling factor
      const scale = Math.min(width, height) / 900; 

      // Update Centers - 3 Columns
      compCenterX = width * 0.2; 
      compCenterY = height / 2;
      
      folderCenterX = width * 0.5;
      folderCenterY = height / 2;
      
      globeCenterX = width * 0.8;
      globeCenterY = height / 2;

      // Colors
      const COL_CASE_LIGHT = '#e5e5e5';
      const COL_CASE_SHADOW = '#d4d4d4'; 
      const COL_SCREEN_TEXT = themeColors.main; // Theme Color
      const COL_KEY_DARK = '#a3a3a3';
      const COL_TRACKBALL = '#ef4444';
      
      const COL_MAP_LAND = themeColors.main; // Theme Color
      const COL_MAP_WATER = '#064e3b'; // Keep dark green/blue base or maybe neutral? Keeping as is for contrast
      const COL_MAP_GRID = '#059669'; 
      const COL_MAP_ATMOSPHERE = themeColors.sub; // Theme sub color

      const COL_FOLDER_MAIN = '#3b82f6'; // Keep folder blue to distinguish? Or make it theme? Let's keep blue for "Projects" identity
      const COL_FOLDER_HIGHLIGHT = '#60a5fa'; 
      const COL_FOLDER_DARK = '#1d4ed8'; 
      
      const COL_TEXT_MAIN = themeColors.main; // Theme Color
      
      const addParticle = (x: number, y: number, color: string, group: 'COMPUTER' | 'MAP' | 'FOLDER' | 'TEXT', sizeVar: number = 1) => {
         particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            baseX: x,
            baseY: y,
            size: (Math.random() * 2 + 1) * scale * sizeVar,
            density: (Math.random() * 30) + 1,
            color: color,
            group: group
         });
      };

      // --- GENERATE TEXT PARTICLES ---
      // Use an offscreen canvas to sample text pixels
      const textCanvas = document.createElement('canvas');
      const tCtx = textCanvas.getContext('2d');
      if (tCtx) {
          textCanvas.width = width;
          textCanvas.height = height;
          
          // Title
          const titleSize = Math.floor(145 * scale); 
          tCtx.font = `bold ${titleSize}px "Share Tech Mono", monospace`;
          tCtx.fillStyle = 'white';
          tCtx.textAlign = 'center';
          tCtx.textBaseline = 'middle';
          tCtx.fillText("JIA SONG", width / 2, height * 0.12); 
          
          const imageData = tCtx.getImageData(0, 0, width, height);
          const data = imageData.data;
          
          const step = 2; 
          for(let y = 0; y < height; y += step) {
              for(let x = 0; x < width; x += step) {
                   const index = (y * width + x) * 4;
                   if (data[index + 3] > 128) {
                       const color = COL_TEXT_MAIN;
                       if (Math.random() > 0.1) {
                           addParticle(x, y, color, 'TEXT', 0.8);
                       }
                   }
              }
          }
      }


      // --- OBJECT 1: COMPUTER (LEFT SIDE) ---
      const gap = 5 * scale;

      // Monitor Housing
      const monW = 280 * scale; 
      const monH = 220 * scale;
      const monX = compCenterX - monW / 2;
      const monY = compCenterY - 120 * scale;

      for (let y = monY; y < monY + monH; y += gap) {
        for (let x = monX; x < monX + monW; x += gap) {
            const screenMargin = 25 * scale;
            const inScreenX = x > monX + screenMargin && x < monX + monW - screenMargin;
            const inScreenY = y > monY + screenMargin && y < monY + monH - screenMargin * 1.2;
            
            if (!inScreenX || !inScreenY) {
               const isEdge = x < monX + 10 || x > monX + monW - 10 || y < monY + 10 || y > monY + monH - 10;
               if (!isEdge || Math.random() > 0.4) {
                   addParticle(x, y, Math.random() > 0.5 ? COL_CASE_LIGHT : COL_CASE_SHADOW, 'COMPUTER');
               }
            } else {
                const screenRelY = y - (monY + screenMargin);
                if (Math.floor(screenRelY / (12 * scale)) % 2 === 0 && Math.random() > 0.3) {
                    addParticle(x, y, COL_SCREEN_TEXT, 'COMPUTER', 0.8);
                }
            }
        }
      }

      // Keyboard
      const keybW = 300 * scale;
      const keybH = 80 * scale;
      const keybX = compCenterX - keybW / 2;
      const keybY = monY + monH - 5 * scale;

      for (let y = keybY; y < keybY + keybH; y += gap) {
         for (let x = keybX; x < keybX + keybW; x += gap) {
            const trackballCenterX = keybX + keybW * 0.8;
            const trackballCenterY = keybY + keybH * 0.5;
            const dist = Math.sqrt(Math.pow(x - trackballCenterX, 2) + Math.pow(y - trackballCenterY, 2));
            
            if (dist < 20 * scale) {
                addParticle(x, y, COL_TRACKBALL, 'COMPUTER');
            } else if (dist < 25 * scale) {
                addParticle(x, y, COL_CASE_SHADOW, 'COMPUTER');
            } else {
                const inKeys = x > keybX + 15 * scale && x < keybX + keybW * 0.65 && y > keybY + 15 * scale && y < keybY + keybH - 15 * scale;
                if (inKeys) {
                    if (Math.floor((x - keybX) / (15 * scale)) % 2 !== 0 && Math.floor((y - keybY) / (15 * scale)) % 2 !== 0) {
                         addParticle(x, y, COL_KEY_DARK, 'COMPUTER');
                    } else {
                         addParticle(x, y, COL_CASE_SHADOW, 'COMPUTER');
                    }
                } else {
                    addParticle(x, y, COL_CASE_LIGHT, 'COMPUTER');
                }
            }
         }
      }

      // --- OBJECT 2: BLUE FOLDER (CENTER) ---
      const foldW = 240 * scale;
      const foldH = 180 * scale;
      const foldX = folderCenterX - foldW / 2;
      const foldY = folderCenterY - foldH / 3; 
      const tabW = 90 * scale;
      const tabH = 30 * scale;

      // Draw Folder Tab
      for (let y = foldY - tabH; y < foldY; y += gap) {
          for (let x = foldX; x < foldX + tabW; x += gap) {
             addParticle(x, y, COL_FOLDER_DARK, 'FOLDER');
          }
      }
      
      // Draw Folder Body
      for (let y = foldY; y < foldY + foldH; y += gap) {
          for (let x = foldX; x < foldX + foldW; x += gap) {
              const isFront = y > foldY + 20 * scale; 
              if (isFront) {
                  if (Math.random() > 0.1) {
                    addParticle(x, y, COL_FOLDER_MAIN, 'FOLDER');
                  }
              } else {
                   addParticle(x, y, COL_FOLDER_DARK, 'FOLDER');
              }
              
              if (!isFront && x > foldX + 20 && x < foldX + foldW - 20) {
                  if (Math.random() > 0.8) addParticle(x, y - 10, '#ffffff', 'FOLDER');
              }
          }
      }
      // Add a symbol on folder
      const iconCenterX = foldX + foldW / 2;
      const iconCenterY = foldY + foldH / 2 + 10;
      for (let r = 0; r < 30 * scale; r += gap) {
          for (let theta = 0; theta < Math.PI * 2; theta += 0.5) {
               addParticle(iconCenterX + r * Math.cos(theta), iconCenterY + r * Math.sin(theta), COL_FOLDER_HIGHLIGHT, 'FOLDER', 0.8);
          }
      }


      // --- OBJECT 3: COMPLEX GLOBE / MAP (RIGHT SIDE) ---
      const globeRadius = 140 * scale;
      
      const particleCount = 1800;
      for (let i = 0; i < particleCount; i++) {
          const z = 2 * Math.random() - 1;
          const radiusAtZ = Math.sqrt(1 - z*z);
          const theta = 2 * Math.PI * Math.random();
          
          const x3d = globeRadius * radiusAtZ * Math.cos(theta);
          const y3d = globeRadius * radiusAtZ * Math.sin(theta);
          const z3d = globeRadius * z;
          
          const px = globeCenterX + x3d;
          const py = globeCenterY + y3d * 0.9 + z3d * 0.2; 
          
          const noise = Math.sin(x3d * 0.05) * Math.cos(y3d * 0.05) + Math.sin(z3d * 0.05);
          const isLand = noise > 0.2;
          
          const isLatLine = Math.abs(z3d) % (globeRadius / 5) < 3;
          const isLongLine = Math.abs(theta % (Math.PI / 4)) < 0.1;

          if (isLand) {
             addParticle(px, py, COL_MAP_LAND, 'MAP', 0.9);
          } else if (isLatLine || isLongLine) {
             addParticle(px, py, COL_MAP_GRID, 'MAP', 0.6);
          } else if (Math.random() > 0.7) {
             addParticle(px, py, COL_MAP_WATER, 'MAP', 0.5);
          }
      }

      // 2. ORBITAL RINGS
      for (let i = 0; i < 200; i++) {
         const angle = Math.random() * Math.PI * 2;
         const dist = globeRadius * (1.2 + Math.random() * 0.3);
         const ox = globeCenterX + dist * Math.cos(angle);
         const oy = globeCenterY + (dist * 0.3) * Math.sin(angle); 
         const rotatedX = globeCenterX + (ox - globeCenterX) * 0.9 - (oy - globeCenterY) * 0.4;
         const rotatedY = globeCenterY + (ox - globeCenterX) * 0.4 + (oy - globeCenterY) * 0.9;
         if (Math.random() > 0.5) {
            addParticle(rotatedX, rotatedY, COL_MAP_ATMOSPHERE, 'MAP', 0.4);
         }
      }

      // Labels (Underline particles)
      const textY = globeCenterY + globeRadius + 40 * scale;
      const textW = 120 * scale;
      for(let tx = globeCenterX - textW/2; tx < globeCenterX + textW/2; tx += gap) {
          addParticle(tx, textY, COL_MAP_LAND, 'MAP', 0.6);
      }
      
      const compTextY = keybY + keybH + 20 * scale;
      for(let tx = compCenterX - textW/2; tx < compCenterX + textW/2; tx += gap) {
          addParticle(tx, compTextY, COL_SCREEN_TEXT, 'COMPUTER', 0.6);
      }
      
      const folderTextY = foldY + foldH + 20 * scale;
      for(let tx = folderCenterX - textW/2; tx < folderCenterX + textW/2; tx += gap) {
          addParticle(tx, folderTextY, COL_FOLDER_MAIN, 'FOLDER', 0.6);
      }
    };

    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animation Logic
      let targetCompScale = 1.0;
      let targetMapScale = 1.0;
      let targetFolderScale = 1.0;
      
      let targetCompOpacity = 1.0;
      let targetMapOpacity = 1.0;
      let targetFolderOpacity = 1.0;

      if (!isExpanded) {
          if (hoverStateRef.current === 'COMPUTER') {
              targetCompScale = 1.2; 
              targetFolderScale = 0.8;
              targetMapScale = 0.8;
              targetCompOpacity = 1.0;
              targetFolderOpacity = 0.5;
              targetMapOpacity = 0.5;
          } else if (hoverStateRef.current === 'FOLDER') {
              targetCompScale = 0.8; 
              targetFolderScale = 1.2;
              targetMapScale = 0.8;
              targetCompOpacity = 0.5;
              targetFolderOpacity = 1.0;
              targetMapOpacity = 0.5;
          } else if (hoverStateRef.current === 'MAP') {
              targetCompScale = 0.8; 
              targetFolderScale = 0.8;
              targetMapScale = 1.2;
              targetCompOpacity = 0.5;
              targetFolderOpacity = 0.5;
              targetMapOpacity = 1.0;
          }
      }

      scaleRef.current.computer = lerp(scaleRef.current.computer, targetCompScale, 0.05);
      scaleRef.current.map = lerp(scaleRef.current.map, targetMapScale, 0.05);
      scaleRef.current.folder = lerp(scaleRef.current.folder, targetFolderScale, 0.05);
      
      opacityRef.current.computer = lerp(opacityRef.current.computer, targetCompOpacity, 0.05);
      opacityRef.current.map = lerp(opacityRef.current.map, targetMapOpacity, 0.05);
      opacityRef.current.folder = lerp(opacityRef.current.folder, targetFolderOpacity, 0.05);

      for (let i = 0; i < particlesRef.current.length; i++) {
        let p = particlesRef.current[i];
        
        if (isExpanded) {
            const dx = p.x - canvas.width / 2;
            const dy = p.y - canvas.height / 2;
            p.x += dx * 0.08;
            p.y += dy * 0.08;
            p.size = Math.max(0, p.size - 0.1);
        } else {
            let currentScale = 1;
            let originX = 0;
            let originY = 0;

            if (p.group === 'COMPUTER') {
                currentScale = scaleRef.current.computer;
                originX = compCenterX;
                originY = compCenterY;
            } else if (p.group === 'FOLDER') {
                currentScale = scaleRef.current.folder;
                originX = folderCenterX;
                originY = folderCenterY;
            } else if (p.group === 'MAP') {
                currentScale = scaleRef.current.map;
                originX = globeCenterX;
                originY = globeCenterY;
            } else {
                currentScale = 1;
                originX = p.baseX; 
                originY = p.baseY;
            }
            
            let homeX, homeY;
            
            if (p.group === 'TEXT') {
                 homeX = p.baseX;
                 homeY = p.baseY;
            } else {
                 homeX = originX + (p.baseX - originX) * currentScale;
                 homeY = originY + (p.baseY - originY) * currentScale;
            }

            const dx = mouseRef.current.x - p.x;
            const dy = mouseRef.current.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRef.current.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
                p.x -= forceDirectionX * force * p.density;
                p.y -= forceDirectionY * force * p.density;
            } else {
                if (p.x !== homeX) p.x -= (p.x - homeX) / 10;
                if (p.y !== homeY) p.y -= (p.y - homeY) / 10;
            }
        }

        if (p.size > 0) {
            let alpha = 1.0;
            if (p.group === 'COMPUTER') alpha = opacityRef.current.computer;
            else if (p.group === 'FOLDER') alpha = opacityRef.current.folder;
            else if (p.group === 'MAP') alpha = opacityRef.current.map;
            else alpha = 1.0;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            
            let scaleMult = 1;
            if (!isExpanded) {
                if (p.group === 'COMPUTER') scaleMult = scaleRef.current.computer;
                else if (p.group === 'FOLDER') scaleMult = scaleRef.current.folder;
                else if (p.group === 'MAP') scaleMult = scaleRef.current.map;
            }

            ctx.arc(p.x, p.y, p.size * scaleMult, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;

        const width = canvas.width;
        
        if (mouseRef.current.x < width * 0.35) {
            hoverStateRef.current = 'COMPUTER';
            canvas.style.cursor = 'pointer'; 
        } else if (mouseRef.current.x < width * 0.65) {
            hoverStateRef.current = 'FOLDER';
            canvas.style.cursor = 'pointer';
        } else {
            hoverStateRef.current = 'MAP';
            canvas.style.cursor = 'pointer'; 
        }
    };
    
    const handleClick = () => {
        if (isExpanded) return;
        if (hoverStateRef.current !== 'NONE') {
            onInteract(hoverStateRef.current);
        }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isExpanded, onInteract, theme]);

  return (
    <div 
        ref={containerRef} 
        className={`w-full h-full absolute inset-0 transition-opacity duration-1000 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
        <canvas ref={canvasRef} className="block" />
        
        {/* Subtitle restored to DOM element */}
        <div className={`absolute top-[22%] w-full text-center pointer-events-none transition-opacity duration-1000 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className={`text-${theme}-500/80 font-mono text-base md:text-lg tracking-[0.2em] text-glow font-bold`}>INTERACTIVE PORTFOLIO TERMINAL</h2>
            <div className={`w-24 h-1 bg-${theme}-500/30 mx-auto mt-2 rounded-full`}></div>
        </div>
        
        <div className={`absolute top-[80%] left-[10%] w-[20%] text-center pointer-events-none transition-opacity duration-500`}>
            <div className={`text-${theme}-500 animate-pulse font-mono text-sm tracking-widest`}>RESUME & SKILLS</div>
        </div>
        <div className={`absolute top-[80%] left-[40%] w-[20%] text-center pointer-events-none transition-opacity duration-500`}>
            <div className="text-blue-500 animate-pulse font-mono text-sm tracking-widest">PROJECT SHOWCASE</div>
        </div>
        <div className={`absolute top-[80%] left-[70%] w-[20%] text-center pointer-events-none transition-opacity duration-500`}>
            <div className={`text-${theme}-500 animate-pulse font-mono text-sm tracking-widest`}>LIFE TIMELINE</div>
        </div>
    </div>
  );
};

export default ParticleComputer;