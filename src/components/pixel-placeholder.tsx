// Branded stand-in for products that don't have real photography yet.
// A little grid of "pixels" (this is an LED display company, after all)
// that softly pulses instead of a flat "no photo" box. Pure CSS animation —
// safe to render on the server, no client JS needed.
const COLS = 10
const ROWS = 6

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.7) * 10000
  return x - Math.floor(x)
}

export function PixelPlaceholder({
  label = "Photo coming soon",
  className = "",
}: {
  label?: string
  className?: string
}) {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const r = seededRandom(i + 1)
    const lit = r > 0.91
    const accent = r > 0.975
    return { lit, accent, delay: (seededRandom(i + 50) * 5).toFixed(2) }
  })

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-brand-ink ${className}`}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(6,146,62,0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(230,117,20,0.18), transparent 50%)",
        }}
      />
      <div
        className="relative grid gap-[3px] p-4"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-[1px] sm:h-2 sm:w-2"
            style={{
              backgroundColor: cell.lit
                ? cell.accent
                  ? "var(--color-brand-accent)"
                  : "var(--color-brand-green)"
                : "rgba(255,255,255,0.08)",
              animation: cell.lit ? "pixel-pulse 4.5s ease-in-out infinite" : undefined,
              animationDelay: `${cell.delay}s`,
            }}
          />
        ))}
      </div>
      {label ? (
        <p className="absolute bottom-3 left-0 right-0 text-center text-[11px] font-medium uppercase tracking-wide text-white/50">
          {label}
        </p>
      ) : null}
    </div>
  )
}
