"use client";
/**
 * Optional sound (default OFF). Everything is synthesised with WebAudio, so there are no audio files:
 * - click(): a light-switch click
 * - a very quiet low "gym ambience" bed (filtered brown noise) while sound is on
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type SoundApi = { enabled: boolean; toggle: () => void; click: () => void };
const SoundContext = createContext<SoundApi>({ enabled: false, toggle: () => {}, click: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const ambienceRef = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(null);

  const ctx = () => (ctxRef.current ??= new AudioContext());

  const startAmbience = () => {
    const ac = ctx();
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; // brown noise
      data[i] = last * 3.5;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    const gain = ac.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 1.5);
    src.connect(lp).connect(gain).connect(ac.destination);
    src.start();
    ambienceRef.current = { src, gain };
  };

  const stopAmbience = () => {
    const a = ambienceRef.current;
    if (!a || !ctxRef.current) return;
    const t = ctxRef.current.currentTime;
    a.gain.gain.cancelScheduledValues(t);
    a.gain.gain.setValueAtTime(a.gain.gain.value, t);
    a.gain.gain.linearRampToValueAtTime(0, t + 0.4);
    a.src.stop(t + 0.45);
    ambienceRef.current = null;
  };

  const playClick = useCallback(() => {
    const ac = ctx();
    const t = ac.currentTime;
    // sharp mechanical snap
    const len = Math.floor(ac.sampleRate * 0.03);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const n = ac.createBufferSource();
    n.buffer = buf;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600;
    bp.Q.value = 1.4;
    const g = ac.createGain();
    g.gain.value = 0.5;
    n.connect(bp).connect(g).connect(ac.destination);
    n.start(t);
    // body thump
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.06);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.25, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(og).connect(ac.destination);
    o.start(t);
    o.stop(t + 0.1);
  }, []);

  const toggle = () => {
    const next = !enabled;
    if (next) {
      void ctx().resume();
      playClick();
      if (!ambienceRef.current) startAmbience();
    } else {
      stopAmbience();
    }
    setEnabled(next);
  };

  const click = useCallback(() => {
    if (enabled) playClick();
  }, [enabled, playClick]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const api = useMemo(() => ({ enabled, toggle, click }), [enabled, click]);
  return <SoundContext.Provider value={api}>{children}</SoundContext.Provider>;
}
