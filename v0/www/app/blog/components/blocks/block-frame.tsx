import type { ReactNode } from "react"

/**
 * The frame every block component sits in: a figure with the optional title
 * and description as its caption. Server component, so the caption is in the
 * HTML before any script runs; the interactive part is the child.
 */
export function BlockFrame({
  title,
  description,
  label,
  children,
}: {
  title?: string
  description?: string
  /** Accessible name when there is no title. */
  label: string
  children: ReactNode
}) {
  return (
    <figure
      aria-label={title ? undefined : label}
      className="my-8 overflow-hidden border border-border bg-card"
    >
      {title || description ? (
        <figcaption className="border-b border-border px-5 py-4">
          {title ? (
            <p className="font-semibold text-foreground">{title}</p>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </figcaption>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  )
}

/** The development-only red box shared by every block, nothing in production. */
export function BlockError({ language, message }: { language: string; message: string }) {
  return process.env.NODE_ENV === "development" ? (
    <div className="my-8 border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      <p className="font-semibold">{language} block {message}</p>
      <p className="mt-1">The build validator reports the same message, so this never reaches a published page.</p>
    </div>
  ) : null
}
