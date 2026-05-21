import { Activity } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="container mx-auto px-4 pt-4">
        <nav className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold">
            <span className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </span>
            <span>
              Piezo<span className="text-primary">Flow</span> AI
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#dashboard" className="hover:text-foreground transition">Dashboard</a>
            <a href="#durability" className="hover:text-foreground transition">Durability</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#dashboard" className="text-primary hover:text-primary/80 transition">Live Demo →</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-10">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <div>© {new Date().getFullYear()} PiezoFlow AI · Powered by the road.</div>
        <div>Edge AI · Piezoelectric Sensors · Self-Sustained Infrastructure</div>
      </div>
    </footer>
  );
}
