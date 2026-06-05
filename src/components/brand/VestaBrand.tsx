import Link from "next/link";
import { cn } from "@/lib/utils";
import { VestaIcon } from "@/components/brand/VestaIcon";

const sizes = {
  sm: {
    icon: "size-6",
    wordmark: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    icon: "size-9",
    wordmark: "text-lg",
    gap: "gap-2",
  },
  lg: {
    icon: "size-12",
    wordmark: "text-xl",
    gap: "gap-3",
  },
} as const;

type VestaBrandProps = {
  size?: keyof typeof sizes;
  showWordmark?: boolean;
  wordmark?: string;
  href?: string;
  className?: string;
  suppressHydrationWarning?: boolean;
};

export function VestaBrand({
  size = "md",
  showWordmark = true,
  wordmark = "Vesta",
  href,
  className,
  suppressHydrationWarning,
}: VestaBrandProps) {
  const tokens = sizes[size];

  const content = (
    <>
      <VestaIcon className={tokens.icon} title={showWordmark ? undefined : "Vesta"} />
      {showWordmark ? (
        <span
          suppressHydrationWarning={suppressHydrationWarning}
          className={cn("font-display text-ink", tokens.wordmark)}
        >
          {wordmark}
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex items-center", tokens.gap, className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="Vesta — accueil">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
