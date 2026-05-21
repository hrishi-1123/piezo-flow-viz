import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/piezo/Hero";
import { SimulationDashboard } from "@/components/piezo/SimulationDashboard";
import { HowItWorks } from "@/components/piezo/HowItWorks";
import { SiteHeader, SiteFooter } from "@/components/piezo/SiteChrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PiezoFlow AI — Self-Powered, AI-Driven Smart Traffic Management" },
      {
        name: "description",
        content:
          "PiezoFlow AI uses piezoelectric road sensors and edge AI to measure vehicle speed in microseconds, detect lane congestion, and harvest kinetic energy — all in real time.",
      },
      { property: "og:title", content: "PiezoFlow AI — Smart Traffic, Powered by the Road" },
      {
        property: "og:description",
        content: "Energy harvesting + high-precision AI traffic analytics from piezoelectric plates.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <SimulationDashboard />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
