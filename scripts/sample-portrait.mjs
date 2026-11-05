import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// shortcut: this outline is calibrated to huhengxing.jpg; recalibrate for another photo.
const OUTLINE = [
  null,
  null,
  null,
  [52, 54],
  [45, 65],
  [42, 69],
  [41, 67],
  [39, 74],
  [38, 75],
  [34, 76],
  [33, 76],
  [31, 77],
  [30, 76],
  [29, 77],
  [28, 80],
  [28, 80],
  [28, 81],
  [28, 81],
  [27, 80],
  [28, 80],
  [28, 82],
  [28, 82],
  [28, 82],
  [29, 83],
  [29, 83],
  [30, 85],
  [30, 85],
  [29, 84],
  [29, 84],
  [31, 83],
  [32, 83],
  [32, 83],
  [32, 83],
  [32, 83],
  [32, 83],
  [32, 83],
  [32, 83],
  [33, 82],
  [33, 82],
  [33, 81],
  [34, 81],
  [35, 81],
  [35, 81],
  [31, 92],
  [29, 94],
  [25, 97],
  [21, 99],
  [18, 107],
  [14, 110],
  [12, 111],
  [9, 112],
  [7, 112],
  [5, 112],
  [1, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
  [0, 112],
];
const OUTLINE_COLS = 112;
export const ASCII_RAMP = " .:;!*vcohX%H9BM";
// Measured in Geist Mono 600; a monotonic ramp avoids stripes in skin midtones.
const GLYPH_INK = [
  0, 21.3, 42.6, 54.1, 77, 97.6, 124.4, 135.3, 154.4, 168.1, 181, 190.7, 208.2,
  221.1, 233.1, 255.2,
];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function inkLevel(ink) {
  const target = Math.pow(clamp(ink), 0.8) * GLYPH_INK.at(-1);
  let level = 1;
  for (let i = 2; i < GLYPH_INK.length; i++) {
    if (Math.abs(GLYPH_INK[i] - target) < Math.abs(GLYPH_INK[level] - target))
      level = i;
  }
  return level;
}

export const ASCII_DARK_RAMP = Array.from(
  { length: 36 },
  (_, tone) => ASCII_RAMP[inkLevel(tone / 35)]
).join("");

function foregroundCoverage(x, y, sourceWidth) {
  const position = y * OUTLINE.length - 0.5;
  const row = Math.floor(position);
  const a = OUTLINE[row];
  const b = OUTLINE[Math.min(row + 1, OUTLINE.length - 1)] ?? a;
  if (!a || !b) return 0;
  const fraction = position - row;
  const left = (a[0] + (b[0] - a[0]) * fraction) / OUTLINE_COLS;
  const right = (a[1] + (b[1] - a[1]) * fraction) / OUTLINE_COLS;
  const feather = 1 / sourceWidth;
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  return (
    smooth((x - left + feather) / (2 * feather)) *
    smooth((right - x + feather) / (2 * feather))
  );
}

export function samplePortrait(rgba, width, height, cols = 128, rows = 80) {
  if (
    ![width, height, cols, rows].every(
      (value) => Number.isInteger(value) && value > 0
    ) ||
    rgba.length !== width * height * 4
  ) {
    throw new RangeError(
      "Expected complete RGBA pixels and positive integer dimensions"
    );
  }

  const alpha = new Float32Array(width * height);
  const luma = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const p = index * 4;
      alpha[index] =
        (rgba[p + 3] / 255) *
        foregroundCoverage((x + 0.5) / width, (y + 0.5) / height, width);
      luma[index] =
        (0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2]) / 255;
    }
  }

  const means = new Float32Array(cols * rows);
  const deviations = new Float32Array(cols * rows);
  const coverage = new Float32Array(cols * rows);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = col * cellWidth;
      const x1 = (col + 1) * cellWidth;
      const y0 = row * cellHeight;
      const y1 = (row + 1) * cellHeight;
      let area = 0;
      let sum = 0;
      let squareSum = 0;
      for (let y = Math.floor(y0); y < Math.min(height, Math.ceil(y1)); y++) {
        for (let x = Math.floor(x0); x < Math.min(width, Math.ceil(x1)); x++) {
          const overlap =
            (Math.min(x + 1, x1) - Math.max(x, x0)) *
            (Math.min(y + 1, y1) - Math.max(y, y0));
          const weight = overlap * alpha[y * width + x];
          area += weight;
          sum += luma[y * width + x] * weight;
          squareSum += luma[y * width + x] ** 2 * weight;
        }
      }
      const index = row * cols + col;
      coverage[index] = area / (cellWidth * cellHeight);
      means[index] = area > 0 ? sum / area : 1;
      deviations[index] =
        area > 0
          ? Math.sqrt(Math.max(0, squareSum / area - (sum / area) ** 2))
          : 0;
    }
  }

  // Calibrate to the face so the dark jacket cannot flatten the facial tones.
  const face = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + 0.5) / cols;
      const y = (row + 0.5) / rows;
      const index = row * cols + col;
      if (
        x >= 0.27 &&
        x <= 0.76 &&
        y >= 0.21 &&
        y <= 0.76 &&
        coverage[index] > 0.95
      )
        face.push(means[index]);
    }
  }
  face.sort((a, b) => a - b);
  let blackPoint = face[Math.floor((face.length - 1) * 0.02)] ?? 0;
  let whitePoint = face[Math.floor((face.length - 1) * 0.995)] ?? 1;
  if (whitePoint - blackPoint < 0.15) {
    blackPoint = 0;
    whitePoint = 1;
  }

  const cells = [];
  for (let row = 0; row < rows; row++) {
    let line = "";
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      if (coverage[index] < 0.08) {
        line += "000";
        continue;
      }
      let sum = 0;
      let weights = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = col + dx;
          const y = row + dy;
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          const neighbor = y * cols + x;
          const weight =
            (dx === 0 ? 2 : 1) * (dy === 0 ? 2 : 1) * coverage[neighbor];
          sum += means[neighbor] * weight;
          weights += weight;
        }
      }
      const blur = weights > 0 ? sum / weights : means[index];
      const x = (col + 0.5) / cols;
      const y = (row + 0.5) / rows;
      // shortcut: these soft regions fit this photo's eyes, nose and lips; recalibrate with the outline.
      const feature = Math.max(
        clamp(1 - ((x - 0.5) / 0.24) ** 2 - ((y - 0.43) / 0.11) ** 2),
        clamp(1 - ((x - 0.5) / 0.09) ** 2 - ((y - 0.54) / 0.12) ** 2),
        clamp(1 - ((x - 0.505) / 0.14) ** 2 - ((y - 0.625) / 0.065) ** 2)
      );
      const detail = means[index] - blur;
      // Recover thin dark lines only at coherent edges, not uniform texture/noise.
      const enhanced =
        means[index] +
        (0.35 + feature * 1.1) * detail -
        feature * 0.65 * deviations[index] * clamp(-detail * 10);
      const tone = clamp((enhanced - blackPoint) / (whitePoint - blackPoint));
      const level = inkLevel(1 - tone);
      line +=
        level.toString(16) +
        Math.round(clamp(coverage[index]) * 35).toString(36) +
        Math.round(tone * 35).toString(36);
    }
    cells.push(line);
  }
  return { cols, rows, cells, blackPoint, whitePoint };
}

