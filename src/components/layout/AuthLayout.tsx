import { cn } from "@/lib/utils"

type AuthLayoutProps = {
  children: React.ReactNode
  illustration?: React.ReactNode
  className?: string
}

export function AuthLayout({
  children,
  illustration,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-6xl flex-col bg-background px-4 py-8 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-12",
        className
      )}
    >
      {illustration ? (
        <div className="mb-8 flex flex-1 items-center justify-center lg:mb-0">
          <div className="w-full max-w-md rounded-xl bg-surface-soft p-6 lg:p-10">
            {illustration}
          </div>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-center lg:max-w-md">
        {children}
      </div>
    </div>
  )
}
