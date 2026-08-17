class SoundController {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  playArcaneChime(frequency = 528, duration = 0.4) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Browser may block audio until a gesture; keep silent.
    }
  }

  playHoverWhisper() {
    if (!this.enabled) return;
    this.playArcaneChime(880, 0.15);
  }

  playCastSpell() {
    if (!this.enabled) return;
    this.playArcaneChime(432, 0.5);
    window.setTimeout(() => this.playArcaneChime(648, 0.4), 100);
  }
}

export const soundFx = new SoundController();
