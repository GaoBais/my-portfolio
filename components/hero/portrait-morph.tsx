"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ASCII_CELLS, ASCII_COLS, ASCII_ROWS, ASCII_RAMP, ASCII_DARK_RAMP } from "./portrait-ascii-data";
import { createPortraitStats, updatePortraitStats } from "./portrait-stats";

export type PortraitMorphProps = {
  srcA: string;
  srcB: string;
  alt: string;
  className?: string;
};

// 按等宽字体的墨量递增，亮部留出细标点，暗部保留密字符。
const SCRAMBLE = ASCII_RAMP.trim();
const INTRO_MS = 1400;
const HOVER_RADIUS = 12; // 以字符格为单位

// 识别层配色：运行时从全局主题 Token 读取，随主题色和深浅模式自动同步。
type Palette = {
  accent: string;
  accentDim: string;
  accentGlow: string;
  accentClear: string;
  ink: string;
  inkDim: string;
  onAccent: string;
  backing: string;
};

// 石墨蓝的暗部、钴蓝的中间调；深色背景用冰蓝过渡到银白。
const TONE_TOKENS = {
  light: ["--blue-950", "--gray-800", "--blue-900", "--blue-800", "--gray-600"],
  dark: ["--gray-400", "--gray-300", "--blue-200", "--blue-100", "--gray-25"],
} as const;
const TOKEN_FALLBACK: Record<string, string> = {
  "--gray-25": "#fafbfd",
  "--gray-300": "#c3ccdb",
  "--gray-400": "#949fb4",
  "--gray-500": "#6a758b",
  "--gray-600": "#4d576b",
  "--gray-800": "#1f2636",
  "--blue-50": "#eef3ff",
  "--blue-100": "#dde7ff",
  "--blue-200": "#bfd0ff",
  "--blue-300": "#93b0ff",
  "--blue-400": "#5f86f7",
  "--blue-500": "#3d6af0",
  "--blue-600": "#2355e8",
  "--blue-700": "#1b44c6",
  "--blue-800": "#1a399f",
  "--blue-900": "#1b337d",
  "--blue-950": "#13204c",
  "--primary": "#2355e8",
  "--primary-foreground": "#ffffff",
  "--foreground": "#0b1220",
  "--background": "#ffffff",
};
const TONE_STEPS = 24;

type Rgb = [number, number, number];
const parseRgb = (input: string): Rgb | null => {
  const v = input.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex?.[1]) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
  }
  const nums = v.match(/^rgba?\(([^)]+)\)/i)?.[1]?.split(/[\s,/]+/).map(Number);
  if (nums && nums.length >= 3) return [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0];
  return null;
};
const rgba = ([r, g, b]: Rgb, a = 1) => `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${a})`;

// 以照片为 0-1 归一化坐标标注的人脸区域。
const FACE_BOX = { x0: 0.258, y0: 0.215, x1: 0.742, y1: 0.742 };

