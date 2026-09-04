"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  deleteProductImageAction,
  reorderProductImagesAction,
  setPrimaryImageAction,
} from "../actions"

export type PhotoManagerImage = {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

type UploadItem = {
  key: string
  name: string
  progress: number
  status: "uploading" | "done" | "error"
  error?: string
}

export function PhotoManager({
  productId,
  images,
  canEdit,
}: {
  productId: string
  images: PhotoManagerImage[]
  canEdit: boolean
}) {
  const router = useRouter()
  const [order, setOrder] = useState(images)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const dragIndex = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Re-sync when the server gives us a fresh list (after router.refresh()).
  if (
    images.length !== order.length ||
    images.some((img, i) => img.id !== order[i]?.id || img.isPrimary !== order[i]?.isPrimary)
  ) {
    setOrder(images)
  }

  function uploadOneFile(file: File, key: string): Promise<void> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append("file", file)

      xhr.open("POST", `/api/admin/products/${productId}/images`)
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return
        const progress = Math.round((e.loaded / e.total) * 100)
        setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, progress } : u)))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploads((prev) =>
            prev.map((u) => (u.key === key ? { ...u, progress: 100, status: "done" } : u)),
          )
        } else {
          let message = "Upload failed."
          try {
            message = JSON.parse(xhr.responseText).error ?? message
          } catch {
            // ignore — use default message
          }
          setUploads((prev) =>
            prev.map((u) => (u.key === key ? { ...u, status: "error", error: message } : u)),
          )
        }
        resolve()
      }
      xhr.onerror = () => {
        setUploads((prev) =>
          prev.map((u) =>
            u.key === key ? { ...u, status: "error", error: "Network error." } : u,
          ),
        )
        resolve()
      }
      xhr.send(formData)
    })
  }

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (imageFiles.length === 0) return

    const queued: UploadItem[] = imageFiles.map((f, i) => ({
      key: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      progress: 0,
      status: "uploading",
    }))
    setUploads((prev) => [...prev, ...queued])
    setShowSuccess(false)
    if (successTimer.current) clearTimeout(successTimer.current)

    // Uploaded one at a time — the server assigns sort order / primary
    // status from the current image count, so concurrent requests could
    // race and clash.
    for (let i = 0; i < imageFiles.length; i++) {
      await uploadOneFile(imageFiles[i], queued[i].key)
    }

    router.refresh()
    setShowSuccess(true)
    successTimer.current = setTimeout(() => {
      setUploads([])
      setShowSuccess(false)
    }, 4000)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDraggingFiles(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  function handleImageDragStart(index: number) {
    dragIndex.current = index
  }

  function handleImageDrop(index: number) {
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === index) return

    const next = [...order]
    const [moved] = next.splice(from, 1)
    next.splice(index, 0, moved)
    setOrder(next)
    reorderProductImagesAction(
      productId,
      next.map((img) => img.id),
    )
  }

  async function handleSetPrimary(imageId: string) {
    setOrder((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
    await setPrimaryImageAction(productId, imageId)
    router.refresh()
  }

  async function handleDelete(imageId: string) {
    if (!confirm("Delete this photo? This can't be undone.")) return
    setOrder((prev) => prev.filter((img) => img.id !== imageId))
    await deleteProductImageAction(productId, imageId)
    router.refresh()
  }

  const uploadingCount = uploads.filter((u) => u.status === "uploading").length

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {order.map((image, index) => (
          <div
            key={image.id}
            draggable={canEdit}
            onDragStart={() => handleImageDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleImageDrop(index)}
            className={`group relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 ${
              canEdit ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="200px"
              className="object-contain p-1"
            />
            {image.isPrimary ? (
              <span className="absolute left-1 top-1 rounded bg-brand-green px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Primary
              </span>
            ) : null}
            {canEdit ? (
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                {!image.isPrimary ? (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(image.id)}
                    title="Set as primary"
                    aria-label="Set as primary image"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-ink transition hover:bg-white"
                  >
                    <StarIcon />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  title="Delete photo"
                  aria-label="Delete photo"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 transition hover:bg-white"
                >
                  <TrashIcon />
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {canEdit ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDraggingFiles(true)
          }}
          onDragLeave={() => setIsDraggingFiles(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
            isDraggingFiles
              ? "border-brand-green bg-brand-green/5"
              : "border-neutral-300 hover:border-neutral-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
          <span className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            Upload Photos
          </span>
          <p className="text-xs text-neutral-500">
            Or drag and drop images here — multiple at once, uploads start automatically.
          </p>
        </div>
      ) : null}

      {uploads.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          {uploads.map((u) => (
            <div key={u.key} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="truncate text-neutral-600">{u.name}</span>
                <span
                  className={
                    u.status === "error"
                      ? "text-red-600"
                      : u.status === "done"
                        ? "text-brand-green"
                        : "text-neutral-500"
                  }
                >
                  {u.status === "error" ? "Failed" : u.status === "done" ? "Done" : `${u.progress}%`}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    u.status === "error" ? "bg-red-500" : "bg-brand-green"
                  }`}
                  style={{ width: `${u.status === "error" ? 100 : u.progress}%` }}
                />
              </div>
              {u.error ? <p className="mt-0.5 text-red-600">{u.error}</p> : null}
            </div>
          ))}
          {uploadingCount === 0 && showSuccess ? (
            <p className="text-xs font-medium text-brand-green">
              All photos uploaded successfully.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.6 6.8L12 17.6l-6.2 3.4 1.6-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 .6 12.1a2 2 0 0 0 2 1.9h4.8a2 2 0 0 0 2-1.9L18 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
