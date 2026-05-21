import { useEffect, useRef, useState } from "react";
import { Activity, Zap, Gauge, Car, Play, Pause, AlertTriangle, Flame, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Vehicle = {
  id: number;
  lane: 0 | 1 | 2;
  speed: number; // mph
  progress: number; // 0..1
  vSpeed: number; // animation speed
};

type SpeedEvent = { id: number; lane: number; speed: number; at: number };

const LANE_NAMES = ["Lane 1", "Lane 2", "Lane 3"];

export function SimulationDashboard() {
  const [running, setRunning] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [counts, setCounts] = useState<[number, number, number]>([0, 0, 0]);
  const [energy, setEnergy] = useState(0);
  const [events, setEvents] = useState<SpeedEvent[]>([]);
  const [spikeLanes, setSpikeLanes] = useState<Set<number>>(new Set());
  const [rushHour, setRushHour] = useState(false);
  const nextId = useRef(100);
  const triggered = useRef<Set<string>>(new Set());

  // Spawn vehicles — supports simultaneous multi-lane spikes
  useEffect(() => {
    if (!running) return;
    const activeSpikes = rushHour ? [0, 1, 2] : Array.from(spikeLanes);
    const spawnBurst = () => {
      const newOnes: Vehicle[] = [];
      if (activeSpikes.length > 0) {
        // simultaneously spawn one vehicle in each active spike lane
        for (const lane of activeSpikes) {
          const speed = Math.round(35 + Math.random() * 50);
          const id = ++nextId.current;
          newOnes.push({
            id,
            lane: lane as 0 | 1 | 2,
            speed,
            progress: 0,
            vSpeed: 0.004 + speed / 18000,
          });
        }
        // occasional extra random vehicle for organic feel
        if (Math.random() < 0.4) {
          const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
          const speed = Math.round(35 + Math.random() * 50);
          newOnes.push({
            id: ++nextId.current,
            lane,
            speed,
            progress: 0,
            vSpeed: 0.004 + speed / 18000,
          });
        }
      } else {
        const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        const speed = Math.round(35 + Math.random() * 50);
        newOnes.push({
          id: ++nextId.current,
          lane,
          speed,
          progress: 0,
          vSpeed: 0.004 + speed / 18000,
        });
      }
      setVehicles((v) => [...v, ...newOnes]);
    };
    const baseInterval = rushHour ? 280 : activeSpikes.length > 0 ? 380 : 1100;
    const t = setInterval(spawnBurst, baseInterval + Math.random() * 250);
    return () => clearInterval(t);
  }, [running, spikeLanes, rushHour]);

  // Animate
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
          // sensor crossings at 35% and 60%
          const key1 = `${v.id}-s1`;
          const key2 = `${v.id}-s2`;
          if (v.progress < 0.35 && np >= 0.35 && !triggered.current.has(key1)) {
            triggered.current.add(key1);
            // energy pulse on plate 1
            setEnergy((e) => e + 0.4 + Math.random() * 0.3);
          }
          if (v.progress < 0.6 && np >= 0.6 && !triggered.current.has(key2)) {
            triggered.current.add(key2);
            setEnergy((e) => e + 0.4 + Math.random() * 0.3);
            setCounts((c) => {
              const nc = [...c] as [number, number, number];
              nc[v.lane] += 1;
              return nc;
            });
            setEvents((evts) =>
              [{ id: v.id, lane: v.lane, speed: v.speed, at: Date.now() }, ...evts].slice(0, 6),
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

  // Decay density window (last ~12s)
  useEffect(() => {
    const t = setInterval(() => {
      setCounts((c) => c.map((n) => Math.max(0, n - 1)) as [number, number, number]);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const total = counts[0] + counts[1] + counts[2] || 1;
  const congestedLane = counts.indexOf(Math.max(...counts));

  const triggerSpike = (lane: number) => {
    setSpikeLane(lane);
    setTimeout(() => setSpikeLane(null), 4000);
  };

  return (
    <section id="dashboard" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/80">Live Simulation</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Real-Time Traffic <span className="text-gradient-neon">Intelligence</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Watch vehicles cross piezoelectric plates, generating power and feeding speed &
          density analytics to the AI edge model.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Highway */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">3-Lane Highway · Piezo Grid</h3>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={running ? "secondary" : "default"}
                onClick={() => setRunning((r) => !r)}
                className="gap-2"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pause" : "Start"} Simulation
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((lane) => (
              <Lane
                key={lane}
                lane={lane}
                vehicles={vehicles.filter((v) => v.lane === lane)}
                congested={lane === congestedLane && counts[lane] > 2}
              />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((l) => (
              <Button
                key={l}
                size="sm"
                variant="outline"
                onClick={() => triggerSpike(l)}
                className="border-primary/40 hover:border-primary hover:bg-primary/10"
              >
                <Car className="h-4 w-4 mr-1" /> Spike {LANE_NAMES[l]}
              </Button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-6">
          <MetricCard
            icon={<Zap className="h-5 w-5" />}
            label="Energy Harvested"
            value={`${energy.toFixed(2)} J`}
            sub="Self-powered sensors"
            highlight
          />
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Lane Density</h3>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((l) => {
                const pct = Math.min(100, (counts[l] / total) * 100);
                const isMax = l === congestedLane && counts[l] > 0;
                return (
                  <div key={l}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{LANE_NAMES[l]}</span>
                      <span className={isMax ? "text-primary font-semibold" : ""}>
                        {counts[l]} veh
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMax ? "bg-primary shadow-neon" : "bg-accent"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {counts[congestedLane] > 2 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                <AlertTriangle className="h-4 w-4" />
                Most congested: {LANE_NAMES[congestedLane]}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Speed Feed</h3>
            </div>
            <div className="space-y-2 text-sm font-mono">
              {events.length === 0 && (
                <div className="text-muted-foreground text-xs">Awaiting Δt readings…</div>
              )}
              {events.map((e) => (
                <div
                  key={e.id + "-" + e.at}
                  className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted/40 border border-border/50"
                >
                  <span className="text-muted-foreground">Vehicle {e.id}</span>
                  <span>
                    <span className="text-primary font-semibold">{e.speed}</span>
                    <span className="text-muted-foreground"> mph · {LANE_NAMES[e.lane]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl p-6 relative overflow-hidden ${
        highlight ? "ring-1 ring-primary/40" : ""
      }`}
    >
      {highlight && (
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
      )}
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function Lane({
  lane,
  vehicles,
  congested,
}: {
  lane: number;
  vehicles: Vehicle[];
  congested: boolean;
}) {
  return (
    <div
      className={`relative h-20 rounded-xl overflow-hidden border ${
        congested ? "border-primary/60" : "border-border"
      } bg-gradient-to-b from-[oklch(0.2_0.02_250)] to-[oklch(0.16_0.02_250)]`}
    >
      {/* Lane label */}
      <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-muted-foreground z-10">
        {LANE_NAMES[lane]}
      </div>

      {/* Dashed center line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-muted-foreground/30" />

      {/* Piezo plates at 35% and 60% */}
      <Plate position={35} active={vehicles.some((v) => Math.abs(v.progress - 0.35) < 0.02)} />
      <Plate position={60} active={vehicles.some((v) => Math.abs(v.progress - 0.6) < 0.02)} />

      {/* Vehicles */}
      {vehicles.map((v) => (
        <div
          key={v.id}
          className="absolute top-1/2 -translate-y-1/2 transition-none"
          style={{ left: `${v.progress * 100}%` }}
        >
          <div className="relative -translate-x-1/2">
            <Car
              className="h-6 w-6 text-primary drop-shadow-[0_0_8px_oklch(0.85_0.22_145_/_0.6)]"
              fill="currentColor"
            />
          </div>
        </div>
      ))}

      {congested && (
        <div className="absolute right-3 top-2 text-[10px] uppercase tracking-widest text-primary z-10 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-neon" />
          Congested
        </div>
      )}
    </div>
  );
}

function Plate({ position, active }: { position: number; active: boolean }) {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 h-12 w-1.5 rounded-full"
      style={{ left: `${position}%` }}
    >
      <div
        className={`h-full w-full rounded-full transition-all ${
          active ? "bg-primary shadow-neon" : "bg-primary/30"
        }`}
      />
    </div>
  );
}
