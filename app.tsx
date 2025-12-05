import React, { useState, useEffect } from 'react';
import { APPS } from './constants';
import { WindowState, Theme, AppID } from './types';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import Settings from './components/apps/Settings';

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [currentTheme, setCurrentTheme] = useState<Theme>(Theme.Default);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getThemeClass = (theme: Theme) => {
    switch (theme) {
      case Theme.Aurora: return 'bg-gradient-to-br from-green-400 via-cyan-900 to-blue-900';
      case Theme.Midnight: return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
      case Theme.Sunset: return 'bg-gradient-to-br from-orange-500 via-red-900 to-slate-900';
      default: return 'bg-gradient-to-br from-blue-900 via-slate-900 to-black';
    }
  };

  const handleLaunchApp = (appId: AppID) => {
    const appConfig = APPS.find(a => a.id === appId);
    if (!appConfig) return;

    // Bring to front if already open (simple logic: find last instance)
    const existing = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existing) {
      handleFocusWindow(existing.id);
      return;
    }

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId: appId,
      title: appConfig.title,
      x: 50 + (windows.length * 30),
      y: 50 + (windows.length * 30),
      width: appConfig.defaultWidth,
      height: appConfig.defaultHeight,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  const handleCloseWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    handleFocusWindow(id);
  };

  const handleFocusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const target = prev.find(w => w.id === id);
      if (!target) return prev;
      
      // If already max z-index, don't increment indefinitely too fast, but ensured it's top
      // Simple approach: increment global z
      if (target.zIndex === nextZIndex - 1) return prev; 
      
      const newZ = nextZIndex;
      setNextZIndex(z => z + 1);
      
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w);
    });
  };

  const handleUpdatePosition = (id: string, x: number, y: number, w: number, h: number) => {
    setWindows(prev => prev.map(window => {
      if (window.id === id) {
        return { ...window, x, y, width: w, height: h };
      }
      return window;
    }));
  };

  // Extract the icon component for JSX usage to avoid "JSX element type 'APPS' does not have any construct or call signatures"
  const NebulaIcon = APPS[0].icon;

  return (
    <div className={`relative w-full h-full overflow-hidden transition-all duration-1000 ease-in-out bg-cover bg-center ${getThemeClass(currentTheme)}`}>
      
      {/* Desktop Area - Icons could go here */}
      <div className="absolute top-0 left-0 p-6 grid grid-flow-row gap-6">
         {/* Simple Desktop Shortcut Example */}
         <div 
           onDoubleClick={() => handleLaunchApp('ai-assistant')}
           className="flex flex-col items-center gap-2 group cursor-pointer w-20"
         >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors shadow-lg backdrop-blur-sm">
                <NebulaIcon className="text-blue-300 w-8 h-8" />
            </div>
            <span className="text-white/90 text-xs font-medium drop-shadow text-center bg-black/20 px-2 rounded">Nebula AI</span>
         </div>
      </div>

      {/* Top Bar (Status) */}
      <div className="absolute top-0 left-0 w-full h-8 flex justify-between items-center px-4 bg-transparent text-white/80 text-xs font-medium z-50">
        <div className="flex items-center gap-4">
          <span className="font-bold">NebulaOS</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
        </div>
        <div className="flex items-center gap-4">
           <span>{currentTime.toLocaleDateString()}</span>
           <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Windows Layer */}
      {windows.map(window => {
        const app = APPS.find(a => a.id === window.appId);
        if (!app) return null;
        
        // Special prop injection for Settings app
        const childProps: any = {};
        if (window.appId === 'settings') {
           childProps.currentTheme = currentTheme;
           childProps.onThemeChange = setCurrentTheme;
        }

        return (
          <Window
            key={window.id}
            windowState={window}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onMaximize={handleMaximizeWindow}
            onFocus={handleFocusWindow}
            onUpdatePosition={handleUpdatePosition}
          >
            <app.component {...childProps} />
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        apps={APPS}
        runningAppIds={Array.from(new Set(windows.map(w => w.appId)))} // Unique running apps
        focusedAppId={activeWindowId ? windows.find(w => w.id === activeWindowId)?.appId || null : null}
        onLaunch={handleLaunchApp}
      />
    </div>
  );
};

export default App;
