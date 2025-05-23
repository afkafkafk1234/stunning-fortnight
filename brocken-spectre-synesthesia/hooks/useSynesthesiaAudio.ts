
import { useCallback, useRef, useEffect } from 'react';
import type { AudioParams } from '../types';
import { INITIAL_AUDIO_PARAMS } from '../constants';


interface SynesthesiaAudioControl {
  playSound: () => void;
  stopSound: () => void;
  updateSound: (params: AudioParams) => void;
}

export const useSynesthesiaAudio = (): SynesthesiaAudioControl => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (!oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine'; 
      oscillatorRef.current.frequency.setValueAtTime(INITIAL_AUDIO_PARAMS.basePitch, audioContextRef.current.currentTime);
    }

    if (!gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime); // Start silent
    }

    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const playSound = useCallback(() => {
    initAudio(); // Ensure audio is initialized

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (oscillatorRef.current && !isPlayingRef.current) {
      try {
        oscillatorRef.current.start();
        isPlayingRef.current = true;
      } catch (e) {
        // Handle error if start() was already called, though isPlayingRef should prevent this.
        // For safety, re-initialize if it fails due to being stopped.
        if (e instanceof DOMException && e.name === 'InvalidStateError' && oscillatorRef.current) {
            // If oscillator was stopped, it cannot be restarted. Create a new one.
            oscillatorRef.current.disconnect();
            oscillatorRef.current = null; // Force re-creation
            gainNodeRef.current?.disconnect(); // Disconnect old gain node if it exists
            gainNodeRef.current = null; // Force re-creation
            initAudio(); // Re-initialize and connect
            if(oscillatorRef.current) { // If re-init was successful
                 oscillatorRef.current.start();
                 isPlayingRef.current = true;
            }
        } else {
            console.error("Error starting oscillator:", e);
        }
      }
    }
  }, [initAudio]);

  const stopSound = useCallback(() => {
    if (oscillatorRef.current && isPlayingRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        console.error("Error stopping oscillator:", e);
      }
      isPlayingRef.current = false;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      // Don't close context immediately, allow reuse.
      // audioContextRef.current.close(); 
      // audioContextRef.current = null;
    }
  }, []);

  const updateSound = useCallback((params: AudioParams) => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current && isPlayingRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      // Using setTargetAtTime for smoother transitions
      oscillatorRef.current.frequency.setTargetAtTime(params.pitch, currentTime, 0.05);
      gainNodeRef.current.gain.setTargetAtTime(params.volume, currentTime, 0.1);
    } else if (!isPlayingRef.current && audioContextRef.current) {
        // If not playing, set initial values for when it starts
        if (oscillatorRef.current) oscillatorRef.current.frequency.value = params.pitch;
        if (gainNodeRef.current) gainNodeRef.current.gain.value = params.volume;
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    const currentOscillator = oscillatorRef.current;
    const currentGainNode = gainNodeRef.current;
    const currentAudioContext = audioContextRef.current;

    return () => {
      if (currentOscillator && isPlayingRef.current) {
        try {
          currentOscillator.stop();
        } catch(e) { /* ignore */ }
      }
      if (currentGainNode) {
        currentGainNode.disconnect();
      }
      if (currentOscillator) {
        currentOscillator.disconnect();
      }
      // It's generally better practice to not close the AudioContext
      // if the app might resume audio later, but if it's a definitive cleanup:
      // if (currentAudioContext && currentAudioContext.state !== 'closed') {
      //   currentAudioContext.close();
      // }
      // Reset refs
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      // audioContextRef.current = null; // Keep context for potential reuse if app remounts
      isPlayingRef.current = false;
    };
  }, []);

  return { playSound, stopSound, updateSound };
};
