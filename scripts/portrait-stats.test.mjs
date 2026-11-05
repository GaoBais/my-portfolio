import assert from "node:assert/strict";
import test from "node:test";
import {
  createPortraitStats,
  updatePortraitStats,
} from "../components/hero/portrait-stats.ts";

function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

test("readouts stay bounded, change by single FPS steps, and have irregular dwell times", () => {
  const stats = createPortraitStats();
  const random = seededRandom(42);
  const fpsValues = new Set();
  const confidenceValues = new Set();
  const changes = [];
  let previousFps = stats.displayFps;
  let previousConfidence = stats.displayConfidence;
  let previousChange = 0;
  for (let frame = 1; frame <= 180 * 60; frame++) {
    const time = frame / 60;
    updatePortraitStats(stats, 1 / 60, time, random);
    assert.ok(stats.fps >= 55 && stats.fps <= 60);
    assert.ok(stats.confidence >= 0.96 && stats.confidence <= 0.97);
    assert.ok(stats.displayFps >= 55 && stats.displayFps <= 60);
    assert.ok(Math.abs(stats.displayFps - previousFps) <= 1);
    assert.ok(
      stats.displayConfidence === 0.96 || stats.displayConfidence === 0.97
    );
    fpsValues.add(stats.displayFps);
    confidenceValues.add(stats.displayConfidence);
    if (stats.displayConfidence !== previousConfidence) {
      changes.push(time - previousChange);
      previousChange = time;
    }
    previousFps = stats.displayFps;
    previousConfidence = stats.displayConfidence;
  }
  assert.ok(fpsValues.size >= 4);
  assert.equal(confidenceValues.size, 2);
  assert.ok(changes.length >= 4);
  assert.ok(changes.every((duration) => duration > 0.8));
  assert.ok(
    new Set(changes.map((duration) => Math.round(duration * 10))).size >= 3
  );
});

test("a temporary dip recovers gradually with equivalent response at 30 and 120 Hz", () => {
  const results = [];
  for (const rate of [30, 120]) {
    const stats = createPortraitStats();
    stats.fpsTargetAt = Infinity;
    stats.confidenceTargetAt = Infinity;
    stats.fpsTarget = 55;
    stats.confidenceTarget = 0.961;
    updatePortraitStats(stats, 1 / rate, 1 / rate, () => 0.5);
    assert.ok(stats.fps > 58);
    for (let frame = 2; frame <= 4 * rate; frame++)
      updatePortraitStats(stats, 1 / rate, frame / rate, () => 0.5);
    assert.ok(stats.fps < 55.1);
    assert.equal(stats.displayConfidence, 0.96);
    stats.fpsTarget = 59.5;
    stats.confidenceTarget = 0.969;
    for (let frame = 4 * rate + 1; frame <= 8 * rate; frame++)
      updatePortraitStats(stats, 1 / rate, frame / rate, () => 0.5);
    assert.ok(stats.fps > 59.4);
    assert.equal(stats.displayConfidence, 0.97);
    results.push(stats);
  }
  assert.ok(Math.abs(results[0].fps - results[1].fps) < 1e-9);
  assert.ok(Math.abs(results[0].confidence - results[1].confidence) < 1e-9);
});

test("rounded confidence keeps its previous value inside the switching buffer", () => {
  for (const displayConfidence of [0.96, 0.97]) {
    const stats = createPortraitStats();
    Object.assign(stats, {
      confidence: 0.965,
      confidenceTarget: 0.965,
      confidenceTargetAt: Infinity,
      fpsTargetAt: Infinity,
      displayConfidence,
    });
    for (let frame = 1; frame <= 180; frame++)
      updatePortraitStats(stats, 1 / 60, frame / 60, () => 0.5);
    assert.equal(stats.displayConfidence, displayConfidence);
  }
});
