// Single source of truth for the Ditin Displays brand kit values.
// Colors and type choices come from the Ditin Displays brand kit handoff.
export const brand = {
  colors: {
    green: "#06923E", // primary accent — CTAs, rental emphasis
    ink: "#111111", // primary text / dark surfaces
    inkSoft: "#212121",
    accentOrange: "#E67514", // sparing, accent-led applications only
  },
  logo: {
    // Written name rule: "Ditin Displays" on first mention per page/section,
    // "Ditin" after. Never "DITIN DISPLAYS", "DitinDisplays", or "Ditin-Displays".
    fullName: "Ditin Displays",
    shortName: "Ditin",
    // Footer signature only — once per surface, never stacked directly under
    // the "Displays" wordmark (per brand kit handoff rules).
    tagline: "See Beyond the frame",
  },
  // PLACEHOLDER CONTACT INFO — none of this was provided; replace with the
  // real details before launch. Kept in one place so it's a single edit.
  contact: {
    whatsappNumber: "9647500000000", // digits only, no "+", used in wa.me links
    whatsappDisplay: "+964 750 000 0000",
    email: "hello@example.com",
    phone: "+964 750 000 0000",
  },
} as const
