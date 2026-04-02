// ═══════════════════════════════════════════
//   SOUND ENGINE (Web Audio API - no files needed)
// ═══════════════════════════════════════════

let audioCtx = null;
let sfxMuted = false;

const getCtx = () => {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

const playTone = (freq, duration = 0.08, vol = 0.12, type = "sine") => {
  if (sfxMuted) return;
  try {
    const ctx = getCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

export const setMuted = (muted) => { sfxMuted = muted; };
export const isMuted  = ()       => sfxMuted;

export const SFX = {
  tap:       () => playTone(800, 0.04, 0.08, "sine"),
  next:      () => playTone(600, 0.06, 0.06, "sine"),
  del:       () => playTone(300, 0.06, 0.07, "triangle"),
  submit:    () => playTone(500, 0.1,  0.1,  "sine"),

  stepComplete: () => {
    playTone(523, 0.12, 0.1, "sine");
    setTimeout(() => playTone(659, 0.12, 0.1,  "sine"), 100);
    setTimeout(() => playTone(784, 0.15, 0.12, "sine"), 200);
  },

  correct: () => {
    playTone(523, 0.15, 0.12, "sine");
    setTimeout(() => playTone(659,  0.12, 0.12, "sine"), 120);
    setTimeout(() => playTone(784,  0.12, 0.12, "sine"), 240);
    setTimeout(() => playTone(1047, 0.25, 0.15, "sine"), 360);
  },

  wrong: () => {
    playTone(350, 0.15, 0.1, "sawtooth");
    setTimeout(() => playTone(250, 0.2, 0.1, "sawtooth"), 150);
  },

  shake:     () => playTone(200, 0.12, 0.08, "square"),
  timerWarn: () => playTone(440, 0.08, 0.06, "square"),

  timeUp: () => {
    playTone(440, 0.2,  0.12, "sawtooth");
    setTimeout(() => playTone(350, 0.2,  0.12, "sawtooth"), 200);
    setTimeout(() => playTone(260, 0.35, 0.14, "sawtooth"), 400);
  },

  gameStart: () => {
    playTone(392, 0.1,  0.08, "sine");
    setTimeout(() => playTone(523, 0.1,  0.08, "sine"), 100);
    setTimeout(() => playTone(659, 0.15, 0.1,  "sine"), 200);
  },

  menuClick: () => playTone(660, 0.06, 0.06, "sine"),

  combo: () => {
    setTimeout(() => playTone(880,  0.08, 0.08, "sine"), 450);
    setTimeout(() => playTone(1100, 0.12, 0.1,  "sine"), 530);
  },
};
