export default function SiteBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 via-amber-100/30 to-transparent dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent" />
      <div className="absolute top-[8%] right-[-12%] size-[22rem] rounded-full bg-[var(--hero-glow)] blur-3xl sm:size-[34rem]" />
      <div className="absolute bottom-[-20%] left-[-12%] size-[18rem] rounded-full bg-orange-100/60 blur-3xl sm:size-[26rem] dark:bg-orange-500/10" />
    </div>
  );
}
