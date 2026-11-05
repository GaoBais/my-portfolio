import assert from "node:assert/strict";
import test from "node:test";
import {
  ASCII_RAMP,
  ASCII_DARK_RAMP,
  samplePortrait,
} from "./sample-portrait.mjs";

function image(width, height, pixel) {
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) rgba.set(pixel(x, y), (y * width + x) * 4);
  return rgba;
}
const chunks = (result) => result.cells.flatMap((row) => row.match(/.{3}/g));

test("uniform black and white keep their endpoints inside the silhouette", () => {
  for (const value of [0, 255]) {
    const source = image(256, 160, () => [value, value, value, 255]);
    const original = source.slice();
    const result = samplePortrait(source, 256, 160);
    const visible = chunks(result).filter((cell) => cell !== "000");
    assert.ok(visible.length > 1000);
    assert.ok(visible.every((cell) => cell[0] === (value ? "1" : "f")));
    assert.ok(visible.every((cell) => cell[2] === (value ? "z" : "0")));
    assert.deepEqual(source, original);
    assert.equal(result.cells.length, 80);
    assert.ok(result.cells.every((row) => row.length === 128 * 3));
  }
});

test("area averaging removes a one-pixel checkerboard without producing stripes", () => {
  const source = image(256, 160, (x, y) => {
    const value = (x + y) % 2 ? 255 : 0;
    return [value, value, value, 255];
  });
  const result = samplePortrait(source, 256, 160);
  const interior = [];
  for (let row = 27; row < 47; row++)
    for (let col = 50; col < 80; col++)
      interior.push(result.cells[row].slice(col * 3, col * 3 + 3));
  assert.ok(interior.every((cell) => cell[1] === "z"));
  assert.ok(
    interior.every((cell) => Math.abs(parseInt(cell[2], 36) / 35 - 0.5) < 0.02)
  );
  assert.equal(new Set(interior.map((cell) => cell[0])).size, 1);
});

test("thin facial lines keep more contrast without darkening flat skin", () => {
  const source = image(256, 160, (x, y) => {
    const line = x >= 110 && x < 146 && (y === 68 || y === 132);
    const value = line ? 48 : 160;
    return [value, value, value, 255];
  });
  const result = samplePortrait(source, 256, 160);
  const tone = (row, col) => parseInt(result.cells[row][col * 3 + 2], 36) / 35;
  assert.ok(tone(34, 64) + 0.08 < tone(66, 64));
  assert.ok(Math.abs(tone(30, 64) - 160 / 255) < 1 / 35);
});

test("dark-theme highlights use denser characters instead of a negative image", () => {
  assert.equal(ASCII_DARK_RAMP.length, 36);
  const levels = [...ASCII_DARK_RAMP].map((glyph) => ASCII_RAMP.indexOf(glyph));
  assert.ok(levels.every((level, i) => level >= (levels[i - 1] ?? 1)));
  assert.equal(ASCII_DARK_RAMP[0], ".");
  assert.equal(ASCII_DARK_RAMP.at(-1), "M");
});

test("transparent pixels and background never become visible characters", () => {
  const clear = samplePortrait(
    image(64, 64, () => [255, 255, 255, 0]),
    64,
    64
  );
  assert.ok(chunks(clear).every((cell) => cell === "000"));
  const solid = samplePortrait(
    image(64, 64, () => [128, 128, 128, 255]),
    64,
    64
  );
  assert.ok(solid.cells[0].split("").every((char) => char === "0"));
  assert.equal(solid.cells[25].slice(0, 9), "000000000");
  assert.ok(chunks(solid).some((cell) => cell !== "000" && cell[1] !== "z"));
});

test("sampling is deterministic and rejects incomplete images", () => {
  const source = image(100, 100, (x) => [x * 2, x * 2, x * 2, 255]);
  assert.deepEqual(
    samplePortrait(source, 100, 100),
    samplePortrait(source, 100, 100)
  );
  assert.throws(() => samplePortrait(source, 99, 100), RangeError);
  assert.throws(() => samplePortrait(source, 100, 100, 0, 60), RangeError);
});
