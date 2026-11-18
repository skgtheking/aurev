/**
 * A short original three-note Aurev chime synthesized in Web Audio.
 * Invoked only inside a user's tap, never as unsolicited autoplay.
 */
export function playOpeningSound(): void {
  if (typeof window === "undefined" || !window.AudioContext) return;
  try {
    const ctx = new window.AudioContext();
    void ctx.resume();
    const notes = [392, 493.88, 587.33];
    notes.forEach((frequency, index) => {
      const at = ctx.currentTime + index * 0.13;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.035, at + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.47);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.5);
    });
    window.setTimeout(() => { void ctx.close(); }, 1300);
  } catch {
    // Sound must never stop onboarding or the demo.
  }
}
