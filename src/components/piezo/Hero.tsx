import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Activity } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.85 0.22 145) 1px, transparent 1px), linear-gradient(90deg, oklch(0.85 0.22 145) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="container mx-auto px-4 pt-32 pb-24 relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-neon" />
            Edge AI · Piezoelectric Sensing · Self-Powered
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Self-Powered.{" "}
            <span className="text-gradient-neon">AI-Driven.</span>
            <br />
            The Future of Smart Traffic Management.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            PiezoFlow AI fuses energy harvesting with high-precision traffic analytics —
            measuring vehicle speed in microseconds and detecting lane congestion in real time,
            all powered by the road itself.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"
              asChild
            >
              <a href="#dashboard">
                <Activity className="h-5 w-5" />
                Launch Live Simulation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-border/80" asChild>
              <a href="#how">How it works</a>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Stat value="±0.5%" label="Speed accuracy" />
            <Stat value="0 kWh" label="Grid energy used" icon={<Zap className="h-3.5 w-3.5" />} />
            <Stat value="3-Lane" label="Real-time coverage" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-2xl md:text-3xl font-bold text-gradient-neon flex items-center justify-center gap-1">
        {icon}
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
