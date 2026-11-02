/**
 * Audio Synthesizer for Suraksha Alert
 * Uses Web Audio API & Web Speech API to provide zero-dependency audio effects:
 * - Emergency Siren
 * - Realistic Phone Ringtone
 * - Safe Check-in Chime
 * - Fake Call In-Call Voice Simulator
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isSirenPlaying = false;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isRingPlaying = false;
    this.ringInterval = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pleasant check-in chime
  playCheckInChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Emergency Siren Simulation
  startSiren() {
    try {
      this.initContext();
      if (!this.ctx || this.isSirenPlaying) return;

      this.isSirenPlaying = true;
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();

      this.sirenOsc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      this.sirenGain.gain.setValueAtTime(0.12, now);

      // Pitch sweep up and down
      const cycleTime = 1.2;
      let curr = now;
      for (let i = 0; i < 20; i++) {
        this.sirenOsc.frequency.setValueAtTime(650, curr);
        this.sirenOsc.frequency.linearRampToValueAtTime(950, curr + cycleTime / 2);
        this.sirenOsc.frequency.linearRampToValueAtTime(650, curr + cycleTime);
        curr += cycleTime;
      }

      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.ctx.destination);
      this.sirenOsc.start();
    } catch (e) {
      console.warn("Siren audio error:", e);
    }
  }

  stopSiren() {
    if (this.isSirenPlaying && this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch (e) {}
      this.isSirenPlaying = false;
      this.sirenOsc = null;
    }
  }

  // Realistic Phone Ringing Sound for Fake Call
  startPhoneRingtone() {
    try {
      this.initContext();
      if (!this.ctx || this.isRingPlaying) return;
      this.isRingPlaying = true;

      const playRingBurst = () => {
        if (!this.isRingPlaying) return;
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 440; // A4
        osc2.frequency.value = 480; // Standard US/UK ring tone

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 1.6);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
      };

      playRingBurst();
      this.ringInterval = setInterval(() => {
        if (this.isRingPlaying) {
          playRingBurst();
        }
      }, 3500);
    } catch (e) {
      console.warn("Ringtone error:", e);
    }
  }

  stopPhoneRingtone() {
    this.isRingPlaying = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Simulated Voice Caller using Web Speech Synthesis
  speakCallerMessage(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

window.soundFx = new SoundEffects();
