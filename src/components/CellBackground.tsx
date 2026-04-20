"use client";

export default function CellBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      {/* Large organic blob - top right */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] animate-morph opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--teal-mid), var(--sage-light) 60%, transparent 70%)",
        }}
      />
      {/* Medium blob - left */}
      <div
        className="absolute top-[40%] -left-24 w-[350px] h-[350px] animate-morph animate-float opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, var(--sage), var(--teal-light) 50%, transparent 70%)",
          animationDelay: "-4s",
        }}
      />
      {/* Small cell shapes scattered */}
      <div
        className="absolute top-[20%] right-[15%] w-16 h-16 rounded-full border border-teal-mid/10 animate-drift"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="absolute top-[60%] right-[25%] w-10 h-10 rounded-full border border-sage/10 animate-drift"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute top-[75%] left-[10%] w-8 h-8 rounded-full bg-teal-light/5 animate-drift"
        style={{ animationDelay: "-10s" }}
      />
      {/* Mitosis-inspired figure */}
      <div className="absolute top-[55%] right-[8%] opacity-[0.04] animate-cell">
        <svg width="120" height="60" viewBox="0 0 120 60">
          <ellipse cx="35" cy="30" rx="30" ry="25" fill="var(--teal-deep)" />
          <ellipse cx="85" cy="30" rx="30" ry="25" fill="var(--teal-deep)" />
          <ellipse cx="60" cy="30" rx="12" ry="20" fill="var(--sage)" opacity="0.5" />
        </svg>
      </div>
      {/* DNA helix dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-teal-mid/[0.06] animate-drift"
          style={{
            top: `${15 + i * 10}%`,
            left: `${85 + Math.sin(i * 0.8) * 5}%`,
            animationDelay: `${-i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
