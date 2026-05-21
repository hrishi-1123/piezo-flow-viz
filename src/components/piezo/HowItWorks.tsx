import { Zap, Gauge, Network, BatteryCharging, Layers } from "lucide-react";

const steps = [
  {
    icon: Layers,
    title: "Dual-Flow Continuous Piezo Pavement",
    desc: "Thousands of small circular piezo plates pave both Southbound and Northbound platforms — a seamless, high-density sensing surface across every lane.",
    accent: true,
  },
  {
    icon: Zap,
    title: "Kinetic Impact",
    desc: "Vehicle tires press the circular plates, instantly generating a power pulse and microsecond-timestamped signal per direction.",
  },
  {
    icon: Gauge,
    title: "Δt Speed Calculation",
    desc: "An embedded edge AI model measures the microsecond delay between successive plates to compute exact velocity per lane and per flow.",
  },
  {
    icon: Network,
    title: "Density & Lane Analytics",
    desc: "Aggregated readings separate Northbound (cyan) and Southbound (magenta) flows, identifying bottlenecks per platform in real-time.",
  },
  {
    icon: BatteryCharging,
    title: "100% Self-Sustained",
    desc: "Harvested kinetic energy from both directions powers the sensors and on-site AI processing — zero grid dependency.",
  },
];


export function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/80">How it works</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          From Tire Pressure to <span className="text-gradient-neon">Traffic Intelligence</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={`glass rounded-2xl p-6 relative group transition-all ${
              s.accent
                ? "ring-1 ring-primary/40 hover:ring-primary/70"
                : "hover:border-primary/50"
            }`}
          >
            <div className="absolute top-4 right-5 text-5xl font-bold text-primary/10 select-none">
              0{i + 1}
            </div>
            {s.accent && (
              <div className="absolute inset-x-6 bottom-6 h-10 rounded-md overflow-hidden opacity-70 piezo-pavement-cyan" />
            )}
            <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 relative">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