async function generate() {
  const require = createRequire(import.meta.url);
  const sharp = createRequire(require.resolve("next/package.json"))("sharp");
  const image = await readFile(
    new URL("../public/huhengxing.jpg", import.meta.url)
  );
  const { data, info } = await sharp(image)
    .rotate()
    .toColourspace("srgb")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const result = samplePortrait(data, info.width, info.height);
  const hash = createHash("sha256").update(image).digest("hex").slice(0, 16);
  const generated = [
    "// 由 node scripts/sample-portrait.mjs 从 public/huhengxing.jpg 重新采样。",
    "// 原图 " +
      info.width +
      "×" +
      info.height +
      "，SHA-256 前缀 " +
      hash +
      "；轮廓沿用该照片的标定。",
    "// 每格 3 个字符：墨量等级(1-f，0 为空) + 轮廓覆盖度 + 归一化亮度（后二者为 base36）。",
    "export const ASCII_RAMP = " + JSON.stringify(ASCII_RAMP) + ";",
    "export const ASCII_DARK_RAMP = " + JSON.stringify(ASCII_DARK_RAMP) + ";",
    "export const ASCII_COLS = " + result.cols + ";",
    "export const ASCII_ROWS = " + result.rows + ";",
    "",
    "export const ASCII_CELLS: readonly string[] = [",
    ...result.cells.map((line) => "  " + JSON.stringify(line) + ","),
    "];",
    "",
  ].join("\n");
  await writeFile(
    new URL("../components/hero/portrait-ascii-data.ts", import.meta.url),
    generated
  );
  const levels = Array(ASCII_RAMP.length).fill(0);
  for (const line of result.cells)
    for (let i = 0; i < line.length; i += 3) levels[parseInt(line[i], 16)]++;
  console.log(
    JSON.stringify(
      {
        source: [info.width, info.height],
        grid: [result.cols, result.rows],
        blackPoint: result.blackPoint,
        whitePoint: result.whitePoint,
        levels,
      },
      null,
      2
    )
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await generate();
