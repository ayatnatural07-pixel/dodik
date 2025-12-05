import React, { useRef, useEffect, useState } from 'react';
import { IconCamera } from '../Icons';

const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setActive(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please allow permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full w-full bg-black flex items-center justify-center relative overflow-hidden">
      {error ? (
        <div className="text-red-400 text-center p-4">
          <IconCamera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover transform scale-x-[-1]" // Mirror effect
          />
          {!active && <div className="absolute inset-0 flex items-center justify-center text-white">Initializing...</div>}
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button className="w-16 h-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20 transition-all shadow-lg active:scale-95"></button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraApp;
