export function LoadingState() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      aria-busy="true"
      aria-label="Yükleniyor"
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 space-y-4"
        >
          <div className="h-6 bg-[var(--color-neutral-100)] rounded-lg w-1/3 animate-pulse" />
          <div className="h-9 bg-[var(--color-neutral-100)] rounded-xl animate-pulse" />
          <div className="flex gap-2">
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="h-7 w-20 bg-[var(--color-neutral-100)] rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-10 bg-[var(--color-neutral-100)] rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
