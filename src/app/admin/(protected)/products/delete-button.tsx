"use client"

export function DeleteProductButton({
  action,
  productName,
}: {
  action: () => Promise<void>
  productName: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This can't be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  )
}
