import React from 'react';
import { AppConfig, AppID } from '../types';

interface TaskbarProps {
  apps: AppConfig[];
  runningAppIds: AppID[];
  focusedAppId: AppID | null;
  onLaunch: (appId: AppID) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ apps, runningAppIds, focusedAppId, onLaunch }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-end gap-3 px-4 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl">
        {apps.map((app) => {
          const isRunning = runningAppIds.includes(app.id);
          const isFocused = focusedAppId === app.id; // Could be used for specific active style
          
          return (
            <button
              key={app.id}
              onClick={() => onLaunch(app.id)}
              className="group relative flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-2 active:scale-95"
            >
              <div 
                className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300
                  ${app.id === 'ai-assistant' ? 'from-blue-500 to-indigo-600' : ''}
                  ${app.id === 'notes' ? 'from-yellow-400 to-orange-500' : ''}
                  ${app.id === 'settings' ? 'from-gray-600 to-slate-800' : ''}
                  ${app.id === 'camera' ? 'from-green-400 to-emerald-600' : ''}
                  ${app.id === 'browser' ? 'from-cyan-400 to-blue-500' : ''}
                `}
              >
                <app.icon className="text-white w-7 h-7 drop-shadow-md" />
              </div>
              
              {/* Dot indicator for running apps */}
              <div className={`w-1.5 h-1.5 rounded-full bg-white/80 transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-0'}`} />
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {app.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Taskbar;
