import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Zap,
  Gauge,
  Car,
  Play,
  Pause,
  Flame,
  Shuffle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Direction = "SB" | "NB";

type Vehicle = {
  id: number;
  lane: number; // 0..3 ; 0-1 = Southbound (top, R->L), 2-3 = Northbound (bottom, L->R)
  dir: Direction;
  speed: number; // mph
  progress: number; // 0..1 along travel direction
  vSpeed: number;
};

type SpeedEvent = {
  id: number;
  lane: number;
  dir: Direction;
  speed: number;
  at: number;
};

const LANES = [
  { idx: 0, dir: "SB" as Direction, name: "SB Lane 1" },
  { idx: 1, dir: "SB" as Direction, name: "SB Lane 2" },
  { idx: 2, dir: "NB" as Direction, name: "NB Lane 1" },
  { idx: 3, dir: "NB" as Direction, name: "NB Lane 2" },
];

const DIR_COLOR: Record<Direction, string> = {
  SB: "var(--magenta)",
  NB: "var(--cyan)",
};

export function SimulationDashboard() {
  const [running, setRunning] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // counts indexed by lane 0..3
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [energySB, setEnergySB] = useState(0);
  const [energyNB, setEnergyNB] = useState(0);
  const [events, setEvents] = useState<SpeedEvent[]>([]);
  const [spikeLanes, setSpikeLanes] = useState<Set<number>>(new Set());
  const [rushHour, setRushHour] = useState(false);
  const nextId = useRef(100);
  const triggered = useRef<Set<string>>(new Set());

  // Spawn vehicles
  useEffect(() => {
    if (!running) return;
    const activeSpikes = rushHour ? [0, 1, 2, 3] : Array.from(spikeLanes);
    const spawn = () => {
      const newOnes: Vehicle[] = [];
      if (activeSpikes.length > 0) {
        for (const lane of activeSpikes) {
          newOnes.push(makeVehicle(lane, ++nextId.current));
        }
        if (Math.random() < 0.35) {
          const lane = Math.floor(Math.random() * 4);
          newOnes.push(makeVehicle(lane, ++nextId.current));
        }
      } else {
        const lane = Math.floor(Math.random() * 4);
        newOnes.push(makeVehicle(lane, ++nextId.current));
      }
      setVehicles((v) => [...v, ...newOnes]);
    };
    const baseInterval = rushHour ? 260 : activeSpikes.length > 0 ? 360 : 950;
    const t = setInterval(spawn, baseInterval + Math.random() * 200);
    return () => clearInterval(t);
  }, [running, spikeLanes, rushHour]);

  // Animation loop
  useEffect(() => {
    if (!running) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setVehicles((vs) => {
        const updated: Vehicle[] = [];
        for (const v of vs) {
          const np = v.progress + v.vSpeed * (dt / 16);
          if (np >= 1) continue;
          // sensor crossings at 35% and 65% along travel direction
          const k1 = `${v.id}-s1`;
          const k2 = `${v.id}-s2`;
          if (v.progress < 0.35 && np >= 0.35 && !triggered.current.has(k1)) {
            triggered.current.add(k1);
            const pulse = 0.5 + Math.random() * 0.3;
            if (v.dir === "SB") setEnergySB((e) => e + pulse);
            else setEnergyNB((e) => e + pulse);
          }
          if (v.progress < 0.65 && np >= 0.65 && !triggered.current.has(k2)) {
            triggered.current.add(k2);
            const pulse = 0.5 + Math.random() * 0.3;
            if (v.dir === "SB") setEnergySB((e) => e + pulse);
            else setEnergyNB((e) => e + pulse);
            setCounts((c) => {
              const nc = [...c];
              nc[v.lane] += 1;
              return nc;
            });
            setEvents((evts) =>
              [
                { id: v.id, lane: v.lane, dir: v.dir, speed: v.speed, at: Date.now() },
                ...evts,
              ].slice(0, 7),
            );
          }
          updated.push({ ...v, progress: np });
        }
        return updated;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Density decay
  useEffect(() => {
    const t = setInterval(() => {
      setCounts((c) => c.map((n) => Math.max(0, n - 1)));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const toggleSpike = (lane: number) => {
    setSpikeLanes((prev) => {
      const next = new Set(prev);
      if (next.has(lane)) next.delete(lane);
      else next.add(lane);
      return next;
    });
  };
  const triggerRushHour = () => {
    setRushHour(true);
    setTimeout(() => setRushHour(false), 6000);
  };
  const triggerRandomMulti = () => {
    const lanes = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, 2);
    setSpikeLanes(new Set(lanes));
    setTimeout(() => setSpikeLanes(new Set()), 4000);
  };

  const totalEnergy = energySB + energyNB;
  // baseline 1.8M kWh display, scaled by live joules
  const kwhDisplay = (1.8 + totalEnergy / 1000).toFixed(2);
  const sbShare = totalEnergy > 0 ? (energySB / totalEnergy) * 100 : 50;
  const nbShare = 100 - sbShare;

  return (
    <section id="dashboard" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/80">Live Simulation</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Real-Time Traffic <span className="text-gradient-neon">Intelligence</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A continuous dense field of circular piezo plates paves every lane —
          tracking bidirectional flow, harvesting energy, and feeding the edge AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Highway */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Highway 101 (Multi-Directional)</h3>
              <span className="text-xs text-muted-foreground ml-2 hidden md:inline">
                Continuous Circular Array · 4-Lane Dual Flow
              </span>
            </div>
            <Button
              size="sm"
              variant={running ? "secondary" : "default"}
              onClick={() => setRunning((r) => !r)}
              className="gap-2"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </Button>
          </div>

          {/* Platform labels */}
          <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1">
            <span style={{ color: "var(--magenta)" }} className="flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Southbound Platform
            </span>
            <span className="text-muted-foreground">Direction of travel</span>
          </div>

          {/* Southbound platform (top, R -> L, magenta) */}
          <Platform dir="SB">
            {[0, 1].map((lane) => (
              <Lane
                key={lane}
                lane={lane}
                dir="SB"
                vehicles={vehicles.filter((v) => v.lane === lane)}
              />
            ))}
          </Platform>

          {/* Median */}
          <div className="my-3 h-1 rounded-full bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Northbound platform (bottom, L -> R, cyan) */}
          <Platform dir="NB">
            {[2, 3].map((lane) => (
              <Lane
                key={lane}
                lane={lane}
                dir="NB"
                vehicles={vehicles.filter((v) => v.lane === lane)}
              />
            ))}
          </Platform>

          <div className="flex justify-between text-[10px] uppercase tracking-widest mt-1">
            <span className="text-muted-foreground">Direction of travel</span>
            <span style={{ color: "var(--cyan)" }} className="flex items-center gap-1">
              Northbound Platform <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Controls */}
          <div className="mt-5 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LANES.map((l) => {
                const active = spikeLanes.has(l.idx) || rushHour;
                const color = l.dir === "SB" ? "var(--magenta)" : "var(--cyan)";
                return (
                  <Button
                    key={l.idx}
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSpike(l.idx)}
                    aria-pressed={active}
                    className="border-border hover:bg-muted/50"
                    style={
                      active
                        ? { borderColor: color, color, background: `color-mix(in oklab, ${color} 12%, transparent)` }
                        : undefined
                    }
                  >
                    <Car className="h-4 w-4 mr-1" /> {l.name}
                  </Button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={triggerRushHour}
                aria-pressed={rushHour}
                className={`gap-2 ${
                  rushHour
                    ? "bg-primary text-primary-foreground shadow-neon"
                    : "bg-primary/90 text-primary-foreground hover:bg-primary"
                }`}
              >
                <Flame className="h-4 w-4" />
                {rushHour ? "Rush Hour Active…" : "Simulate Rush Hour"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={triggerRandomMulti}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Random Multi-Lane Burst
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics panel */}
        <div className="space-y-6">
          {/* Energy Generation */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden ring-1 ring-primary/30">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
            <div className="flex items-center gap-2 text-primary mb-2">
              <Zap className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Energy Generation
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight">{kwhDisplay} M kWh</div>
            <div className="text-xs text-muted-foreground mt-1">
              Aggregate · self-powered grid
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <DirRow
                label="Southbound Flow"
                dir="SB"
                pct={sbShare}
                joules={energySB}
              />
              <DirRow
                label="Northbound Flow"
                dir="NB"
                pct={nbShare}
                joules={energyNB}
              />
            </div>
          </div>

          {/* Real-time Vehicle Speeds */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Real-time Vehicle Speeds</h3>
            </div>
            <div className="space-y-2 text-xs font-mono">
              {events.length === 0 && (
                <div className="text-muted-foreground">Awaiting Δt readings…</div>
              )}
              {events.map((e) => {
                const color = e.dir === "SB" ? "var(--magenta)" : "var(--cyan)";
                const laneInDir = e.dir === "SB" ? e.lane + 1 : e.lane - 1;
                return (
                  <div
                    key={e.id + "-" + e.at}
                    className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted/40 border border-border/50"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          color,
                          background: `color-mix(in oklab, ${color} 18%, transparent)`,
                          border: `1px solid color-mix(in oklab, ${color} 50%, transparent)`,
                        }}
                      >
                        [{e.dir}]
                      </span>
                      <span className="text-muted-foreground">
                        Lane {laneInDir} · Continuous Circular Array
                      </span>
                    </span>
                    <span style={{ color }} className="font-semibold">
                      {e.speed} mph
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Directional Data Split */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Directional Data Split</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">
              Data consistency across flow directions
            </p>

            <div className="space-y-3">
              {LANES.map((l) => {
                const color = l.dir === "SB" ? "var(--magenta)" : "var(--cyan)";
                const total = counts.reduce((a, b) => a + b, 0) || 1;
                const pct = Math.min(100, (counts[l.idx] / total) * 100);
                return (
                  <div key={l.idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        <span style={{ color }} className="font-semibold">
                          [{l.dir}]
                        </span>{" "}
                        {l.name}
                      </span>
                      <span style={{ color }}>{counts[l.idx]} veh</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: color,
                          boxShadow: `0 0 10px ${color}`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function makeVehicle(lane: number, id: number): Vehicle {
  const dir: Direction = lane < 2 ? "SB" : "NB";
  // SB ~62 mph baseline, NB ~71 mph baseline (per spec) ± variance
  const base = dir === "SB" ? 62 : 71;
  const speed = Math.max(30, Math.round(base + (Math.random() * 16 - 8)));
  return {
    id,
    lane,
    dir,
    speed,
    progress: 0,
    vSpeed: 0.0035 + speed / 22000,
  };
}

function DirRow({
  label,
  dir,
  pct,
  joules,
}: {
  label: string;
  dir: Direction;
  pct: number;
  joules: number;
}) {
  const color = DIR_COLOR[dir];
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
          <span className="text-muted-foreground">
            {label} <span style={{ color }}>({dir === "SB" ? "Magenta" : "Cyan"})</span>
          </span>
        </span>
        <span style={{ color }}>{joules.toFixed(1)} J</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </div>
  );
}

function Platform({ dir, children }: { dir: Direction; children: React.ReactNode }) {
  const color = DIR_COLOR[dir];
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
        boxShadow: `inset 0 0 30px color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      <div className="space-y-[2px]">{children}</div>
    </div>
  );
}

function Lane({
  lane,
  dir,
  vehicles,
}: {
  lane: number;
  dir: Direction;
  vehicles: Vehicle[];
}) {
  const color = DIR_COLOR[dir];
  const pavementClass = dir === "SB" ? "piezo-pavement-mag" : "piezo-pavement-cyan";
  const laneInDir = dir === "SB" ? lane + 1 : lane - 1;

  return (
    <div
      className={`relative h-20 overflow-hidden ${pavementClass}`}
      style={{
        borderTop: `1px dashed color-mix(in oklab, ${color} 35%, transparent)`,
      }}
    >
      {/* Lane label */}
      <div
        className="absolute top-1.5 left-2 text-[9px] uppercase tracking-widest z-20 font-semibold"
        style={{ color }}
      >
        [{dir}] Lane {laneInDir}
      </div>

      {/* Active glow tile rows where vehicles currently are */}
      {vehicles.map((v) => {
        // For SB (R->L) progress 0 = right edge, 1 = left edge → leftPct = 100 - p*100
        // For NB (L->R) progress 0 = left edge, 1 = right edge → leftPct = p*100
        const xPct = dir === "SB" ? 100 - v.progress * 100 : v.progress * 100;
        return (
          <div key={`glow-${v.id}`}>
            {/* trail */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: dir === "SB" ? `${xPct}%` : 0,
                width: dir === "SB" ? `${100 - xPct}%` : `${xPct}%`,
                background:
                  dir === "SB"
                    ? `linear-gradient(to right, color-mix(in oklab, ${color} 28%, transparent), transparent 60%)`
                    : `linear-gradient(to left, color-mix(in oklab, ${color} 28%, transparent), transparent 60%)`,
                mixBlendMode: "screen",
              }}
            />
            {/* hot tile pulse under vehicle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-full pointer-events-none"
              style={{
                left: `${xPct}%`,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
                opacity: 0.55,
                mixBlendMode: "screen",
                filter: "blur(2px)",
              }}
            />
          </div>
        );
      })}

      {/* Vehicles + labels */}
      {vehicles.map((v) => {
        const xPct = dir === "SB" ? 100 - v.progress * 100 : v.progress * 100;
        return (
          <div
            key={v.id}
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{ left: `${xPct}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="flex items-center gap-2" style={{
              flexDirection: dir === "SB" ? "row-reverse" : "row",
            }}>
              <Car
                className="h-6 w-6"
                fill="currentColor"
                style={{
                  color,
                  filter: `drop-shadow(0 0 6px ${color})`,
                  transform: dir === "SB" ? "scaleX(-1)" : undefined,
                }}
              />
              <div
                className="hidden md:block text-[9px] font-mono leading-tight px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{
                  color,
                  background: `color-mix(in oklab, ${color} 14%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${color} 45%, transparent)`,
                }}
              >
                <div>Speed: {v.speed} mph</div>
                <div className="opacity-80">
                  Flow: {dir === "SB" ? "Southbound" : "Northbound"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
