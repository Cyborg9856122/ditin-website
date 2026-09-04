// Domain types. This is the vocabulary the rest of the app (UI + business
// logic) should import from — NOT the generated Supabase types directly.
// Keeps the domain layer decoupled from the database schema shape.
import type { Enums, Tables } from "@/lib/data-access/supabase/database.types"

export type Role = Enums<"app_role">
export type ProductCategory = Enums<"product_category">
export type Placement = Enums<"placement_type">
export type Availability = Enums<"availability_type">
export type RentOrBuyChoice = Enums<"rent_or_buy_choice">
export type ProductStatus = Enums<"product_status">
export type InquiryStatus = Enums<"inquiry_status">

export type Profile = Tables<"profiles">
export type Product = Tables<"products">
export type ProductImage = Tables<"product_images">
export type Inquiry = Tables<"inquiries">
export type SpecField = Tables<"spec_fields">
export type ProductSpecValue = Tables<"product_spec_values">

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  led_wall: "LED walls",
  lcd_video_wall: "LCD video walls",
  commercial_display: "Commercial display screens",
  interactive_touch: "Interactive & touch screens",
  outdoor_weatherproof: "Outdoor & weatherproof displays",
}

export const PLACEMENT_LABELS: Record<Placement, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Indoor & outdoor",
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  rent: "Rent",
  buy: "Buy",
  both: "Rent or buy",
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
}
