/**
 * Generates a random temporary password for newly-created staff accounts.
 * Shown once to the Owner after creation; the new user is expected to reset
 * it via the "forgot password" flow on first login.
 */
export function generateTemporaryPassword(): string {
  const bytes = new Uint8Array(18)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 20)
}
