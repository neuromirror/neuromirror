"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Eraser, Highlighter, PenTool, RotateCcw, RotateCw, Trash2, X, Check, Grid, AlignJustify, Square } from "lucide-react";

export type CanvasBackground = "blank" | "ruled" | "grid" | "parchment" | "dark";
export type ToolType = "pen" | "highlighter" | "eraser";

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface Stroke {
  tool: ToolType;
  color: string;
  size: number;
  points: Point[];
}

const COLORS = [
  { name: "Ink", value: "#1e1e24" },
  { name: "Indigo", value: "#2563eb" },
  { name: "Crimson", value: "#dc2626" },
  { name: "Forest", value: "#16a34a" },
  { name: "Amber", value: "#d97706" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Highlighter Yellow", value: "rgba(250, 204, 21, 0.45)" },
  { name: "Highlighter Pink", value: "rgba(244, 114, 182, 0.45)" },
];

const STROKE_SIZES = [
  { label: "Fine", value: 2 },
  { label: "Medium", value: 4 },
  { label: "Bold", value: 8 },
  { label: "Chisel", value: 16 },
];

export function FreeformCanvas({
  initialData,
  onSaveAsImage,
  onSaveAsPage,
  onClose,
}: {
  initialData?: string | null;
  onSaveAsImage?: (dataUrl: string) => void;
  onSaveAsPage?: (dataUrl: string) => void;
  onClose?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [size, setSize] = useState<number>(4);
  const [background, setBackground] = useState<CanvasBackground>("ruled");
  const [isDrawing, setIsDrawing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const strokesRef = useRef<Stroke[]>([]);
  const undoneStrokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Redraw canvas with current background and all strokes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background
    if (background === "parchment") {
      ctx.fillStyle = "#faf6ed";
      ctx.fillRect(0, 0, width, height);
    } else if (background === "dark") {
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    const dpr = window.devicePixelRatio || 1;

    // Pattern / guidelines
    if (background === "ruled") {
      ctx.strokeStyle = background === "dark" ? "rgba(255,255,255,0.07)" : "rgba(59, 130, 246, 0.12)";
      ctx.lineWidth = 1 * dpr;
      const lineSpacing = 32 * dpr;
      for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (background === "grid") {
      ctx.fillStyle = background === "dark" ? "rgba(255,255,255,0.15)" : "rgba(100, 116, 139, 0.25)";
      const dotSpacing = 24 * dpr;
      const dotRadius = 1.2 * dpr;
      for (let x = dotSpacing; x < width; x += dotSpacing) {
        for (let y = dotSpacing; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw all strokes
    const allStrokes = [...strokesRef.current];
    if (currentStrokeRef.current) {
      allStrokes.push(currentStrokeRef.current);
    }

    for (const stroke of allStrokes) {
      if (stroke.points.length === 0) continue;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = stroke.size * 2 * dpr;
      } else if (stroke.tool === "highlighter") {
        ctx.globalCompositeOperation = "multiply";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * 3 * dpr;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * dpr;
      }

      if (stroke.points.length === 1) {
        const p = stroke.points[0];
        ctx.beginPath();
        const r = (stroke.size * (p.pressure || 0.5) * dpr) / 2;
        ctx.arc(p.x, p.y, Math.max(r, 1), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const prev = stroke.points[i - 1];
          const curr = stroke.points[i];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    setCanUndo(strokesRef.current.length > 0);
    setCanRedo(undoneStrokesRef.current.length > 0);
  }, [background]);

  // Resize canvas to match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const w = Math.floor(rect.width || 800);
    const h = Math.floor(Math.max(rect.height || 600, 520));

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    redraw();
  }, [redraw]);

  // Pointer event handlers for drawing
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.6;
    return { x, y, pressure };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);

    const pt = getCanvasPoint(e);
    const activeColor = tool === "highlighter" && !color.includes("rgba") ? "rgba(250, 204, 21, 0.45)" : color;

    const newStroke: Stroke = {
      tool,
      color: activeColor,
      size,
      points: [pt],
    };

    currentStrokeRef.current = newStroke;
    undoneStrokesRef.current = [];
    setIsDrawing(true);
    redraw();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();

    const pt = getCanvasPoint(e);
    currentStrokeRef.current.points.push(pt);
    redraw();
  };

  const finishDrawing = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e) {
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // pointer may already be released
      }
    }
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      strokesRef.current.push(currentStrokeRef.current);
    }
    currentStrokeRef.current = null;
    setIsDrawing(false);
    redraw();
  };

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    const popped = strokesRef.current.pop();
    if (popped) {
      undoneStrokesRef.current.push(popped);
      redraw();
    }
  };

  const handleRedo = () => {
    if (undoneStrokesRef.current.length === 0) return;
    const popped = undoneStrokesRef.current.pop();
    if (popped) {
      strokesRef.current.push(popped);
      redraw();
    }
  };

  const handleClear = () => {
    if (strokesRef.current.length === 0) return;
    if (window.confirm("Clear all drawings from this canvas?")) {
      strokesRef.current = [];
      undoneStrokesRef.current = [];
      redraw();
    }
  };

  const exportDataUrl = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  };

  const handleDownload = () => {
    const dataUrl = exportDataUrl();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `neuromirror-sketch-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full w-full rounded-xl border border-line bg-card shadow-soft overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper px-4 py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Tool selectors */}
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tool === "pen" ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"
            }`}
            title="Pen / Stylus"
          >
            <PenTool className="h-4 w-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>
          <button
            type="button"
            onClick={() => setTool("highlighter")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tool === "highlighter" ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"
            }`}
            title="Highlighter"
          >
            <Highlighter className="h-4 w-4" />
            <span className="hidden sm:inline">Highlight</span>
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tool === "eraser" ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"
            }`}
            title="Eraser"
          >
            <Eraser className="h-4 w-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <span className="mx-1 h-5 w-px bg-line" />

          {/* Color Palette */}
          {tool !== "eraser" && (
            <div className="flex items-center gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  className={`h-6 w-6 rounded-full border transition transform hover:scale-110 ${
                    color === c.value ? "ring-2 ring-accent ring-offset-2 border-transparent scale-105" : "border-line"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          )}

          <span className="mx-1 h-5 w-px bg-line" />

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            {STROKE_SIZES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSize(s.value)}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  size === s.value ? "bg-line-2 text-ink font-semibold" : "text-ink-3 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {/* Background styles */}
          <div className="flex items-center gap-0.5 rounded-lg border border-line p-0.5 mr-2">
            <button
              type="button"
              onClick={() => setBackground("ruled")}
              title="Ruled lines"
              className={`p-1.5 rounded ${background === "ruled" ? "bg-line-2 text-ink" : "text-ink-3 hover:text-ink"}`}
            >
              <AlignJustify className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setBackground("grid")}
              title="Dot grid"
              className={`p-1.5 rounded ${background === "grid" ? "bg-line-2 text-ink" : "text-ink-3 hover:text-ink"}`}
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setBackground("blank")}
              title="Blank canvas"
              className={`p-1.5 rounded ${background === "blank" ? "bg-line-2 text-ink" : "text-ink-3 hover:text-ink"}`}
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1.5 text-ink-3 hover:text-ink disabled:opacity-30 rounded hover:bg-paper-2"
            title="Undo"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1.5 text-ink-3 hover:text-ink disabled:opacity-30 rounded hover:bg-paper-2"
            title="Redo"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-ink-3 hover:text-clay rounded hover:bg-clay-soft"
            title="Clear canvas"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 text-ink-3 hover:text-ink rounded hover:bg-paper-2"
            title="Download PNG"
          >
            <Download className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-ink-3 hover:text-ink rounded hover:bg-paper-2 ml-1"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 min-h-[460px] bg-paper overflow-hidden cursor-crosshair touch-none select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrawing}
          onPointerCancel={finishDrawing}
          className="w-full h-full block"
        />
        <div className="absolute bottom-3 left-4 pointer-events-none rounded bg-card/80 backdrop-blur px-2.5 py-1 text-[11px] text-ink-3 border border-line">
          Stylus pressure sensitive • Touch or pen supported
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3">
        <p className="text-xs text-ink-3">
          Freeform drawings can be inserted directly into your entry or saved as a standalone sketch.
        </p>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink hover:bg-paper-2"
            >
              Cancel
            </button>
          )}
          {onSaveAsPage && (
            <button
              type="button"
              onClick={() => onSaveAsPage(exportDataUrl())}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-xs font-medium text-ink hover:bg-paper-2"
            >
              Save as Freeform Journal Page
            </button>
          )}
          {onSaveAsImage && (
            <button
              type="button"
              onClick={() => onSaveAsImage(exportDataUrl())}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" />
              Insert into Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
