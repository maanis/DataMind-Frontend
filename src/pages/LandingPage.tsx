import { ThemeProvider } from "next-themes";
import {
  Navbar,
  HeroSection,
  HowItWorks,
  CapabilitiesSection,
  DeveloperSection,
  CtaSection,
  Footer,
} from "@/components/landing";

function LandingPageInner() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CapabilitiesSection />
      <DeveloperSection />
      <CtaSection />
      <Footer />
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LandingPageInner />
    </ThemeProvider>
  );
}
