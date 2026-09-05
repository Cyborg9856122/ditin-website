"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Fades and slides a block in once it scrolls into view, then leaves it
 * alone (the observer disconnects after the first trigger — this is a
 * one-time entrance, not a repeating scroll effect). Wraps children in a
 * plain div; layout impact is the same as any other block-level wrapper.
 *
 * Actual motion lives in the .reveal / .reveal-visible CSS in globals.css,
 * which collapses to an instant, motionless state under
 * prefers-reduced-motion — this component only toggles the class.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`}
      style={visible && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
