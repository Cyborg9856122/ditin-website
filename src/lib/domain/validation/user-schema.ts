import { z } from "zod"

export const inviteUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  fullName: z.string().trim().min(2, "Name is required.").max(200),
  role: z.enum(["owner", "editor", "viewer"]),
})

export type InviteUserValues = z.infer<typeof inviteUserSchema>
