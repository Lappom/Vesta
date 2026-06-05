export const colors = {
  primary: "#0a0a0a",
  primaryActive: "#1f1f1f",
  ink: "#0a0a0a",
  body: "#3a3a3a",
  bodyStrong: "#1a1a1a",
  muted: "#6a6a6a",
  mutedSoft: "#9a9a9a",
  hairline: "#e5e5e5",
  hairlineSoft: "#f0f0f0",
  canvas: "#fffaf0",
  surfaceSoft: "#faf5e8",
  surfaceCard: "#f5f0e0",
  surfaceStrong: "#ebe6d6",
  surfaceDark: "#0a1a1a",
  brandPink: "#ff4d8b",
  brandTeal: "#1a3a3a",
  brandLavender: "#b8a4ed",
  brandPeach: "#ffb084",
  brandOchre: "#e8b94a",
  brandMint: "#a4d4c5",
  brandCoral: "#ff6b5a",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  onPrimary: "#ffffff",
  onDark: "#ffffff",
} as const;

export const featureCardVariants = {
  pink: {
    bg: colors.brandPink,
    text: colors.onDark,
    className: "feature-card-pink",
  },
  teal: {
    bg: colors.brandTeal,
    text: colors.onDark,
    className: "feature-card-teal",
  },
  lavender: {
    bg: colors.brandLavender,
    text: colors.ink,
    className: "feature-card-lavender",
  },
  peach: {
    bg: colors.brandPeach,
    text: colors.ink,
    className: "feature-card-peach",
  },
  ochre: {
    bg: colors.brandOchre,
    text: colors.ink,
    className: "feature-card-ochre",
  },
  cream: {
    bg: colors.surfaceCard,
    text: colors.ink,
    className: "feature-card-cream",
  },
} as const;

export type FeatureCardVariant = keyof typeof featureCardVariants;

export function getFeatureCardVariant(variant: FeatureCardVariant) {
  return featureCardVariants[variant];
}

export const categoryStyles = {
  sortie: {
    slug: "sortie",
    label: "Sortie romantique",
    bg: colors.brandPink,
    text: colors.onDark,
    variant: "pink" as FeatureCardVariant,
  },
  date: {
    slug: "date",
    label: "Date / rendez-vous",
    bg: colors.brandLavender,
    text: colors.ink,
    variant: "lavender" as FeatureCardVariant,
  },
  pratique: {
    slug: "pratique",
    label: "Pratique",
    bg: colors.brandPeach,
    text: colors.ink,
    variant: "peach" as FeatureCardVariant,
  },
  intimite: {
    slug: "intimite",
    label: "Intimité",
    bg: colors.brandTeal,
    text: colors.onDark,
    variant: "teal" as FeatureCardVariant,
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
      variant: "cream" as FeatureCardVariant,
    }
  );
}
