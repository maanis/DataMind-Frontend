export function DotGrid({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)/0.1) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        opacity,
        maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
}

export function GridLines({ opacity = 0.25 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--border)/0.8) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--border)/0.8) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        opacity,
        maskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}
