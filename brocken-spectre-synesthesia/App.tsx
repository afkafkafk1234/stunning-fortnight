
import React, { useState, useEffect, useCallback } from 'react';
import { BrockenSpectreView } from './components/BrockenSpectreView';
import { useSynesthesiaAudio } from './hooks/useSynesthesiaAudio';
import { GLORY_COLORS, INITIAL_AUDIO_PARAMS } from './constants';
import type { AudioParams } from './types';

const App: React.FC = () => {
  const [intensity, setIntensity] = useState<number>(0); // 0 to 1
  const [audioParams, setAudioParams] = useState<AudioParams>(INITIAL_AUDIO_PARAMS);
  const [isInteracted, setIsInteracted] = useState<boolean>(false);

  const { playSound, stopSound, updateSound } = useSynesthesiaAudio();

  const handleInteraction = useCallback(() => {
    if (!isInteracted) {
      playSound();
      setIsInteracted(true);
    }
  }, [isInteracted, playSound]);

  useEffect(() => {
    // Start animation loop
    let animationFrameId: number;
    const animate = () => {
      const time = Date.now();
      // Intensity cycles smoothly between 0.1 and 1.0 over ~15 seconds
      const newIntensity = (Math.sin(time / 5000) + 1) / 2 * 0.9 + 0.1;
      setIntensity(newIntensity);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const newPitch = INITIAL_AUDIO_PARAMS.basePitch + (intensity * INITIAL_AUDIO_PARAMS.pitchRange);
    const newVolume = intensity * INITIAL_AUDIO_PARAMS.maxVolume;
    const newParams = { 
        pitch: newPitch, 
        volume: newVolume,
        basePitch: INITIAL_AUDIO_PARAMS.basePitch,
        pitchRange: INITIAL_AUDIO_PARAMS.pitchRange,
        maxVolume: INITIAL_AUDIO_PARAMS.maxVolume,
    };
    setAudioParams(newParams);
    if (isInteracted) {
      updateSound(newParams);
    }
  }, [intensity, updateSound, isInteracted]);
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);


  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 text-white relative cursor-pointer"
      onClick={handleInteraction}
      role="application"
      aria-label="Brocken Spectre Synesthesia Experience"
    >
      {!isInteracted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black bg-opacity-50">
          <p className="text-2xl font-semibold mb-4 animate-pulse">Tap or Click to Begin</p>
          <p className="text-sm text-gray-300">Enable sound for the full experience</p>
        </div>
      )}
      <header className="absolute top-0 left-0 p-6 z-10">
        <h1 className="text-3xl font-thin tracking-wider text-gray-300">Brocken Spectre</h1>
        <p className="text-sm text-purple-300">A Synesthetic Journey</p>
      </header>
      
      <BrockenSpectreView intensity={intensity} gloryColors={GLORY_COLORS} />

      <footer className="absolute bottom-0 right-0 p-4 text-xs text-gray-500 z-10">
        <p>Intensity: {intensity.toFixed(2)}</p>
        <p>Pitch: {audioParams.pitch.toFixed(0)} Hz | Volume: {audioParams.volume.toFixed(2)}</p>
      </footer>
    </div>
  );
};

export default App;
