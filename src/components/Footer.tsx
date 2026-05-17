export interface FooterProps {
  siteName: string
  /** Telif yılı; verilmezse geçerli yıl kullanılır. */
  year?: number
  /** İsteğe bağlı kısa not veya bağlantı metni. */
  tagline?: string
}

export default function Footer({ siteName, year, tagline }: FooterProps) {
  const displayYear = year ?? new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 print:hidden dark:border-[#3c3c3c] dark:bg-[#252526]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <p className="text-sm text-neutral-600 dark:text-[#cccccc]">
            © {displayYear} {siteName}
          </p>
          {tagline ? (
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-[#858585]">
              {tagline}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
