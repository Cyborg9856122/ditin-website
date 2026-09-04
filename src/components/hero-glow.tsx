"use client"

import { useEffect, useRef, useState } from "react"

// Brand green -> brand accent orange, interpolated by horizontal position.
const GREEN = { r: 6, g: 146, b: 62 }
const ORANGE = { r: 230, g: 117, b: 20 }

function mixColor(t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  const r = Math.round(GREEN.r + (ORANGE.r - GREEN.r) * clamped)
  const g = Math.round(GREEN.g + (ORANGE.g - GREEN.g) * clamped)
  const b = Math.round(GREEN.b + (ORANGE.b - GREEN.b) * clamped)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Interactive glow layered over the hero's pixel-grid background. On
 * desktops with a precise pointer it follows the cursor and tints nearby
 * grid lines green-to-orange by horizontal position. On touch devices, or
 * when the visitor has reduced motion enabled, it falls back to a static
 * (non-animated) green-to-orange gradient wash — no mouse tracking at all.
 */
export function HeroGlow() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [canTrackMouse, setCanTrackMouse] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)")

    const update = () => setCanTrackMouse(fineHover.matches && !reduceMotion.matches)
    update()

    reduceMotion.addEventListener("change", update)
    fineHover.addEventListener("change", update)
    return () => {
      reduceMotion.removeEventListener("change", update)
      fineHover.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => {
    if (!canTrackMouse) return
    const glow = glowRef.current
    const section = anchorRef.current?.parentElement
    if (!glow || !section) return

    function handleMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glow!.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`)
      glow!.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`)
      glow!.style.setProperty("--glow-color", mixColor(x / rect.width))
      glow!.style.opacity = "1"
    }

    function handleLeave() {
      glow!.style.opacity = "0"
    }

    section.addEventListener("mousemove", handleMove)
    section.addEventListener("mouseleave", handleLeave)
    return () => {
      section.removeEventListener("mousemove", handleMove)
      section.removeEventListener("mouseleave", handleLeave)
    }
  }, [canTrackMouse])

  return (
    <div ref={anchorRef} aria-hidden className="pointer-events-none absolute inset-0">
      {canTrackMouse ? (
        <div ref={glowRef} className="bg-pixel-grid-glow" />
      ) : (
        <div className="bg-pixel-grid-glow-static" />
      )}
    </div>
  )
}
