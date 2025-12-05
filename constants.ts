import { AppConfig } from './types';
import { IconSparkles, IconFileText, IconSettings, IconCamera, IconGlobe } from './components/Icons';
import GeminiAssistant from './components/apps/GeminiAssistant';
import Notepad from './components/apps/Notepad';
import Settings from './components/apps/Settings';
import CameraApp from './components/apps/CameraApp';
import Browser from './components/apps/Browser';

export const APPS: AppConfig[] = [
  {
    id: 'ai-assistant',
    title: 'Nebula AI',
    icon: IconSparkles,
    component: GeminiAssistant,
    defaultWidth: 400,
    defaultHeight: 600,
  },
  {
    id: 'browser',
    title: 'Web',
    icon: IconGlobe,
    component: Browser,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  {
    id: 'notes',
    title: 'Notes',
    icon: IconFileText,
    component: Notepad,
    defaultWidth: 500,
    defaultHeight: 400,
  },
  {
    id: 'camera',
    title: 'Vision',
    icon: IconCamera,
    component: CameraApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: IconSettings,
    component: Settings,
    defaultWidth: 600,
    defaultHeight: 500,
  },
];

export const INITIAL_WALLPAPER = 'bg-gradient-to-br from-blue-900 via-slate-900 to-black';
