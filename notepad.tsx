import React, { useState, useEffect } from 'react';

const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nebula-notepad');
    if (saved) setContent(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setContent(newVal);
    localStorage.setItem('nebula-notepad', newVal);
    
    const now = new Date();
    setLastSaved(now.toLocaleTimeString());
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white">
        <span className="text-xs text-gray-400 font-mono">UTF-8</span>
        <span className="text-xs text-green-600 font-medium">
          {lastSaved ? `Saved at ${lastSaved}` : 'Ready'}
        </span>
      </div>
      <textarea
        className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm bg-gray-50 text-gray-800"
        placeholder="Start typing..."
        value={content}
        onChange={handleChange}
        spellCheck={false}
      />
    </div>
  );
};

export default Notepad;
