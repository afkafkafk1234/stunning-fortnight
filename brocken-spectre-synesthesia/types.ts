
export interface AudioParams {
  pitch: number; // in Hz
  volume: number; // 0.0 to 1.0
  basePitch: number;
  pitchRange: number;
  maxVolume: number;
}

export interface GloryRing {
  radius: number;
  color: string;
  opacity: number;
}
