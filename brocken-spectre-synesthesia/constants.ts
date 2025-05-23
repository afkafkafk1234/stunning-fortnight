
import type { AudioParams } from './types';

export const GLORY_COLORS: string[] = [
  'rgba(255, 0, 0, 0.7)',    // Red
  'rgba(255, 165, 0, 0.7)', // Orange
  'rgba(255, 255, 0, 0.7)', // Yellow
  'rgba(0, 128, 0, 0.7)',   // Green
  'rgba(0, 0, 255, 0.7)',   // Blue
  'rgba(75, 0, 130, 0.7)',  // Indigo
  'rgba(238, 130, 238, 0.7)'// Violet
];

export const INITIAL_AUDIO_PARAMS: AudioParams = {
  basePitch: 110, // A2
  pitchRange: 440, // Puts max pitch at 550Hz (C#5)
  maxVolume: 0.3,
  pitch: 110,
  volume: 0,
};

export const SHADOW_PATH_SIMPLE: string = "M0,50 C0,20 20,0 50,0 S100,20 100,50 C100,80 80,100 50,100 S0,80 0,50 Z"; // Placeholder circle for head
export const SHADOW_PATH_HUMAN: string = 
  "M45,90 Q50,85 55,90 L60,95 Q50,100 40,95 Z " + // Feet (simplified)
  "M45,90 L40,60 Q40,50 50,50 Q60,50 60,60 L55,90 Z " + // Legs/Torso
  "M50,50 Q35,48 30,35 Q25,20 50,15 Q75,20 70,35 Q65,48 50,50 Z " + // Arms/Head
  "M50,15 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0"; // Head as a circle

export const MAX_GLORY_RADIUS_BASE: number = 150; // Base maximum radius for the outermost ring
export const NUM_GLORY_RINGS: number = GLORY_COLORS.length;
export const RING_SPACING_BASE: number = 10; // Base spacing between rings
