const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line text-muted">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-14 sm:px-8">
        <p className="text-sm">&copy; {currentYear} Prva postava</p>
      </div>
    </footer>
  )
}
