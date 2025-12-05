import React, { useState } from 'react';
import { IconGlobe } from '../Icons';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://google.com');
  const [iframeSrc, setIframeSrc] = useState('https://www.google.com/webhp?igu=1'); // igu=1 allows some google embedding

  const handleGo = () => {
     // Simple check to make it safe-ish
     let target = url;
     if (!target.startsWith('http')) target = 'https://' + target;
     setIframeSrc(target);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2 p-2 border-b bg-gray-100">
        <div className="flex gap-1 mr-2">
             <div className="w-2 h-2 rounded-full bg-red-400"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
             <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <input 
          className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGo()}
        />
        <button onClick={handleGo} className="p-1 hover:bg-gray-200 rounded">
            <IconGlobe className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 relative">
          <iframe 
            src={iframeSrc} 
            className="w-full h-full border-none" 
            title="browser"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
          <div className="absolute inset-0 bg-white/50 pointer-events-none flex items-center justify-center backdrop-blur-sm" style={{ display: iframeSrc ? 'none' : 'flex' }}>
             <p className="text-gray-500">Enter a URL to browse (Note: Many sites block iframe embedding)</p>
          </div>
      </div>
    </div>
  );
};

export default Browser;
