export type AppID = 'ai-assistant' | 'notes' | 'settings' | 'camera' | 'browser';

export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC;
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  startX: number;
  startY: number;
  initialWindowX: number;
  initialWindowY: number;
  initialWidth: number;
  initialHeight: number;
}

export enum Theme {
  Default = 'Default',
  Aurora = 'Aurora',
  Midnight = 'Midnight',
  Sunset = 'Sunset'
}