type Cell = {
  col: number;
  row: number;
  level: number;
  seed: number;
  fade: number;
  tone: number; // 0 暗 → 1 亮，来自照片亮度
  color: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const CELLS: Cell[] = (() => {
  const cells: Cell[] = [];
  for (let row = 0; row < ASCII_ROWS; row++) {
    const line = ASCII_CELLS[row] ?? "";
    for (let col = 0; col < ASCII_COLS; col++) {
      const chunk = line.slice(col * 3, col * 3 + 3);
      const level = parseInt(chunk.charAt(0) || "0", 16);
      if (!level) continue;
      const coverage = parseInt(chunk.charAt(1), 36) / 35;
      const tone = parseInt(chunk.charAt(2), 36) / 35;
      // 渐隐从下巴以下开始，保留脸部明暗，肩部仍融入背景。
      const y = (row + 0.5) / ASCII_ROWS;
      const x = (col + 0.5) / ASCII_COLS;
      const bottom = clamp((0.98 - y) / 0.22, 0, 1);
      const side = clamp((0.56 - Math.hypot((x - 0.5) * 1.15, Math.max(0, y - 0.52) * 1.7)) / 0.2, 0, 1);
      const fade = coverage * (y > 0.6 ? side * 0.75 + 0.25 : 1) * bottom * bottom;
      if (fade < 0.04) continue;
      cells.push({
        col,
        row,
        level,
        seed: Math.random(),
        fade,
        tone,
        color: "",
      });
    }
  }
  return cells;
})();

// 根据页面文字颜色判断当前是否为深色主题。
const isDarkText = (color: string) => {
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return false;
  const [r, g, b] = m.map(Number);
  return 0.299 * (r ?? 0) + 0.587 * (g ?? 0) + 0.114 * (b ?? 0) < 128;
};

const pad = (n: number, len = 2) => String(Math.floor(n)).padStart(len, "0");

export function PortraitMorph({ alt, className }: PortraitMorphProps): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    // 字符层离屏缓存：静止时只需贴图，避免每帧绘制数千个字符。
    const asciiLayer = document.createElement("canvas");
    const actx = asciiLayer.getContext("2d");
    if (!ctx || !actx) {
      container.removeChild(canvas);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily =
      getComputedStyle(container).getPropertyValue("--font-geist-mono").trim() ||
      "ui-monospace, monospace";

    let width = 1;
    let height = 1;
    // 小字符在 1× 屏幕上也使用 2× 画布，避免笔画被低分辨率栅格吞掉。
    const dpr = 2;
    let dark = false;
    let palette: Palette = {
      accent: "#2355e8",
      accentDim: "rgba(35, 85, 232, 0.35)",
      accentGlow: "rgba(35, 85, 232, 0.12)",
      accentClear: "rgba(35, 85, 232, 0)",
      ink: "rgba(11, 18, 32, 0.75)",
      inkDim: "rgba(11, 18, 32, 0.4)",
      onAccent: "#ffffff",
      backing: "rgba(255, 255, 255, 0.88)",
    };
    let layerDirty = true;

    const pointer = { x: 0.5, y: 0.5, active: false };
    const reticle = { x: 0.5, y: 0.5 };
    let hover = 0; // 0-1，控制字符扰动与鼠标准星
    const start = performance.now();
    let last = start;
    let raf = 0;
    const stats = createPortraitStats();

    const readTheme = () => {
      dark = !isDarkText(getComputedStyle(container).color);
      const root = getComputedStyle(document.documentElement);
      const token = (name: string): Rgb =>
        parseRgb(root.getPropertyValue(name)) ??
        parseRgb(TOKEN_FALLBACK[name] ?? "#000000") ?? [0, 0, 0];

      const accent = token("--primary");
      const fg = token("--foreground");
      palette = {
        accent: rgba(accent),
        accentDim: rgba(accent, 0.38),
        accentGlow: rgba(accent, 0.12),
        accentClear: rgba(accent, 0),
        ink: rgba(fg, 0.75),
        inkDim: rgba(fg, 0.4),
        onAccent: rgba(token("--primary-foreground")),
        backing: rgba(token("--background"), 0.88),
      };

      // 预先生成色阶查找表，避免逐格插值。
      const stops = TONE_TOKENS[dark ? "dark" : "light"].map(token);
      const lut: string[] = [];
      for (let i = 0; i < TONE_STEPS; i++) {
        const t = (i / (TONE_STEPS - 1)) * (stops.length - 1);
        const k = Math.min(stops.length - 2, Math.floor(t));
        const f = t - k;
        const a = stops[k] ?? [0, 0, 0];
        const b = stops[k + 1] ?? a;
        lut.push(rgba([0, 1, 2].map((j) => (a[j] ?? 0) + ((b[j] ?? 0) - (a[j] ?? 0)) * f) as Rgb));
      }
      for (const cell of CELLS) {
        cell.color = lut[Math.round(cell.tone * (TONE_STEPS - 1))] ?? palette.accent;
      }
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      for (const c of [canvas, asciiLayer]) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      actx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTheme();
      layerDirty = true;
      if (!raf) frame(performance.now());
    };

    const drawAscii = (target: CanvasRenderingContext2D, now: number, intro: number) => {
      const cellW = width / ASCII_COLS;
      const cellH = height / ASCII_ROWS;
      target.clearRect(0, 0, width, height);
      target.font = `600 ${cellH * 1.18}px ${fontFamily}`;
      target.textAlign = "center";
      target.textBaseline = "middle";

      const tick = Math.floor(now / 70);
      const px = (pointer.x * width) / cellW;
      const py = (pointer.y * height) / cellH;

      for (const cell of CELLS) {
        // 入场：自上而下逐行解码，未到达的格子显示随机字符。
        const reveal = (cell.row / ASCII_ROWS) * 0.75 + cell.seed * 0.25;
        if (intro < reveal * 0.6) continue;

        let glyph = dark
          ? ASCII_DARK_RAMP.charAt(Math.round(cell.tone * 35))
          : ASCII_RAMP.charAt(cell.level);
        let alpha = cell.fade;
        let color = cell.color;
        let dx = 0;
        let dy = 0;

        if (intro < reveal) {
          glyph = SCRAMBLE.charAt(Math.floor((cell.seed * 97 + tick) % SCRAMBLE.length));
          color = palette.accent;
          alpha *= 0.6;
        } else if (hover > 0.01) {
          const ox = cell.col + 0.5 - px;
          const oy = (cell.row + 0.5 - py) * (cellH / cellW);
          const dist = Math.hypot(ox, oy);
          if (dist < HOVER_RADIUS) {
            const falloff = (1 - dist / HOVER_RADIUS) * hover;
            if (cell.seed < falloff * 0.9) {
              glyph = SCRAMBLE.charAt(Math.floor((cell.seed * 131 + tick) % SCRAMBLE.length));
              color = palette.accent;
            }
            const push = falloff * falloff * 0.9;
            dx = (ox / (dist || 1)) * push * cellW;
            dy = (oy / (dist || 1)) * push * cellW;
          }
        }

        target.globalAlpha = alpha;
        target.fillStyle = color;
        const x = Math.round(((cell.col + 0.5) * cellW + dx) * dpr) / dpr;
        const y = Math.round(((cell.row + 0.5) * cellH + dy) * dpr) / dpr;
        target.fillText(glyph, x, y, cellW * 0.95);
      }
      target.globalAlpha = 1;
    };

    const label = (
      text: string,
      x: number,
      y: number,
      size: number,
      color: string,
      align: CanvasTextAlign = "left",
    ) => {
      ctx.font = `600 ${size}px ${fontFamily}`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    const corners = (x0: number, y0: number, x1: number, y1: number, k: number) => {
      ctx.beginPath();
      for (const [x, y, sx, sy] of [
        [x0, y0, 1, 1],
        [x1, y0, -1, 1],
        [x0, y1, 1, -1],
        [x1, y1, -1, -1],
      ] as const) {
        ctx.moveTo(x, y + sy * k);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * k, y);
      }
      ctx.stroke();
    };

    // 识别面板常驻，扫描和锁定动画从页面载入时开始。
    const drawHud = (now: number) => {
      const t = reduceMotion ? 1.1 : (now - start) / 1000;
      const s = width / 420; // 以 420px 宽度为基准缩放
      const m = 10 * s;
      const fs = Math.max(8, 10 * s);
      const p = palette;
      ctx.globalAlpha = 1;

      // 启动识别：一道扫描线自上而下扫过一次。
      if (t < 1.1) {
        const scanY = (t / 1.1) * height;
        const band = ctx.createLinearGradient(0, scanY - 50 * s, 0, scanY);
        band.addColorStop(0, p.accentClear);
        band.addColorStop(1, p.accentGlow);
        ctx.fillStyle = band;
        ctx.fillRect(0, scanY - 50 * s, width, 50 * s);
        ctx.fillStyle = p.accentDim;
        ctx.fillRect(0, scanY, width, 1);
      }

      // 取景角标与状态信息
      ctx.strokeStyle = p.inkDim;
      ctx.lineWidth = 1;
      corners(m, m, width - m, height - m, 14 * s);

      const blink = Math.floor(t * 1.6) % 2 === 0;
      ctx.fillStyle = blink ? p.accent : p.accentDim;
      ctx.beginPath();
      ctx.arc(m + 14 * s, m + 16 * s, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      label("REC  CAM-01", m + 22 * s, m + 16 * s, fs, p.ink);
      label(`${stats.displayFps} FPS · GPU`, width - m - 8 * s, m + 16 * s, fs, p.accent, "right");
      const frameNo = Math.floor(t * 25) % 25;
      const tc = `${pad(t / 3600)}:${pad((t / 60) % 60)}:${pad(t % 60)}:${pad(frameNo)}`;
      label(tc, m + 8 * s, height - m - 16 * s, fs, p.ink);
      label("DETECT · TRACK", width - m - 8 * s, height - m - 16 * s, fs, p.inkDim, "right");

      // 人脸检测框：从略大处收紧到脸部，并带轻微抖动。
      const lock = 1 - Math.pow(1 - clamp(t / 0.6, 0, 1), 3);
      const grow = (1 - lock) * 0.08;
      const jx = Math.sin(t * 2.3) * 1.2 * s;
      const jy = Math.cos(t * 1.7) * 1.2 * s;
      const bx0 = (FACE_BOX.x0 - grow) * width + jx;
      const by0 = (FACE_BOX.y0 - grow) * height + jy;
      const bx1 = (FACE_BOX.x1 + grow) * width + jx;
      const by1 = (FACE_BOX.y1 + grow) * height + jy;
      ctx.strokeStyle = p.accentDim;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 1.5 * s;
      corners(bx0, by0, bx1, by1, 14 * s);

      if (lock > 0.95) {
        const tag = `HU HENGXING  ${stats.displayConfidence.toFixed(2)}`;
        ctx.font = `700 ${fs}px ${fontFamily}`;
        const tw = ctx.measureText(tag).width + 12 * s;
        const th = fs + 8 * s;
        ctx.fillStyle = p.accent;
        ctx.fillRect(bx0, by0 - th, tw, th);
        label(tag, bx0 + 6 * s, by0 - th / 2, fs, p.onAccent);
        const sub = "ID #0001 · AI ENGINEER";
        ctx.font = `600 ${fs * 0.9}px ${fontFamily}`;
        const sh = fs + 6 * s;
        ctx.fillStyle = p.backing;
        ctx.fillRect(bx0, by1 + 3 * s, ctx.measureText(sub).width + 12 * s, sh);
        label(sub, bx0 + 6 * s, by1 + 3 * s + sh / 2, fs * 0.9, p.accent);

      }

      // 鼠标追踪准星
      ctx.globalAlpha = hover;
      const rx = reticle.x * width;
      const ry = reticle.y * height;
      const r = 16 * s;
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.moveTo(rx - r - 6 * s, ry);
      ctx.lineTo(rx - r + 6 * s, ry);
      ctx.moveTo(rx + r - 6 * s, ry);
      ctx.lineTo(rx + r + 6 * s, ry);
      ctx.moveTo(rx, ry - r - 6 * s);
      ctx.lineTo(rx, ry - r + 6 * s);
      ctx.moveTo(rx, ry + r - 6 * s);
      ctx.lineTo(rx, ry + r + 6 * s);
      ctx.stroke();
      label(
        `X ${pad(reticle.x * 1920, 4)}  Y ${pad(reticle.y * 1080, 4)}`,
        rx + r + 8 * s,
        ry - r,
        fs * 0.9,
        p.ink,
      );
      ctx.globalAlpha = 1;
    };

    // 返回是否仍需继续动画
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduceMotion) updatePortraitStats(stats, dt, (now - start) / 1000);

      hover += ((pointer.active ? 1 : 0) - hover) * (1 - Math.exp(-6 * dt));
      if (!pointer.active && hover < 0.01) hover = 0;
      reticle.x += (pointer.x - reticle.x) * (1 - Math.exp(-10 * dt));
      reticle.y += (pointer.y - reticle.y) * (1 - Math.exp(-10 * dt));

      const intro = reduceMotion ? 1 : Math.min(1, (now - start) / INTRO_MS);
      const asciiAnimating = intro < 1 || hover > 0;
      if (asciiAnimating || layerDirty) {
        drawAscii(actx, now, intro);
        layerDirty = asciiAnimating;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(asciiLayer, 0, 0, width, height);
      drawHud(now);
      return !reduceMotion;
    };

    const loop = (now: number) => {
      raf = frame(now) ? requestAnimationFrame(loop) : 0;
    };
    const ensureLoop = () => {
      if (!raf && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const updatePointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      pointer.y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    };
    const onPointerEnter = (e: PointerEvent) => {
      if (reduceMotion) return;
      updatePointer(e);
      if (hover < 0.05) {
        reticle.x = pointer.x;
        reticle.y = pointer.y;
      }
      pointer.active = true;
      ensureLoop();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      updatePointer(e);
      if (!pointer.active) onPointerEnter(e);
    };
    const onPointerLeave = () => {
      pointer.active = false;
      ensureLoop();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    // 主题切换时（html 的 class / data-theme 变化）重新取色并重绘。
    const themeObserver = new MutationObserver(resize);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    resize();

    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // 等待等宽字体加载后再开始，避免首帧字符宽度跳动。
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      layerDirty = true;
      frame(performance.now());
      ensureLoop();
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
}
