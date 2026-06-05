export const colors = {
  primary: "#0a0a0a",
  ink: "#0a0a0a",
  body: "#3a3a3a",
  muted: "#6a6a6a",
  hairline: "#e5e5e5",
  canvas: "#fffaf0",
  surfaceSoft: "#faf5e8",
  surfaceCard: "#f5f0e0",
  brandPink: "#ff4d8b",
  brandTeal: "#1a3a3a",
  brandLavender: "#b8a4ed",
  brandPeach: "#ffb084",
  brandOchre: "#e8b94a",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
} as const;

export const categoryStyles = {
  sortie: {
    slug: "sortie",
    label: "Sortie romantique",
    bg: colors.brandPink,
    text: "#ffffff",
  },
  date: {
    slug: "date",
    label: "Date / rendez-vous",
    bg: colors.brandLavender,
    text: colors.ink,
  },
  pratique: {
    slug: "pratique",
    label: "Pratique",
    bg: colors.brandPeach,
    text: colors.ink,
  },
  intimite: {
    slug: "intimite",
    label: "Intimité",
    bg: colors.brandTeal,
    text: "#ffffff",
  },
} as const;

export type CategorySlug = keyof typeof categoryStyles;

export function getCategoryStyle(slug: string) {
  return (
    categoryStyles[slug as CategorySlug] ?? {
      slug,
      label: slug,
      bg: colors.surfaceCard,
      text: colors.ink,
    }
  );
}
