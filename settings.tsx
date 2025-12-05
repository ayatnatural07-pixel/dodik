import React from 'react';
import { Theme } from '../../types';

interface SettingsProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { id: Theme.Default, name: 'Nebula Default', colors: 'from-blue-900 via-slate-900 to-black' },
    { id: Theme.Aurora, name: 'Aurora Borealis', colors: 'from-green-400 via-cyan-900 to-blue-900' },
    { id: Theme.Midnight, name: 'Midnight Purple', colors: 'from-indigo-900 via-purple-900 to-slate-900' },
    { id: Theme.Sunset, name: 'Electric Sunset', colors: 'from-orange-500 via-red-900 to-slate-900' },
  ];

  return (
    <div className="h-full bg-slate-100 dark:bg-slate-800 p-6 text-slate-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <section className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Personalization</h3>
        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                currentTheme === theme.id ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent hover:scale-105'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors}`}></div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-transparent transition-colors">
                <span className="text-white font-medium text-sm drop-shadow-md">{theme.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">About</h3>
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
          <p className="font-semibold">NebulaOS v1.0</p>
          <p className="text-sm text-slate-500 mt-1">Web-based Desktop Environment simulation.</p>
          <p className="text-xs text-slate-400 mt-4">Powered by React, Tailwind & Gemini API.</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
