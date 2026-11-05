export function createPortraitStats() {
  return {
    fps: 59,
    confidence: 0.968,
    fpsTarget: 59,
    confidenceTarget: 0.968,
    fpsTargetAt: 0,
    confidenceTargetAt: 0,
    displayAt: 0,
    displayFps: 59,
    displayConfidence: 0.97,
  };
}

// Visual simulation: irregular targets followed by frame-rate-independent smoothing.
export function updatePortraitStats(
  stats: ReturnType<typeof createPortraitStats>,
  dt: number,
  elapsed: number,
  random = Math.random
) {
  if (dt <= 0) return;

  if (elapsed >= stats.fpsTargetAt) {
    stats.fpsTarget =
      random() < 0.15 ? 55 + random() * 2.2 : 58.4 + random() * 1.6;
    stats.fpsTargetAt = elapsed + 0.9 + random() * 2.1;
  }
  if (elapsed >= stats.confidenceTargetAt) {
    stats.confidenceTarget =
      random() < 0.2 ? 0.9603 + random() * 0.0038 : 0.9665 + random() * 0.0032;
    stats.confidenceTargetAt = elapsed + 1.8 + random() * 3;
  }

  stats.fps += (stats.fpsTarget - stats.fps) * (1 - Math.exp(-dt / 0.85));
  stats.confidence +=
    (stats.confidenceTarget - stats.confidence) * (1 - Math.exp(-dt / 1.1));

  if (elapsed < stats.displayAt) return;
  stats.displayAt = elapsed + 0.28 + random() * 0.3;
  // Separate switch thresholds keep rounded numbers from flickering at a boundary.
  if (Math.abs(stats.fps - stats.displayFps) > 0.65) {
    stats.displayFps += Math.max(
      -1,
      Math.min(1, Math.round(stats.fps) - stats.displayFps)
    );
  }
  if (stats.confidence < 0.964) stats.displayConfidence = 0.96;
  else if (stats.confidence > 0.966) stats.displayConfidence = 0.97;
}
