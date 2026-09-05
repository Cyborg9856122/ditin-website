"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { PixelPlaceholder } from "@/components/pixel-placeholder"

export type GalleryImage = {
  id: string
  url: string
  alt: string
}

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        {images[0] ? (
          <>
            <Image
              src={images[0].url}
              alt={images[0].alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label="View full-screen image"
              title="View full screen"
              className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-ink opacity-100 shadow transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-lg focus-visible:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green sm:opacity-60 sm:group-hover:opacity-100"
            >
              <EyeIcon />
            </button>
          </>
        ) : (
          <PixelPlaceholder />
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.slice(1).map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`View image ${i + 2} full-screen`}
              title="View full screen"
              className="relative aspect-square cursor-pointer overflow-hidden rounded-md bg-neutral-100 transition-all duration-150 hover:opacity-80 hover:ring-2 hover:ring-brand-green active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="150px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxIndex !== null ? (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  )
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[]
  startIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null,
  )
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchStartDistance = useRef<number | null>(null)
  const pinchStartZoom = useRef(1)

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const clampZoom = (z: number) => Math.min(4, Math.max(1, z))

  const goTo = useCallback(
    (next: number) => {
      const wrapped = (next + images.length) % images.length
      setIndex(wrapped)
      resetView()
    },
    [images.length, resetView],
  )

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") goTo(index + 1)
      if (e.key === "ArrowLeft") goTo(index - 1)
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [goTo, index, onClose])

  function toggleZoom() {
    if (zoom > 1) {
      resetView()
    } else {
      setZoom(clampZoom(2.2))
    }
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom((z) => {
      const next = clampZoom(z - e.deltaY * 0.0025 * z)
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  function pointerDistance(points: { x: number; y: number }[]) {
    const [a, b] = points
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  function handlePointerDown(e: React.PointerEvent) {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    if (activePointers.current.size === 2) {
      // A second finger landed — switch from panning to pinch-zooming.
      dragState.current = null
      pinchStartDistance.current = pointerDistance([...activePointers.current.values()])
      pinchStartZoom.current = zoom
      return
    }

    if (zoom <= 1) return
    dragState.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y }
    setIsDragging(true)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!activePointers.current.has(e.pointerId)) return
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (activePointers.current.size === 2 && pinchStartDistance.current) {
      const distance = pointerDistance([...activePointers.current.values()])
      const next = clampZoom(pinchStartZoom.current * (distance / pinchStartDistance.current))
      setZoom(next)
      if (next === 1) setPan({ x: 0, y: 0 })
      return
    }

    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    setPan({ x: dragState.current.panX + dx, y: dragState.current.panY + dy })
  }

  function handlePointerUp(e: React.PointerEvent) {
    activePointers.current.delete(e.pointerId)
    if (activePointers.current.size < 2) pinchStartDistance.current = null
    dragState.current = null
    setIsDragging(false)
  }

  const current = images[index]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        title="Close"
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:scale-110 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <CloseIcon />
      </button>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
            title="Previous"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:scale-110 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
            title="Next"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:scale-110 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      ) : null}

      <div
        className="relative h-full w-full max-w-5xl touch-none overflow-hidden px-4 py-16"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={toggleZoom}
        onWheel={handleWheel}
      >
        {current ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            sizes="100vw"
            className="select-none object-contain"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? "grab" : "zoom-in",
              transition: isDragging ? "none" : "transform 0.2s ease",
            }}
            draggable={false}
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
          {index + 1} / {images.length}
        </p>
      ) : null}
    </div>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
