import React, { useState, useEffect, useRef } from 'react';
import { WindowState } from '../types';
import { IconX, IconMinus, IconMaximize, IconSquare } from './Icons';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number, w: number, h: number) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ 
  windowState, onClose, onMinimize, onMaximize, onFocus, onUpdatePosition, children 
}) => {
  const { id, x, y, width, height, title, zIndex, isMinimized, isMaximized } = windowState;
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Handle Drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return; // Cannot drag if maximized
    e.preventDefault();
    onFocus(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y
    });
  };

  // Handle Resize Start
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(id);
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: width, h: height });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdatePosition(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y, width, height);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newW = Math.max(300, resizeStart.w + deltaX);
        const newH = Math.max(200, resizeStart.h + deltaY);
        onUpdatePosition(id, x, y, newW, newH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, id, x, y, width, height, onUpdatePosition]);

  if (isMinimized) return null;

  const style: React.CSSProperties = isMaximized 
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 64px)', zIndex, transform: 'none', borderRadius: 0 }
    : { top: y, left: x, width, height, zIndex };

  return (
    <div 
      ref={windowRef}
      className={`absolute flex flex-col bg-os-panel backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-75 ${!isMaximized ? 'rounded-xl' : ''}`}
      style={style}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-3 bg-white/5 border-b border-white/5 select-none cursor-default"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(id)}
      >
        <div className="text-sm font-medium text-white/90 truncate flex items-center gap-2 pointer-events-none">
          {title}
        </div>
        <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => onMinimize(id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors">
            <IconMinus className="w-4 h-4" />
          </button>
          <button onClick={() => onMaximize(id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors">
            {isMaximized ? <IconSquare className="w-3.5 h-3.5" /> : <IconMaximize className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => onClose(id)} className="p-1.5 hover:bg-red-500/80 rounded-md text-white/70 hover:text-white transition-colors group">
            <IconX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/50">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center z-50 group"
          onMouseDown={handleResizeStart}
        >
           <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-blue-400 transition-colors"></div>
        </div>
      )}
    </div>
  );
};

export default Window;
