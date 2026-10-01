// The repository manifest, not this app's. That is the one the release pipeline
// versions, so it is what the footer should report.
import packageJson from "@root/package.json"

const siteHref = "https://www.rj11.io/"

function SiteLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={siteHref}
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 text-xs text-muted-foreground sm:px-8 lg:px-10">
        <div className="flex items-center gap-1">
          <SiteLink>© 2026 rj11io</SiteLink>
        </div>
        {/*
          The one place the site says what it is not. Every game named on the
          site is referred to by its official name; none of them is ours, and
          none of their owners endorse this site. One line here, site wide,
          instead of a line on every post.
        */}
        <p className="basis-full text-center sm:basis-auto sm:text-left">
          An unofficial fan site. Game names and trademarks belong to their owners, who do not endorse this site.
        </p>
        <span>v{packageJson.version}</span>
      </div>
    </footer>
  )
}
