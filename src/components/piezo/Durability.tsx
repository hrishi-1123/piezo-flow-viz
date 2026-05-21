import { useMemo, useState } from "react";
import {
  Layers,
  ShieldCheck,
  Truck,
  Droplets,
  CalendarClock,
  Activity,
  Cpu,
  Hammer,
  Anchor,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Weight = {
  id: string;
  label: string;
  tons: number;
  short: string;
};

const WEIGHTS: Weight[] = [
  { id: "sedan", label: "Sedan", tons: 1.5, short: "1.5 T" },
  { id: "van", label: "Delivery Van", tons: 4, short: "4 T" },
  { id: "semi", label: "Semi-Truck", tons: 36, short: "36 T" },
];

const LAYERS = [
  {
    key: "rubber",
    title: "Heavy-Duty Textured Rubber Matting",
    role: "Traction · Waterproofing · Initial shock absorption",
    icon: Waves,
    swatch: "linear-gradient(135deg, oklch(0.32 0.04 280), oklch(0.22 0.03 280))",
    accent: "oklch(0.7 0.18 320)", // magenta
  },
  {
    key: "steel",
    title: "High-Tensile Steel Distribution Plate",
    role: "Disperses heavy-truck pressure evenly across sensors",
    icon: Hammer,
    swatch: "linear-gradient(135deg, oklch(0.78 0.04 230), oklch(0.55 0.04 230))",
    accent: "oklch(0.8 0.16 220)", // cyan
  },
  {
    key: "piezo",
    title: "High-Efficiency Circular Piezoelectric Tiles",
    role: "Energy capture & micro-second Δt timing data",
    icon: Cpu,
    swatch: "linear-gradient(135deg, oklch(0.55 0.18 250), oklch(0.42 0.2 270))",
    accent: "oklch(0.78 0.22 295)", // magenta-violet
  },
  {
    key: "base",
    title: "Reinforced Concrete / Asphalt Anchor Grid",
    role: "Structural anchor bonded into roadbed",
    icon: Anchor,
    swatch: "linear-gradient(135deg, oklch(0.3 0.01 250), oklch(0.2 0.01 250))",
    accent: "oklch(0.6 0.04 250)",
  },
] as const;

export function Durability() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [weight, setWeight] = useState<Weight>(WEIGHTS[0]);
  const [pulseKey, setPulseKey] = useState(0);

  const pickWeight = (w: Weight) => {
    setWeight(w);
    setPulseKey((k) => k + 1);
  };

  return (
    <section id="durability" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
          Durability & Engineering
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Built to Survive <span className="text-gradient-neon">Every Axle</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A multi-layer composite stack absorbs, redistributes and channels the load — so the
          sensitive piezo core only ever feels a flattened, predictable pressure curve.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Layered Stack */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Tile Cross-Section</h3>
            <span className="ml-auto text-[11px] uppercase tracking-widest text-muted-foreground">
              Hover to inspect
            </span>
          </div>

          <div className="relative h-[360px] flex items-center justify-center [perspective:1400px]">
            <div
              className="relative w-[78%] h-full"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(54deg) rotateZ(-28deg)",
              }}
            >
              {LAYERS.map((layer, i) => {
                const isHover = hovered === layer.key;
                const baseY = (i - 1.5) * 56;
                const liftY = isHover ? baseY - 22 : baseY;
                return (
                  <div
                    key={layer.key}
                    onMouseEnter={() => setHovered(layer.key)}
                    onMouseLeave={() => setHovered(null)}
                    className="absolute inset-x-0 top-1/2 h-16 rounded-xl border cursor-pointer transition-[transform,box-shadow,border-color] duration-500 ease-out"
                    style={{
                      transform: `translateY(${liftY}px) translateZ(${(3 - i) * 14}px)`,
                      background: layer.swatch,
                      borderColor: isHover
                        ? layer.accent
                        : "oklch(0.5 0.06 250 / 0.4)",
                      boxShadow: isHover
                        ? `0 12px 40px ${layer.accent} , 0 0 0 1px ${layer.accent}`
                        : "0 6px 18px oklch(0.1 0.02 250 / 0.55)",
                    }}
                  >
                    {/* texture / detail per layer */}
                    {layer.key === "rubber" && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-50"
                        style={{
                          backgroundImage:
                            "radial-gradient(oklch(0.95 0 0 / 0.18) 1px, transparent 1.6px)",
                          backgroundSize: "10px 10px",
                        }}
                      />
                    )}
                    {layer.key === "steel" && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-60"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, oklch(1 0 0 / 0.08) 0 2px, transparent 2px 14px)",
                        }}
                      />
                    )}
                    {layer.key === "piezo" && (
                      <div className="absolute inset-0 flex items-center justify-around px-6">
                        {Array.from({ length: 7 }).map((_, k) => (
                          <span
                            key={k}
                            className="h-7 w-7 rounded-full border"
                            style={{
                              background:
                                "radial-gradient(circle, oklch(0.9 0.18 295) 0%, oklch(0.5 0.18 270) 70%)",
                              borderColor: "oklch(0.85 0.18 295 / 0.7)",
                              boxShadow:
                                "inset 0 0 6px oklch(0.2 0.05 270), 0 0 8px oklch(0.7 0.2 295 / 0.5)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {layer.key === "base" && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-40"
                        style={{
                          backgroundImage:
                            "linear-gradient(45deg, oklch(0.5 0.02 250 / 0.4) 25%, transparent 25%, transparent 50%, oklch(0.5 0.02 250 / 0.4) 50%, oklch(0.5 0.02 250 / 0.4) 75%, transparent 75%, transparent)",
                          backgroundSize: "12px 12px",
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Impact pulse */}
              <div
                key={pulseKey}
                className="absolute left-1/2 -translate-x-1/2 -top-10 h-10 w-10 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.9 0.2 320) 0%, transparent 70%)",
                  animation: "float-up 1.1s ease-out",
                }}
              />
            </div>
          </div>

          {/* Layer labels */}
          <ol className="mt-6 space-y-2">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              const isHover = hovered === layer.key;
              return (
                <li
                  key={layer.key}
                  onMouseEnter={() => setHovered(layer.key)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all cursor-pointer ${
                    isHover
                      ? "bg-accent/10 border-accent/60"
                      : "bg-muted/20 border-border/50"
                  }`}
                >
                  <span
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-mono"
                    style={{
                      background: layer.swatch,
                      color: "oklch(0.98 0.01 240)",
                      boxShadow: `0 0 0 1px ${layer.accent}`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" style={{ color: layer.accent }} />
                      <span className="text-sm font-semibold">{layer.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{layer.role}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right column: KPIs + stress test */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Service Life & Durability</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Kpi
                icon={<Activity className="h-4 w-4" />}
                label="Structural Lifespan"
                value="10+ Years"
                sub="50M actuations"
              />
              <Kpi
                icon={<Truck className="h-4 w-4" />}
                label="Pressure Tolerance"
                value="40 Tons"
                sub="Class 8 heavy trucks"
              />
              <Kpi
                icon={<Droplets className="h-4 w-4" />}
                label="Weather Rating"
                value="IP68"
                sub="All-weather resilient"
              />
              <Kpi
                icon={<CalendarClock className="h-4 w-4" />}
                label="Maintenance"
                value="Predictive AI"
                sub="Self-diagnostic tiles"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Hammer className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Stress-Test Simulation</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Simulate vehicle weight impact across the stack.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {WEIGHTS.map((w) => {
                const active = w.id === weight.id;
                return (
                  <Button
                    key={w.id}
                    size="sm"
                    variant="outline"
                    onClick={() => pickWeight(w)}
                    aria-pressed={active}
                    className={`flex-col h-auto py-2 border-accent/40 hover:border-accent hover:bg-accent/10 ${
                      active ? "bg-accent/15 border-accent text-foreground" : ""
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {w.label}
                    </span>
                    <span className="text-sm font-semibold">{w.short}</span>
                  </Button>
                );
              })}
            </div>

            <PressureCurve weight={weight} pulseKey={pulseKey} />

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat
                label="Surface Load"
                value={`${weight.tons.toFixed(1)} T`}
                tone="magenta"
              />
              <Stat
                label="After Steel Plate"
                value={`${(weight.tons * 0.22).toFixed(2)} T/tile`}
                tone="cyan"
              />
              <Stat
                label="Core Stress"
                value={`${Math.min(100, (weight.tons / 40) * 22).toFixed(0)}%`}
                tone="ok"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center gap-1.5 text-primary mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold leading-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "magenta" | "cyan" | "ok";
}) {
  const color =
    tone === "magenta"
      ? "oklch(0.78 0.22 320)"
      : tone === "cyan"
        ? "oklch(0.82 0.15 220)"
        : "oklch(0.85 0.22 145)";
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-2 py-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function PressureCurve({ weight, pulseKey }: { weight: Weight; pulseKey: number }) {
  const W = 320;
  const H = 130;
  // Pre-steel: tall narrow spike. Post-steel: short wide bell.
  const peakIn = useMemo(() => Math.min(110, 30 + weight.tons * 2.2), [weight.tons]);
  const peakOut = useMemo(() => Math.min(60, 12 + weight.tons * 0.9), [weight.tons]);

  const spike = useMemo(() => buildBell(W, H, W / 2, peakIn, 14), [peakIn]);
  const dispersed = useMemo(() => buildBell(W, H, W / 2, peakOut, 70), [peakOut]);

  return (
    <div className="rounded-xl border border-border/60 bg-[oklch(0.15_0.02_250)] p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Pressure Distribution Curve
        </span>
        <div className="flex gap-3 text-[10px]">
          <Legend color="oklch(0.78 0.22 320)" label="Raw impact" />
          <Legend color="oklch(0.82 0.15 220)" label="After dispersion" />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" key={pulseKey}>
        <defs>
          <linearGradient id="rawFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.22 320)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.78 0.22 320)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dispFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 220)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.82 0.15 220)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={0}
            x2={W}
            y1={H * g}
            y2={H * g}
            stroke="oklch(0.4 0.03 250 / 0.3)"
            strokeDasharray="3 4"
          />
        ))}
        {/* baseline */}
        <line
          x1={0}
          x2={W}
          y1={H - 8}
          y2={H - 8}
          stroke="oklch(0.5 0.04 250 / 0.6)"
        />
        {/* raw spike */}
        <path
          d={spike.area}
          fill="url(#rawFill)"
          style={{ animation: "fade-in 0.5s ease-out" }}
        />
        <path
          d={spike.line}
          fill="none"
          stroke="oklch(0.78 0.22 320)"
          strokeWidth={2}
        />
        {/* dispersed */}
        <path
          d={dispersed.area}
          fill="url(#dispFill)"
          style={{ animation: "fade-in 0.7s ease-out" }}
        />
        <path
          d={dispersed.line}
          fill="none"
          stroke="oklch(0.82 0.15 220)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      {label}
    </span>
  );
}

function buildBell(
  W: number,
  H: number,
  cx: number,
  peak: number,
  sigma: number,
): { line: string; area: string } {
  const baseY = H - 8;
  const points: [number, number][] = [];
  const step = 4;
  for (let x = 0; x <= W; x += step) {
    const y = baseY - peak * Math.exp(-((x - cx) ** 2) / (2 * sigma * sigma));
    points.push([x, y]);
  }
  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${W} ${baseY} L0 ${baseY} Z`;
  return { line, area };
}
