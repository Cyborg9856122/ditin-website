"use client"

import { useMemo, useState } from "react"

// Industry rule-of-thumb (not exact optics — actual comfort also depends on
// content and lighting):
//   minimum viewing distance (m)  ≈ pixel pitch (mm) × 1
//   optimal viewing distance (m)  ≈ pixel pitch (mm) × 2  to  × 3
function distanceFromPitch(pitchMm: number) {
  return {
    minimum: pitchMm * 1,
    optimalMin: pitchMm * 2,
    optimalMax: pitchMm * 3,
  }
}

function pitchFromDistance(distanceM: number) {
  return {
    maxAcceptable: distanceM,
    optimalMin: distanceM / 3,
    optimalMax: distanceM / 2,
  }
}

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(n < 10 ? 1 : 0) : "—")

export function PixelPitchCalculator({
  initialPitchMm,
  compact = false,
}: {
  initialPitchMm?: number
  compact?: boolean
}) {
  const [mode, setMode] = useState<"byDistance" | "byPitch">(
    initialPitchMm ? "byPitch" : "byDistance",
  )
  const [distance, setDistance] = useState(6)
  const [pitch, setPitch] = useState(initialPitchMm ?? 2.6)

  const pitchResult = useMemo(() => pitchFromDistance(distance), [distance])
  const distanceResult = useMemo(() => distanceFromPitch(pitch), [pitch])

  return (
    <div
      className={
        compact
          ? "rounded-lg border border-neutral-200 bg-neutral-50 p-5"
          : "rounded-xl border border-neutral-200 bg-white p-6 sm:p-8"
      }
    >
      {!compact ? (
        <div className="mb-6 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("byDistance")}
            className={`rounded px-3.5 py-1.5 font-medium transition ${
              mode === "byDistance"
                ? "bg-white text-brand-ink shadow-sm"
                : "text-neutral-500 hover:text-brand-ink"
            }`}
          >
            I know my space
          </button>
          <button
            type="button"
            onClick={() => setMode("byPitch")}
            className={`rounded px-3.5 py-1.5 font-medium transition ${
              mode === "byPitch"
                ? "bg-white text-brand-ink shadow-sm"
                : "text-neutral-500 hover:text-brand-ink"
            }`}
          >
            I have a pixel pitch
          </button>
        </div>
      ) : null}

      {mode === "byDistance" ? (
        <div>
          <label htmlFor="pp-distance" className="text-sm font-medium text-brand-ink">
            Closest viewers will stand (meters)
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id="pp-distance"
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-brand-green"
            />
            <span className="font-measured w-14 shrink-0 text-right text-sm font-semibold text-brand-ink">
              {fmt(distance)}m
            </span>
          </div>

          <div className="mt-5 rounded-md bg-brand-green/5 p-4">
            <p className="text-sm text-neutral-700">
              Look for a pixel pitch of{" "}
              <span className="font-measured font-semibold text-brand-ink">
                {fmt(pitchResult.optimalMin)}–{fmt(pitchResult.optimalMax)}mm
              </span>{" "}
              for a sharp image at that distance.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Up to {fmt(pitchResult.maxAcceptable)}mm will still look clean, just less crisp.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="pp-pitch" className="text-sm font-medium text-brand-ink">
            Pixel pitch (mm)
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id="pp-pitch"
              type="range"
              min={0.9}
              max={10}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-brand-green"
            />
            <span className="font-measured w-14 shrink-0 text-right text-sm font-semibold text-brand-ink">
              {fmt(pitch)}mm
            </span>
          </div>

          <div className="mt-5 rounded-md bg-brand-green/5 p-4">
            <p className="text-sm text-neutral-700">
              Comfortable from{" "}
              <span className="font-measured font-semibold text-brand-ink">
                {fmt(distanceResult.optimalMin)}–{fmt(distanceResult.optimalMax)}m
              </span>{" "}
              away, minimum {fmt(distanceResult.minimum)}m.
            </p>
          </div>
        </div>
      )}

      {!compact ? (
        <p className="mt-4 text-xs text-neutral-400">
          A general guide, not an exact spec — actual comfort also depends on content and
          lighting. Tell us your space in an inquiry and we&apos;ll confirm the right fit.
        </p>
      ) : null}
    </div>
  )
}
